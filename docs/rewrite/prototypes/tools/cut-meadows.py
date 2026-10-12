#!/usr/bin/env python3
"""Scene-specific Meadows registered cuts; Pillow only. AI mattes, master RGB."""
from pathlib import Path
from PIL import Image,ImageChops,ImageFilter,ImageOps,ImageStat,ImageDraw
import sys,subprocess,json,hashlib
p=Path(sys.argv[1]);m=Image.open(p/'master-wide.png').convert('RGB');size=m.size;w,h=size

def align(name):
 im=Image.open(p/name).convert('RGB')
 if abs(im.width/im.height-w/h)>.01:raise ValueError('Aspect mismatch '+name)
 return im.resize(size,Image.Resampling.LANCZOS)
def key(name):
 out=p/name.replace('-raw','-key');subprocess.run([sys.executable,str(Path(__file__).with_name('key.py')),str(p/name),str(out),'--erode','0'],check=True)
 return Image.open(out).getchannel('A').resize(size,Image.Resampling.LANCZOS).point(lambda v:255 if v>=128 else 0)
forest=key('forest-raw.png');ground=key('ground-raw.png')
# Source ink discrimination is specific to this green/blue Meadows treatment.
semantic=Image.new('L',size);semantic.putdata([255 if ((r+g+b<360 and b<130) or (g>b+12 and b<165)) else 0 for r,g,b in m.getdata()])
forest=semantic  # Scene palette discriminates forest ink directly.
# Bottom meadow belongs to forest plane until intentionally overlapped by near strip.
forest.paste(255,(0,round(h*.70),w,h));forest=ImageChops.lighter(forest,ground)
clean=align('clean.png');skyfill=align('sky-raw.png')
# Clean plate supplies a plausible hidden mountain silhouette, not visible colors.
far=Image.new('L',size);far.putdata([0 if (b>g+38 and g>r+25) else 255 for r,g,b in clean.getdata()])
far=far.filter(ImageFilter.MaxFilter(3));far.paste(255,(0,round(h*.69),w,h))
def bleed(visible,fallback):
 a=visible.filter(ImageFilter.GaussianBlur(6)).tobytes();channels=[]
 for c in m.split():
  vals=ImageChops.multiply(c,visible).filter(ImageFilter.GaussianBlur(6)).tobytes()
  channels.append(Image.frombytes('L',size,bytes(min(255,round(v*255/aa)) if aa else 0 for v,aa in zip(vals,a))))
 return Image.composite(Image.merge('RGB',channels),fallback,Image.frombytes('L',size,a).point(lambda v:255 if v>=5 else 0))
occupied=ImageChops.lighter(forest,ground)
clean=bleed(ImageChops.multiply(far,ImageChops.invert(occupied)),clean)
skyfill=bleed(ImageChops.invert(ImageChops.lighter(occupied,far)),skyfill)
layers=[];used=Image.new('L',size)
for name,mask,fill in reversed([('far',far,clean),('mid',forest,m),('near',ground,m)]):
 visible=ImageChops.multiply(mask,ImageChops.invert(used));rgb=Image.composite(m,fill,visible);rgba=rgb.convert('RGBA');rgba.putalpha(mask);layers.insert(0,(name,rgba));used=ImageChops.lighter(used,mask)
layers.insert(0,('sky',Image.composite(skyfill,m,used).convert('RGBA')))
for name,im in layers:
 im.save(p/f'{name}.png',optimize=True);im.resize((1536,1024),Image.Resampling.LANCZOS).save(p/f'{name}.webp',quality=90,method=6)
 # Alpha inspection has explicit neutral background.
 bg=Image.new('RGBA',size,(190,190,190,255));Image.alpha_composite(bg,im).convert('RGB').resize((768,512)).save(p/f'isolated-{name}.jpg',quality=94)
rest=layers[0][1].copy()
for _,im in layers[1:]:rest=Image.alpha_composite(rest,im)
rest.convert('RGB').save(p/'restack.png');diff=ImageChops.difference(rest.convert('RGB'),m)
for sign,label in [(-1,'left'),(1,'right')]:
 prev=layers[0][1].copy()
 for (_,im),dx in zip(layers[1:],[1,3,5]):
  shifted=Image.new('RGBA',size);shifted.paste(im,(dx*sign,0));prev=Image.alpha_composite(prev,shifted)
 prev.convert('RGB').save(p/f'motion-{label}.jpg',quality=95)
ImageOps.fit(rest.convert('RGB'),(1440,900),centering=(.5,.5)).save(p/'crop-desktop.jpg',quality=95)
# Keep summit by taking phone crop from the right side of original center portrait.
ImageOps.fit(rest.convert('RGB'),(390,844),centering=(.62,.5)).save(p/'crop-mobile.jpg',quality=95)
check={'status':'candidate; visual review required','source_size':list(size),'web_size':[1536,1024],'restack_max_difference':max(x[1] for x in diff.getextrema()),'restack_mean_difference':sum(ImageStat.Stat(diff).mean)/3,'motion_test_source_px':{'far':1,'mid':3,'near':5},'layers':[{'name':n,'sha256':hashlib.sha256((p/f'{n}.png').read_bytes()).hexdigest()} for n,_ in layers],'limitations':['Foreground meadow shadows overlap; nearest strip and mid ground are not fully disoccluded','Large tree motion requires additional hidden forest/ground cleanup','Exact restack validates coverage/color, not mask quality']}
(p/'cut-check.json').write_text(json.dumps(check,indent=2)+'\n');print(json.dumps(check));assert check['restack_max_difference']==0
