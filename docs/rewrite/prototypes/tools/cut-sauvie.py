#!/usr/bin/env python3
"""Sauvie registered three-plane candidate. Pillow; AI mattes, locked master RGB.

Run: python3 tools/cut-sauvie.py public/gen/layers/sauvie
Restack equality validates color/coverage, not segmentation quality.
"""
from pathlib import Path
from PIL import Image, ImageChops, ImageFilter, ImageOps, ImageStat
import hashlib, json, subprocess, sys

p=Path(sys.argv[1]); master=Image.open(p/'master-wide.png').convert('RGB'); size=master.size; w,h=size

def align(name):
    im=Image.open(p/name).convert('RGB')
    if abs(im.width/im.height-w/h)>.01: raise ValueError('Aspect mismatch: '+name)
    return im.resize(size,Image.Resampling.LANCZOS)

def matte(name):
    out=p/name.replace('-raw','-key')
    subprocess.run([sys.executable,str(Path(__file__).with_name('key.py')),str(p/name),str(out),'--erode','0'],check=True)
    return Image.open(out).getchannel('A').resize(size,Image.Resampling.LANCZOS).point(lambda x:255 if x>=128 else 0)

land=matte('land-raw.png'); near=matte('near-raw.png')
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
result={'status':'candidate; aesthetic selection pending','source_size':list(size),'web_size':[1536,1024],
    'restack_max_difference':max(v[1] for v in diff.getextrema()),'restack_mean_difference':sum(ImageStat.Stat(diff).mean)/3,
    'motion_test_source_px':{'sky':0,'far':2,'near':5},
    'layers':[{'name':name,'sha256':hashlib.sha256((p/f'{name}.png').read_bytes()).hexdigest(),'alpha_extrema':list(im.getchannel('A').getextrema())} for name,im in layers],
    'limitations':['AI mattes may drift at fine skyline and grass edges; inspect isolated and movement proofs','Sky/clouds are one plane; wagons/people stay attached to farmland','Large parallax needs additional hidden-fill review','Overscan/viewport clipping required to hide translated outer image edges']}
(p/'cut-check.json').write_text(json.dumps(result,indent=2)+'\n'); print(json.dumps(result));assert result['restack_max_difference']==0
