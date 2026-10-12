#!/usr/bin/env python3
"""Meadows lift: source inks, generated mattes/hidden sky; registered full canvas."""
from pathlib import Path
from PIL import Image,ImageOps,ImageChops,ImageFilter,ImageStat,ImageDraw
import json,sys,hashlib
p=Path(sys.argv[1]);m=Image.open(p/'master.png').convert('RGB');size=m.size;w,h=size

def align(name):
 im=Image.open(p/name).convert('RGB')
 assert abs(im.width/im.height-w/h)<.01
 return im.resize(size,Image.Resampling.LANCZOS)
def matte(name):
 im=align(name); out=Image.new('L',size)
 out.putdata([0 if r>180 and b>150 and g<100 else 255 for r,g,b in im.getdata()]);return out
liftguide=matte('lift-raw.png').filter(ImageFilter.MaxFilter(19));landguide=matte('land-raw.png')
sky=align('sky-raw.png');source=m.load();lift=Image.new('L',size);land=Image.new('L',size);lp=lift.load();gp=land.load();guide=liftguide.load();lg=landguide.load()
# Palette is specific to this candidate: open blue sky is brighter and more chromatic.
for y in range(h):
 for x in range(w):
  r,g,b=source[x,y];is_blue=b>g+15 and g>r+20 and b>100
  if y<h*.49 and guide[x,y] and not lg[x,y] and not is_blue:lp[x,y]=255
  elif y>h*.29 and not is_blue:gp[x,y]=255
  elif lg[x,y] and y>h*.48:gp[x,y]=255
# Include one source-pixel antialias fringe around cable/chair inks.
lift=lift.filter(ImageFilter.MaxFilter(3))
lift=ImageChops.multiply(lift,ImageChops.invert(landguide))
# Solid lower ground; no textured holes in opaque landscape.
land.paste(255,(0,round(h*.58),w,h))
# Fill short gaps in the horizon without broadening cable masks.
land=land.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
# Restore every uncovered source pixel on sky, leaving generated blue only under occluders.
occupied=ImageChops.lighter(land,lift);sky=Image.composite(sky,m,occupied).convert('RGBA')
landrgba=m.convert('RGBA');landrgba.putalpha(land)
# Lift mask includes source ivory seat inks; flat sky beneath removes old cable/seat ghosts.
liftrgba=m.convert('RGBA');liftrgba.putalpha(lift)
layers=[('sky',sky),('terrain',landrgba),('lift',liftrgba)]
rest=sky.copy()
for _,im in layers[1:]:rest=Image.alpha_composite(rest,im)
# Coverage edge cases remain in sky; exact source rest position is retained.
diff=ImageChops.difference(rest.convert('RGB'),m)
for name,im in layers:
 im.save(p/f'{name}.png',optimize=True);im.resize((1440,1080),Image.Resampling.LANCZOS).save(p/f'{name}.webp',quality=90,method=6)
 neutral=Image.new('RGBA',size,(190,190,190,255));Image.alpha_composite(neutral,im).convert('RGB').resize((724,543)).save(p/f'isolated-{name}.jpg',quality=94)
m.save(p/'master-wide.png');m.resize((1440,1080),Image.Resampling.LANCZOS).save(p/'master.webp',quality=90,method=6);m.resize((1440,1080),Image.Resampling.LANCZOS).save(p/'master-wide.webp',quality=90,method=6)
rest.convert('RGB').save(p/'restack.png')
for sign,label in [(-1,'left'),(1,'right')]:
 canvas=sky.copy()
 for (_,im),dx in zip(layers[1:],[1,2]):
  shifted=Image.new('RGBA',size);shifted.paste(im,(sign*dx,0));canvas=Image.alpha_composite(canvas,shifted)
 canvas.convert('RGB').save(p/f'motion-{label}.jpg',quality=95)
ImageOps.fit(rest.convert('RGB'),(1440,900),centering=(.5,.5)).save(p/'crop-desktop.jpg',quality=95)
# Mobile cannot include both left chairs and right peak at a tall crop. Mountain-first candidate.
ImageOps.fit(rest.convert('RGB'),(390,844),centering=(.72,.5)).save(p/'crop-mobile.jpg',quality=95)
check={'status':'candidate; aesthetic approval pending','source_size':list(size),'web_size':[1440,1080],'restack_max_difference':max(c[1] for c in diff.getextrema()),'restack_mean_difference':sum(ImageStat.Stat(diff).mean)/3,'motion_test_source_px':{'terrain':1,'lift':2},'layers':[{'name':n,'sha256':hashlib.sha256((p/f'{n}.png').read_bytes()).hexdigest()} for n,_ in layers]}
(p/'cut-check.json').write_text(json.dumps(check,indent=2)+'\n');print(json.dumps(check));assert check['restack_max_difference']==0
