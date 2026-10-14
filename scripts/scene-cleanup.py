"""Registered cut cleanup: restore locked RGB, fill only occluded pixels.
Inputs are approved, people-free PNG masters/planes and generated clean plates.
Never pass original photographs. Heavy source files stay outside the public repo.
Usage: python3 scripts/scene-cleanup.py SOURCE_DIR FILL_DIR REVIEW_DIR
"""
from pathlib import Path
import sys,json,hashlib
from PIL import Image,ImageChops,ImageFilter,ImageDraw,ImageOps,ImageStat
source,fills,review=map(Path,sys.argv[1:4]);review.mkdir(parents=True,exist_ok=True)
CAPS={'over-hood':{'sky':0,'terrain':2,'wing':8},'moss-falls':{'sky':0,'mid':2,'near':6},'meadows-lift':{'sky':0,'terrain':2,'lift':2},'salmon-ridge':{'sky':0,'far':1,'near':5}}
for scene,caps in CAPS.items():
    src=source/scene;pub=Path('public/scenes')/scene;out=review/scene;out.mkdir(exist_ok=True)
    master=Image.open(src/'master-wide.png').convert('RGB');size=master.size;w,h=size
    fill=Image.open(fills/(scene+'.png')).convert('RGB')
    assert abs(fill.width/fill.height-w/h)<.002,'fill aspect mismatch'
    fill=fill.resize(size,Image.Resampling.LANCZOS)
    man=json.loads((pub/'scene.json').read_text());names=[l['name'] for l in man['layers']]
    masks={n:Image.open(src/(n+'.png')).convert('RGBA').getchannel('A').point(lambda v:255 if v>=128 else 0) for n in names[1:]}
    near=names[-1]
    if scene=='over-hood': masks[near]=masks[near].filter(ImageFilter.MaxFilter(5))
    if scene=='meadows-lift':
        # Source-ink refinement of all four continuous cables, including the former gaps.
        guide=Image.new('L',size);d=ImageDraw.Draw(guide)
        for a,b in [(100,445),(205,475),(282,488),(358,501)]:d.line([(a,0),(b,530)],fill=255,width=12)
        notblue=Image.new('L',size);notblue.putdata([0 if b>g+15 and g>r+20 and b>100 else 255 for r,g,b in master.getdata()])
        cables=ImageChops.multiply(guide,notblue)
        masks[near]=ImageChops.lighter(masks[near],cables)
    # Each plane's visible RGB is original master RGB. Only coverage by nearer planes takes fill.
    occupied=Image.new('L',size)
    for a in masks.values(): occupied=ImageChops.lighter(occupied,a)
    sky=Image.composite(fill,master,occupied).convert('RGBA')
    # Keep the old simple underpaint well inside opaque land. It cannot be exposed by the caps;
    # retaining it avoids encoding a detailed forest that is permanently hidden behind the land.
    interior=masks[names[1]].filter(ImageFilter.MinFilter(2*max(caps.values())+5))
    oldsky=Image.open(src/(names[0]+'.png')).convert('RGBA')
    sky=Image.composite(oldsky,sky,interior);layers=[sky]
    for i,n in enumerate(names[1:],1):
        cover=Image.new('L',size)
        for later in names[i+1:]:cover=ImageChops.lighter(cover,masks[later])
        im=Image.composite(fill,master,cover).convert('RGBA');im.putalpha(masks[n]);layers.append(im)
    rest=layers[0].copy()
    for im in layers[1:]:rest=Image.alpha_composite(rest,im)
    diff=ImageChops.difference(rest.convert('RGB'),master);maxdiff=max(v[1] for v in diff.getextrema());assert maxdiff==0
    web=tuple(man['webSize']);checks=[]
    for n,im in zip(names,layers):
        im.save(out/(n+'.png'))
        im.resize(web,Image.Resampling.LANCZOS).save(pub/(n+'.webp'),quality=92,method=6)
        base=Image.new('RGBA',size,'#b7b5b0');base.alpha_composite(im);ImageOps.contain(base.convert('RGB'),(1086,724)).save(out/(n+'-isolated.jpg'),quality=95)
        checks.append({'name':n,'sourceSize':list(im.size),'pngSha256':hashlib.sha256((out/(n+'.png')).read_bytes()).hexdigest()})
    for sign,label in [(-1,'left'),(1,'right')]:
        comp=layers[0].copy()
        for n,im in zip(names[1:],layers[1:]):
            moved=Image.new('RGBA',size);moved.paste(im,(sign*caps[n],0));comp=Image.alpha_composite(comp,moved)
        ImageOps.contain(comp.convert('RGB'),(1440,960)).save(out/(label+'.jpg'),quality=96)
        for width,height in [(1440,900),(390,844)]:ImageOps.fit(comp.convert('RGB'),(width,height)).save(out/(label+f'-{width}.jpg'),quality=95)
    report={'sourceSize':list(size),'restackMaxDifference':maxdiff,'restackMeanDifference':sum(ImageStat.Stat(diff).mean)/3,'motionTestSourcePx':caps,'layers':checks,'origin':'local registered cleanup, not a Figma re-export','method':'original visible RGB + original/refined binary mattes + generated occluded fill'}
    (out/'check.json').write_text(json.dumps(report,indent=2)+'\n')
    man['status']='Cutover candidate: registered hidden-fill cleanup, inspected at the documented caps.'
    man['cutoverCleanup']=report
    for l in man['layers']:
        l['capSourcePx']=[caps[l['name']],0];l['recommendedHorizontalSourcePx']=caps[l['name']]
    man['motion']={'recommendation':'Bounded horizontal depth at the listed caps; reading drift uses one fifth of the cap.','testOnly':False,'reducedMotion':'same registered composition still','mobile':'documented crop; no tilt dependence'}
    man['exportOrigin']='Local registered cleanup of existing native cuts; visible RGB restored from the locked people-free master. Not re-exported from Figma.'
    man['limitations']=['Hidden scenery is generated continuation, not photographed.','Only the documented horizontal caps are tested; no independent cable/ground travel on Meadows lift.','Historical scene run records describe the earlier cuts; these web cuts supersede them.']
    (pub/'scene.json').write_text(json.dumps(man,indent=2)+'\n')
    print(scene,'restack',maxdiff,'caps',caps,flush=True)
