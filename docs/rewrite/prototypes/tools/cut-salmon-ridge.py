#!/usr/bin/env python3
"""Salmon ridge candidate: source RGB plus AI near matte and hidden forest fill.

Usage: uv run --with pillow --with numpy --with scipy python tools/cut-salmon-ridge.py <scene-dir> [--rebuild-master]

--rebuild-master (figure-removal step, 2026-10-12): the raw image edit
before-figure-removal/nofigure-raw-v1.png (whole-frame re-render, figure removed) is blended into the
locked portrait only inside a feathered patch around the former figure; everything outside the patch
stays pixel-identical to before-figure-removal/master.png. The result is saved as master.png, then
pasted into the SAME center bounds of the previous wide master (outpainted sides untouched) as
master-wide.png. Without the flag the script cuts planes from the current master-wide.png using the
AI near matte (near-raw.png, with near-raw-v2.png from the figure-free wide inside the former figure zone) and clean.png.
"""
from PIL import Image,ImageChops,ImageFilter,ImageOps,ImageStat
from pathlib import Path
import json,sys,hashlib
p=Path(sys.argv[1])
BOUNDS=(543,0,1629,1448)

if '--rebuild-master' in sys.argv:
 import numpy as np
 from scipy import ndimage as ndi
 b4=p/'before-figure-removal'
 A=Image.open(b4/'master.png').convert('RGB');B=Image.open(b4/'nofigure-raw-v1.png').convert('RGB');OW=Image.open(b4/'master-wide.png').convert('RGB')
 assert A.size==B.size==(1086,1448)
 assert np.abs(np.array(OW.crop(BOUNDS)).astype(int)-np.array(A).astype(int)).max()==0
 a=np.array(A).astype(float);b=np.array(B).astype(float);d=np.abs(a-b).mean(2)
 m=ndi.binary_opening(ndi.uniform_filter(d,25)>22,iterations=3)
 lab,n=ndi.label(m);sizes=ndi.sum(m,lab,range(1,n+1));m=lab==(1+int(np.argmax(sizes)))
 m=ndi.binary_fill_holes(ndi.binary_dilation(m,iterations=45));mf=ndi.gaussian_filter(m.astype(float),14)
 out=np.clip(a*(1-mf[...,None])+b*mf[...,None]+.5,0,255).astype('uint8')
 new=Image.fromarray(out);new.save(p/'master.png',optimize=True)
 W=OW.copy();W.paste(new,BOUNDS[:2]);W.save(p/'master-wide.png',optimize=True)
 Wn=np.array(W).astype(int);On=np.array(OW).astype(int)
 exp={'sourceSize':[1086,1448],'expandedSize':[2172,1448],'originalPortraitBounds':list(BOUNDS),
  'centerMaxDiff':int(np.abs(Wn[:,543:1629]-out.astype(int)).max()),
  'outsideMaxDiffVsPreviousWide':int(max(np.abs(Wn[:,:543]-On[:,:543]).max(),np.abs(Wn[:,1629:]-On[:,1629:]).max())),
  'portraitOutsidePatchMaxDiffVsPreviousPortrait':int(np.abs(out.astype(int)-np.array(A).astype(int))[mf==0].max()),
  'patchPixels':int((mf>0).sum()),
  'outsideBounds':'invented AI outpaint, unchanged from the pre-removal wide master',
  'note':'portrait edited to remove the anonymous seated figure (patch region only); wide master rebuilt by pasting it into the same bounds'}
 (p/'expansion.json').write_text(json.dumps(exp,indent=2));print(exp);assert exp['centerMaxDiff']==0 and exp['outsideMaxDiffVsPreviousWide']==0
 new.resize((1086,1448)).save(p/'master.webp',quality=92,method=6);W.resize((1536,1024),Image.Resampling.LANCZOS).save(p/'master-wide.webp',quality=92,method=6)
 sys.exit(0)

m=Image.open(p/'master-wide.png').convert('RGB');size=m.size;w,h=size

def align(n):
 im=Image.open(p/n).convert('RGB')
 assert abs(im.width/im.height-w/h)<.01
 return im.resize(size,Image.Resampling.LANCZOS)
clean=align('clean.png')
def matte(n):
 raw=align(n);mm=Image.new('L',size);mm.putdata([0 if r>180 and b>150 and g<100 else 255 for r,g,b in raw.getdata()]);return mm
# Previously validated matte (near-raw.png, made from the pre-removal wide) everywhere except the former figure
# zone, where the matte regenerated from the figure-free wide (near-raw-v2.png) is used. A full regenerated matte
# drifted on the invented right-hand trees, so it is not used outside the zone.
near=matte('near-raw.png');ZONE=(632,800,1242,1448);near.paste(matte('near-raw-v2.png').crop(ZONE),ZONE[:2])
# This scene has a clear blue sky, unlike olive inks and cream grasses.
def nonsky(im):
 mask=Image.new('L',size);mask.putdata([0 if b>g+24 and g>r+15 else 255 for r,g,b in im.getdata()]);return mask
actual=nonsky(m);near=ImageChops.multiply(near.filter(ImageFilter.MaxFilter(11)),actual)
# Hidden forest uses the AI clean plate; visible forest keeps locked master color.
far=ImageChops.lighter(nonsky(clean),ImageChops.multiply(actual,ImageChops.invert(near)))
far.paste(255,(0,int(h*.5),w,h))
visiblefar=ImageChops.multiply(far,ImageChops.invert(near));farrgb=Image.composite(m,clean,visiblefar)
# Opaque sky gets visible master sky, with local continuation under isolated branches.
skymask=ImageChops.invert(actual);blur=skymask.filter(ImageFilter.GaussianBlur(10));aa=blur.tobytes();cs=[]
for c in m.split():
 vals=ImageChops.multiply(c,skymask).filter(ImageFilter.GaussianBlur(10)).tobytes();cs.append(Image.frombytes('L',size,bytes(min(255,round(v*255/a)) if a else 0 for v,a in zip(vals,aa))))
skyfill=Image.composite(Image.merge('RGB',cs),clean,blur.point(lambda v:255 if v>4 else 0))
occupied=ImageChops.lighter(far,near);sky=Image.composite(skyfill,m,occupied).convert('RGBA')
farim=farrgb.convert('RGBA');farim.putalpha(far);nearim=m.convert('RGBA');nearim.putalpha(near)
layers=[('sky',sky),('far',farim),('near',nearim)];rest=sky.copy()
for n,im in layers:
 im.save(p/f'{n}.png',optimize=True);im.resize((1536,1024),Image.Resampling.LANCZOS).save(p/f'{n}.webp',quality=92,method=6)
 bg=Image.new('RGBA',size,(180,180,180,255));Image.alpha_composite(bg,im).convert('RGB').resize((1086,724)).save(p/f'isolated-{n}.jpg',quality=95)
 if n!='sky':rest=Image.alpha_composite(rest,im)
rest.convert('RGB').save(p/'restack.png');diff=ImageChops.difference(rest.convert('RGB'),m)
for sign,label in [(-1,'left'),(1,'right')]:
 comp=sky.copy()
 for im,dx in [(farim,1),(nearim,3)]:
  shifted=Image.new('RGBA',size);shifted.paste(im,(sign*dx,0));comp=Image.alpha_composite(comp,shifted)
 comp.convert('RGB').save(p/f'motion-{label}.jpg',quality=96)
ImageOps.fit(m,(1440,900),centering=(.5,.55)).save(p/'crop-desktop.jpg',quality=95)
ImageOps.fit(m,(390,844),centering=(.40,.5)).save(p/'crop-mobile.jpg',quality=95)
check={'sourceSize':list(size),'webSize':[1536,1024],'restackMaxDiff':max(x[1] for x in diff.getextrema()),'restackMeanDiff':sum(ImageStat.Stat(diff).mean)/3,'testedHorizontalSourcePx':{'sky':0,'far':1,'near':3},'planes':[{'name':n,'sha256':hashlib.sha256((p/f'{n}.png').read_bytes()).hexdigest()} for n,_ in layers]};(p/'cut-check.json').write_text(json.dumps(check,indent=2));print(check);assert check['restackMaxDiff']==0
