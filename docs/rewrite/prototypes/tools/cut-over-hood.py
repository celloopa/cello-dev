#!/usr/bin/env python3
"""Three registered planes for Over Hood. Source colors stay visible; hidden
wing areas use a generated plate. Atmosphere and terrain remain one plane.
Usage: python3 tools/cut-over-hood.py public/gen/layers/over-hood
"""
from pathlib import Path
import sys,json,hashlib,subprocess
from PIL import Image,ImageChops,ImageFilter,ImageDraw,ImageStat,ImageOps

d=Path(sys.argv[1]); master=Image.open(d/'master-wide.png').convert('RGB'); size=master.size; w,h=size
def align(name):
    im=Image.open(d/name).convert('RGB')
    if abs(im.width/im.height-w/h)>.01: raise ValueError('Aspect mismatch: '+name)
    return im.resize(size,Image.Resampling.LANCZOS)
subprocess.run([sys.executable,str(Path(__file__).with_name('key.py')),str(d/'wing-raw.png'),str(d/'wing-key.png'),'--erode','0'],check=True)
wing=Image.open(d/'wing-key.png').getchannel('A').resize(size,Image.Resampling.LANCZOS).point(lambda v:255 if v>=128 else 0)
# Atmosphere and terrain share a plane. Its upper edge passes through the clear
# blue transition above the distant cloud band, avoiding a false mountain cut.
terrain=Image.new('L',size); ImageDraw.Draw(terrain).polygon([(0,430),(300,455),(600,475),(900,500),(1200,510),(1500,520),(1800,520),(2172,520),(w,h),(0,h)],fill=255)
clean=align('clean.png'); skyfill=align('sky-raw.png')
def bleed(visible,fallback):
    alpha=visible.filter(ImageFilter.GaussianBlur(8)); a=alpha.tobytes(); channels=[]
    for c in master.split():
        p=ImageChops.multiply(c,visible).filter(ImageFilter.GaussianBlur(8)).tobytes()
        channels.append(Image.frombytes('L',size,bytes(min(255,round(v*255/av)) if av else 0 for v,av in zip(p,a))))
    return Image.composite(Image.merge('RGB',channels),fallback,alpha.point(lambda v:255 if v>=5 else 0))
visible=ImageChops.multiply(terrain,ImageChops.invert(wing)); clean=bleed(visible,clean)
land=Image.composite(master,clean,ImageChops.invert(wing)).convert('RGBA');land.putalpha(terrain)
occupied=ImageChops.lighter(terrain,wing); skyfill=bleed(ImageChops.invert(occupied),skyfill)
sky=Image.composite(skyfill,master,occupied).convert('RGBA')
aircraft=master.convert('RGBA');aircraft.putalpha(wing)
layers=[('sky',sky),('terrain',land),('wing',aircraft)]
for name,im in layers:
    im.save(d/(name+'.png'),optimize=True);im.resize((1536,1024),Image.Resampling.LANCZOS).save(d/(name+'.webp'),quality=90,method=6)
    if name!='sky':
        checker=Image.new('RGB',size,'#ece5db');ImageDraw.Draw(checker).rectangle((0,0,w//2,h),fill='#b4c1bb');checker.paste(im,mask=im.getchannel('A'));checker.resize((1086,724)).save(d/(name+'-isolated.jpg'),quality=94)
rest=sky.copy()
for _,im in layers[1:]:rest=Image.alpha_composite(rest,im)
diff=ImageChops.difference(rest.convert('RGB'),master);maximum=max(x[1] for x in diff.getextrema());mean=sum(ImageStat.Stat(diff).mean)/3
rest.convert('RGB').save(d/'restack.png')
for sign,label in [(-1,'left'),(1,'right')]:
    p=sky.copy()
    for (_,im),dx in zip(layers[1:],[1,5]):
        shifted=Image.new('RGBA',size);shifted.paste(im,(sign*dx,0));p=Image.alpha_composite(p,shifted)
    p.convert('RGB').save(d/('motion-'+label+'.jpg'),quality=94)
ImageOps.fit(rest.convert('RGB'),(1440,900),method=Image.Resampling.LANCZOS,centering=(.5,.5)).save(d/'desktop-crop.jpg',quality=94)
ImageOps.fit(rest.convert('RGB'),(390,844),method=Image.Resampling.LANCZOS,centering=(.53,.5)).save(d/'mobile-crop.jpg',quality=94)
report={'source_size':list(size),'web_size':[1536,1024],'restack_max_difference':maximum,'restack_mean_difference':mean,'motion_test_source_px':{'terrain':1,'wing':5},'mask_method':'AI wing matte keyed to binary; atmosphere/terrain shared plane with blue-sky transition upper edge','layers':[{'name':n,'sha256':hashlib.sha256((d/(n+'.png')).read_bytes()).hexdigest()} for n,_ in layers],'limitations':['wing edge matte is a candidate; large displacement needs edge cleanup and deeper hidden fills','terrain, mountain and cloud bank remain one coherent plane','restack equality does not prove segmentation quality']}
(d/'cut-check.json').write_text(json.dumps(report,indent=2)+'\n'); print(json.dumps(report));assert maximum==0
