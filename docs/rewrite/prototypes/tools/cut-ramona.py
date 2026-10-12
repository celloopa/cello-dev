#!/usr/bin/env python3
"""Ramona-only three-plane candidate. Masks/fill may drift; visible RGB never does."""
from pathlib import Path
import json, hashlib, sys, subprocess
from PIL import Image, ImageChops, ImageFilter, ImageDraw, ImageOps, ImageStat

d=Path(sys.argv[1]); master=Image.open(d/'master-wide.png').convert('RGB'); size=master.size; w,h=size
def align(name):
    im=Image.open(d/name).convert('RGB')
    if abs(im.width/im.height-w/h)>.01: raise ValueError('Aspect mismatch: '+name)
    return im.resize(size,Image.Resampling.LANCZOS)
def matte(name):
    out=d/name.replace('-raw','-key')
    subprocess.run([sys.executable,str(Path(__file__).with_name('key.py')),str(d/name),str(out),'--erode','0'],check=True)
    return Image.open(out).getchannel('A').resize(size,Image.Resampling.LANCZOS).point(lambda p:255 if p>=128 else 0)
forest_model=matte('forest-raw.png'); cascade_model=matte('cascade-raw.png')
# Ramona's sky uses isolated blue/cream inks above the low cascade crest.
# Source-color edges recover fine needles lost by the generated mask.
sky_mask=Image.new('L',size)
sky_mask.putdata([255 if y<h*.635 and ((b>r*1.18 and b>g*1.05) or (r>180 and g>168 and b>137)) else 0
    for y in range(h) for r,g,b in list(master.crop((0,y,w,y+1)).getdata())])
# Restrict cream candidates to model sky neighborhoods so pale trunk highlights
# stay with their trees rather than becoming accidental holes.
sky_mask=ImageChops.multiply(sky_mask,ImageChops.invert(forest_model).filter(ImageFilter.MaxFilter(7)))
forest=ImageChops.invert(sky_mask)
# The generated cascade outline rises above the locked crest, so constrain it
# with a source-authored silhouette. This is a bounded rock-mound extraction.
outline=[(0,1),(.0,.94),(.13,.925),(.22,.873),(.27,.805),(.34,.774),(.40,.72),(.438,.673),(.462,.647),(.493,.642),(.515,.657),(.54,.70),(.58,.75),(.63,.825),(.72,.88),(.80,.95),(.9,.98),(1,1)]
bound=Image.new('L',size);ImageDraw.Draw(bound).polygon([(round(x*w),round(y*h)) for x,y in outline],fill=255)
cascade=ImageChops.multiply(cascade_model,bound)
clean=align('clean-raw.png'); sky_fill=align('sky-raw.png')
def bleed(visible,fallback):
    blur=visible.filter(ImageFilter.GaussianBlur(8)); a=blur.tobytes();channels=[]
    for channel in master.split():
        vals=ImageChops.multiply(channel,visible).filter(ImageFilter.GaussianBlur(8)).tobytes()
        channels.append(Image.frombytes('L',size,bytes(min(255,round(v*255/alpha)) if alpha else 0 for v,alpha in zip(vals,a))))
    return Image.composite(Image.merge('RGB',channels),fallback,blur.point(lambda p:255 if p>=5 else 0))
sky=Image.composite(master,bleed(sky_mask,sky_fill),sky_mask).convert('RGBA')
visible_forest=ImageChops.multiply(forest,ImageChops.invert(cascade))
mid=Image.composite(master,bleed(visible_forest,clean),visible_forest).convert('RGBA');mid.putalpha(forest)
near=master.convert('RGBA');near.putalpha(cascade)
layers=[('sky',sky),('mid',mid),('near',near)]
for n,im in layers:
    im.save(d/(n+'.png'),optimize=True)
    im.resize((1536,1024),Image.Resampling.LANCZOS).save(d/(n+'.webp'),quality=90,method=6)
    bg=Image.new('RGBA',size,'#e8dfd0');Image.alpha_composite(bg,im).convert('RGB').resize((768,512)).save(d/(n+'-isolated.jpg'),quality=94)
rest=sky.copy()
for _,im in layers[1:]:rest=Image.alpha_composite(rest,im)
rest.convert('RGB').save(d/'restack.png')
diff=ImageChops.difference(rest.convert('RGB'),master)
for sign,label in [(-1,'left'),(1,'right')]:
    preview=sky.copy()
    for (_,im),dx in zip(layers[1:],[2,4]):
        shifted=Image.new('RGBA',size);shifted.paste(im,(sign*dx,0));preview=Image.alpha_composite(preview,shifted)
    preview.convert('RGB').save(d/('motion-'+label+'.jpg'),quality=95)
ImageOps.fit(master,(1440,900)).save(d/'desktop-crop.jpg',quality=94)
ImageOps.fit(master,(390,844)).save(d/'mobile-crop.jpg',quality=94)
check={'source_size':list(size),'web_size':[1536,1024],'restack_max_difference':max(v[1] for v in diff.getextrema()),'restack_mean_difference':sum(ImageStat.Stat(diff).mean)/3,'motion_test_source_px':{'sky':0,'mid':2,'near':4},'limitations':['Three planes: sky, forest framing, connected waterfall/basalt foreground. No independent water plane.','Source-color sky threshold and source-authored cascade bound are scene-specific.','Cascade mask includes dark forest at extreme bottom corners; large displacements are not safe.','Exact restack validates visible color and coverage only.'],'layers':[{'name':n,'sha256':hashlib.sha256((d/(n+'.png')).read_bytes()).hexdigest()} for n,_ in layers]}
(d/'cut-check.json').write_text(json.dumps(check,indent=2)+'\n');print(json.dumps(check))
if check['restack_max_difference']:raise RuntimeError('Restack mismatch')
