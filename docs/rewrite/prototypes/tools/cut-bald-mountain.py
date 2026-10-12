#!/usr/bin/env python3
"""Bald Mountain-specific source-RGB registered three-plane cut. Requires Pillow."""
from pathlib import Path
from PIL import Image, ImageChops, ImageFilter, ImageOps, ImageStat
import json, subprocess, sys, hashlib

d = Path(sys.argv[1]); master = Image.open(d/'master-wide.png').convert('RGB'); w,h=master.size
subprocess.run([sys.executable,str(Path(__file__).with_name('key.py')),str(d/'near-raw.png'),str(d/'near-key.png'),'--erode','0'],check=True)
near = Image.open(d/'near-key.png').getchannel('A').resize((w,h),Image.Resampling.LANCZOS).point(lambda x:255 if x>=128 else 0)
clean = Image.open(d/'clean.png').convert('RGB')
assert abs(clean.width/clean.height-w/h)<.01
clean=clean.resize((w,h),Image.Resampling.LANCZOS)
# The clear-sky color scan caused blocky cuts in blue mountain shadows. Use a
# registered AI terrain matte instead, restoring all visible RGB from master.
subprocess.run([sys.executable,str(Path(__file__).with_name('key.py')),str(d/'terrain-raw.png'),str(d/'terrain-key.png'),'--erode','0'],check=True)
far=Image.open(d/'terrain-key.png').getchannel('A').resize((w,h),Image.Resampling.LANCZOS).point(lambda x:255 if x>=128 else 0)
far=ImageChops.lighter(far,near)
# Continue nearby visible source colors a short way under occluding ground.
visible=ImageChops.multiply(far,ImageChops.invert(near)); blur=visible.filter(ImageFilter.GaussianBlur(6)); alpha=blur.tobytes()
channels=[]
for c in master.split():
    values=ImageChops.multiply(c,visible).filter(ImageFilter.GaussianBlur(6)).tobytes()
    channels.append(Image.frombytes('L',(w,h),bytes(min(255,round(v*255/a)) if a else 0 for v,a in zip(values,alpha))))
continued=Image.merge('RGB',channels)
clean=Image.composite(continued,clean,blur.point(lambda v:255 if v>=5 else 0))
# Clear sky source stripe repeated down behind the mountain; never visible at rest.
skyfill=master.crop((0,0,w,240)).resize((w,h),Image.Resampling.LANCZOS)
sky=Image.composite(skyfill,master,far).convert('RGBA')
mountain=Image.composite(master,clean,ImageChops.invert(near)).convert('RGBA'); mountain.putalpha(far)
ground=master.convert('RGBA');ground.putalpha(near)
layers=[('sky',sky),('far',mountain),('near',ground)]
rest=sky.copy()
for name,im in layers:
    if name!='sky':
        # PNG transport can be large; zero invisible RGB losslessly for display.
        im.paste((0,0,0,0),(0,0,w,h),ImageChops.invert(im.getchannel('A')))
    im.save(d/(name+'.png'),optimize=True)
    im.resize((1536,1024),Image.Resampling.LANCZOS).save(d/(name+'.webp'),quality=91,method=6)
    if name!='sky':rest=Image.alpha_composite(rest,im)
    check=Image.new('RGBA',(w,h),(225,220,210,255));check=Image.alpha_composite(check,im);check.convert('RGB').resize((1086,724)).save(d/(name+'-isolated.jpg'),quality=94)
rest.convert('RGB').save(d/'restack.png')
diff=ImageChops.difference(rest.convert('RGB'),master)
result={'status':'candidate; aesthetic and motion review pending','source_size':[w,h],'web_size':[1536,1024],'restack_max_difference':max(c[1] for c in diff.getextrema()),'restack_mean_difference':sum(ImageStat.Stat(diff).mean)/3,'motion_test_source_px':{'sky':0,'far':1,'near':4},'layers':[{'name':n,'sha256':hashlib.sha256((d/(n+'.png')).read_bytes()).hexdigest()} for n,_ in layers],'limitations':['Three planes: forested valley remains with mountain; hikers remain attached to trail','Small four-pixel relative ground travel only; larger occlusion reveal unproven','AI expansion outside restored portrait invents geography','AI terrain matte simplifies fine skyline; inspect before increasing mountain travel']}
for sign,label in [(-1,'left'),(1,'right')]:
    preview=sky.copy()
    for layer,dx in [(mountain,1),(ground,4)]:
        shifted=Image.new('RGBA',(w,h));shifted.paste(layer,(sign*dx,0));preview=Image.alpha_composite(preview,shifted)
    preview.convert('RGB').save(d/('motion-'+label+'.jpg'),quality=95)
ImageOps.fit(master,(1440,900),centering=(.5,.5)).save(d/'crop-desktop.jpg',quality=94)
# Center mobile composition preserves the original mountain and walking hiker.
ImageOps.fit(master,(390,844),centering=(.46,.5)).save(d/'crop-mobile.jpg',quality=94)
(d/'cut-check.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result))
assert result['restack_max_difference']==0
