#!/usr/bin/env python3
"""Salmon ridge candidate: source RGB plus AI near matte and hidden forest fill."""
from PIL import Image,ImageChops,ImageFilter,ImageOps,ImageStat
from pathlib import Path
import json,sys,hashlib
p=Path(sys.argv[1]);m=Image.open(p/'master-wide.png').convert('RGB');size=m.size;w,h=size

def align(n):
 im=Image.open(p/n).convert('RGB')
 assert abs(im.width/im.height-w/h)<.01
 return im.resize(size,Image.Resampling.LANCZOS)
raw=align('near-raw.png');clean=align('clean.png')
near=Image.new('L',size);near.putdata([0 if r>180 and b>150 and g<100 else 255 for r,g,b in raw.getdata()])
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
