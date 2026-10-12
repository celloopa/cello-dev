#!/usr/bin/env python3
"""Moss falls candidate: registered sky, waterfall/forest and foreground planes.
Requires Pillow. Source RGB wins visible regions; generated images supply mattes
and hidden fill. Numeric restack does not prove physically correct segmentation.
"""
from pathlib import Path
import sys, json, hashlib, subprocess
from PIL import Image, ImageChops, ImageFilter, ImageStat, ImageOps

d=Path(sys.argv[1]); master=Image.open(d/'master-wide.png').convert('RGB');size=master.size;w,h=size
def align(name):
    im=Image.open(d/name).convert('RGB')
    if abs(im.width/im.height-w/h)>.01:raise ValueError('Aspect mismatch: '+name)
    return im.resize(size,Image.Resampling.LANCZOS)
def key(name):
    out=d/name.replace('-raw','-key')
    subprocess.run([sys.executable,str(Path(__file__).with_name('key.py')),str(d/name),str(out),'--erode','0'],check=True)
    return Image.open(out).getchannel('A').resize(size,Image.Resampling.LANCZOS).point(lambda a:255 if a>=128 else 0)
forest=key('forest-raw.png');near=key('near-raw.png')
# Mist is the only separable opening above the trees. Limit AI edge drift with
# the source's pale paper inks, while preserving actual tree ink near openings.
candidate=forest.filter(ImageFilter.MaxFilter(5))
inks=Image.new('L',size);inks.putdata([255 if min(r,g,b)<150 else 0 for r,g,b in master.getdata()])
forest=ImageChops.lighter(forest,ImageChops.multiply(candidate,inks))
forest=ImageChops.lighter(forest,near)
clean=align('clean.png')
def bleed(visible,fallback,radius=8):
    a=visible.filter(ImageFilter.GaussianBlur(radius));ab=a.tobytes();chs=[]
    for c in master.split():
        vals=ImageChops.multiply(c,visible).filter(ImageFilter.GaussianBlur(radius)).tobytes()
        chs.append(Image.frombytes('L',size,bytes(min(255,round(v*255/x)) if x else 0 for v,x in zip(vals,ab))))
    return Image.composite(Image.merge('RGB',chs),fallback,a.point(lambda v:255 if v>=5 else 0))
midvisible=ImageChops.multiply(forest,ImageChops.invert(near))
midrgb=Image.composite(master,bleed(midvisible,clean),midvisible)
mid=midrgb.convert('RGBA');mid.putalpha(forest)
# A source mist patch is a mechanical hidden continuation, not new visible art.
mist=ImageOps.fit(master.crop((1000,0,1120,180)),size,method=Image.Resampling.LANCZOS)
skyfill=bleed(ImageChops.invert(forest),mist)
sky=Image.composite(skyfill,master,forest).convert('RGBA')
fg=master.convert('RGBA');fg.putalpha(near)
layers=[('sky',sky),('mid',mid),('near',fg)]
for name,im in layers:
    im.save(d/(name+'.png'),optimize=True);im.resize((1536,1024),Image.Resampling.LANCZOS).save(d/(name+'.webp'),quality=92,method=6)
    check=Image.new('RGBA',size,'#a0a0a0');check.alpha_composite(im);check.convert('RGB').resize((1086,724)).save(d/(name+'-isolated.jpg'),quality=95)
rest=sky.copy()
for _,im in layers[1:]:rest=Image.alpha_composite(rest,im)
rest.convert('RGB').save(d/'restack.png')
diff=ImageChops.difference(rest.convert('RGB'),master);mx=max(v[1] for v in diff.getextrema());mean=sum(ImageStat.Stat(diff).mean)/3
for sign,label in [(-1,'left'),(1,'right')]:
    out=sky.copy()
    for (_,im),dx in zip(layers[1:],[2,4]):
        shifted=Image.new('RGBA',size);shifted.paste(im,(sign*dx,0));out=Image.alpha_composite(out,shifted)
    out.convert('RGB').save(d/('motion-'+label+'.jpg'),quality=96)
for name,sz in [('desktop',(1440,900)),('mobile',(390,844))]:ImageOps.fit(master,sz,method=Image.Resampling.LANCZOS,centering=(.5,.5)).save(d/(name+'-crop.jpg'),quality=96)
result={'status':'candidate; visual review pending','source_size':list(size),'web_size':[1536,1024],'restack_max_difference':mx,'restack_mean_difference':mean,'motion_test_source_px':{'sky':0,'mid':2,'near':4},'layers':[{'name':n,'sha256':hashlib.sha256((d/(n+'.png')).read_bytes()).hexdigest()}for n,_ in layers],'limitations':['Three coherent planes; waterfall and middle forest remain together','Adult and dog remain on one foreground plane','AI matte boundary and hidden fill need visual review; larger motion unproven','Exact restack validates color/coverage only']}
(d/'cut-check.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
if mx:raise RuntimeError('Restack differs')
