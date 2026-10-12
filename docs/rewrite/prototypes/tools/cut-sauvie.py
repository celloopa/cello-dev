#!/usr/bin/env python3
"""Sauvie registered three-plane candidate. Pillow; AI mattes, locked master RGB.

Run: python3 tools/cut-sauvie.py public/gen/layers/sauvie
Restack equality validates color/coverage, not segmentation quality.

People removal (2026-10-12), two steps that need numpy + scipy (use `uv run --with pillow --with numpy --with scipy`):

  --rebuild-master <backup-dir>
      The raw image edit nofigure-raw-v1.png (whole-frame re-render, riders and standing figures removed) is
      blended into the locked portrait only inside a feathered patch around the former people; everything outside the
      patch stays pixel-identical to <backup-dir>/master.png (the pre-removal portrait, kept outside the repo).
      The new portrait is pasted into the SAME center bounds of <backup-dir>/master-wide.png (outpainted sides
      untouched) and saved as master.png / master-wide.png.

  (no flag)
      Cut planes from master-wide.png. Mattes: land-raw.png and near-raw.png (made from the pre-removal wide master)
      are kept everywhere except the former-people zone, where mattes regenerated from the people-free wide master
      (land-raw-v2.png, near-raw-v2.png) are used if present.
"""
from pathlib import Path
from PIL import Image, ImageChops, ImageFilter, ImageOps, ImageStat
import hashlib, json, subprocess, sys

p=Path(sys.argv[1]); BOUNDS=(543,0,1629,1448)
# Former-people zone in wide-master source px: the portrait patch bbox (x 332-808, y 766-1014) shifted by the
# 543 px center offset, plus margin (riders on the wagons and the standing group left of them).
ZONE=(850,730,1400,1040)

if '--rebuild-master' in sys.argv:
    import numpy as np
    from scipy import ndimage as ndi
    b4=Path(sys.argv[sys.argv.index('--rebuild-master')+1])
    A=Image.open(b4/'master.png').convert('RGB'); B=Image.open(p/'nofigure-raw-v1.png').convert('RGB'); OW=Image.open(b4/'master-wide.png').convert('RGB')
    assert A.size==B.size==(1086,1448)
    assert np.abs(np.array(OW.crop(BOUNDS)).astype(int)-np.array(A).astype(int)).max()==0
    a=np.array(A).astype(float); b=np.array(B).astype(float); d=np.abs(a-b).mean(2)
    # The edit re-renders the whole frame (ground grain drifts), so the change map is only trusted for the two
    # components that sit where the people were: riders on the wagons and the standing group.
    m=ndi.binary_opening(ndi.uniform_filter(d,25)>22,iterations=3)
    lab,n=ndi.label(m); keep=np.zeros_like(m)
    for i,sl in enumerate(ndi.find_objects(lab),1):
        ys,xs=sl; size=int((lab[sl]==i).sum())
        if size>=1000 and 380<=xs.start and xs.stop<=760 and 820<=ys.start and ys.stop<=960: keep|=(lab==i)
    assert keep.any()
    m=ndi.binary_fill_holes(ndi.binary_dilation(keep,iterations=28)); mf=ndi.gaussian_filter(m.astype(float),9)
    out=np.clip(a*(1-mf[...,None])+b*mf[...,None]+.5,0,255).astype('uint8')
    new=Image.fromarray(out); new.save(p/'master.png',optimize=True)
    W=OW.copy(); W.paste(new,BOUNDS[:2]); W.save(p/'master-wide.png',optimize=True)
    Wn=np.array(W).astype(int); On=np.array(OW).astype(int)
    ys,xs=np.where(mf>0)
    exp={'source_size':[2172,1448],'original_portrait_bounds':list(BOUNDS),
      'center_max_diff':int(np.abs(Wn[:,543:1629]-out.astype(int)).max()),
      'sides_max_diff_vs_previous_wide':int(max(np.abs(Wn[:,:543]-On[:,:543]).max(),np.abs(Wn[:,1629:]-On[:,1629:]).max())),
      'portrait_outside_patch_max_diff_vs_previous_portrait':int(np.abs(out.astype(int)-np.array(A).astype(int))[mf==0].max()),
      'patch_pixels':int((mf>0).sum()),'patch_bbox_portrait_px':[int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1],
      'expanded_sides':'AI invented continuation, not documented geography (unchanged by the people removal)',
      'note':'portrait edited to remove the wagon riders and the standing group (patch region only); wide master rebuilt by pasting it into the same bounds'}
    (p/'expansion.json').write_text(json.dumps(exp,indent=2)+'\n'); print(exp)
    assert exp['center_max_diff']==0 and exp['sides_max_diff_vs_previous_wide']==0
    new.save(p/'master.webp',quality=92,method=6); W.resize((1536,1024),Image.Resampling.LANCZOS).save(p/'master-wide.webp',quality=92,method=6)
    sys.exit(0)

master=Image.open(p/'master-wide.png').convert('RGB'); size=master.size; w,h=size

def align(name):
    im=Image.open(p/name).convert('RGB')
    if abs(im.width/im.height-w/h)>.01: raise ValueError('Aspect mismatch: '+name)
    return im.resize(size,Image.Resampling.LANCZOS)

def matte(name):
    out=p/name.replace('-raw','-key')
    subprocess.run([sys.executable,str(Path(__file__).with_name('key.py')),str(p/name),str(out),'--erode','0'],check=True)
    return Image.open(out).getchannel('A').resize(size,Image.Resampling.LANCZOS).point(lambda x:255 if x>=128 else 0)

def zoned(name):
    # previously validated matte everywhere; the matte regenerated from the people-free wide only inside ZONE
    base=matte(name); v2=name.replace('-raw.png','-raw-v2.png')
    if (p/v2).exists(): base.paste(matte(v2).crop(ZONE),ZONE[:2])
    return base

land=zoned('land-raw.png'); near=zoned('near-raw.png')
# Bottom land must cover the nearest bank at rest; neither mask is a trimmed sprite.
land=ImageChops.lighter(land,near)
clean=align('clean.png'); sky_fill=align('sky-raw.png')

def bleed(visible,fallback):
    # Continue source colors near occlusion boundaries before using AI fill.
    # This only supports the bounded 2/5 px test; it is not hidden-scene recovery.
    a=visible.filter(ImageFilter.GaussianBlur(8)).tobytes(); channels=[]
    for c in master.split():
        vals=ImageChops.multiply(c,visible).filter(ImageFilter.GaussianBlur(8)).tobytes()
        channels.append(Image.frombytes('L',size,bytes(min(255,round(v*255/aa)) if aa else 0 for v,aa in zip(vals,a))))
    coverage=Image.frombytes('L',size,a).point(lambda x:255 if x>=5 else 0)
    return Image.composite(Image.merge('RGB',channels),fallback,coverage)

visible_land=ImageChops.multiply(land,ImageChops.invert(near))
clean=bleed(visible_land,clean)
sky_fill=bleed(ImageChops.invert(land),sky_fill)
far=Image.composite(master,clean,visible_land).convert('RGBA'); far.putalpha(land)
foreground=master.convert('RGBA'); foreground.putalpha(near)
sky=Image.composite(sky_fill,master,land).convert('RGBA')
layers=[('sky',sky),('far',far),('near',foreground)]
for name,im in layers:
    im.save(p/f'{name}.png',optimize=True)
    im.resize((1536,1024),Image.Resampling.LANCZOS).save(p/f'{name}.webp',quality=90,method=6)
    bg=Image.new('RGBA',size,(190,190,190,255))
    Image.alpha_composite(bg,im).convert('RGB').resize((768,512)).save(p/f'isolated-{name}.jpg',quality=95)
rest=sky.copy()
for _,im in layers[1:]:rest=Image.alpha_composite(rest,im)
rest.convert('RGB').save(p/'restack.png')
diff=ImageChops.difference(rest.convert('RGB'),master)
for sign,label in [(-1,'left'),(1,'right')]:
    prev=sky.copy()
    for (_,im),dx in zip(layers[1:],[2,5]):
        shifted=Image.new('RGBA',size);shifted.paste(im,(sign*dx,0));prev=Image.alpha_composite(prev,shifted)
    prev.convert('RGB').save(p/f'motion-{label}.jpg',quality=95)
ImageOps.fit(rest.convert('RGB'),(1440,900),centering=(.5,.5)).save(p/'crop-desktop.jpg',quality=95)
ImageOps.fit(rest.convert('RGB'),(390,844),centering=(.53,.5)).save(p/'crop-mobile.jpg',quality=95)
result={'status':'candidate; people removed 2026-10-12; aesthetic selection pending','source_size':list(size),'web_size':[1536,1024],
    'restack_max_difference':max(v[1] for v in diff.getextrema()),'restack_mean_difference':sum(ImageStat.Stat(diff).mean)/3,
    'motion_test_source_px':{'sky':0,'far':2,'near':5},
    'layers':[{'name':name,'sha256':hashlib.sha256((p/f'{name}.png').read_bytes()).hexdigest(),'alpha_extrema':list(im.getchannel('A').getextrema())} for name,im in layers],
    'limitations':['AI mattes may drift at fine skyline and grass edges; inspect isolated and movement proofs','Sky/clouds are one plane; the empty wagons stay attached to farmland','Large parallax needs additional hidden-fill review','Overscan/viewport clipping required to hide translated outer image edges']}
(p/'cut-check.json').write_text(json.dumps(result,indent=2)+'\n'); print(json.dumps(result));assert result['restack_max_difference']==0
