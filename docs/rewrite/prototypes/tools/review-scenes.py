#!/usr/bin/env python3
"""Make review contact sheets and audit locked centers/native-export reports.

Run after scene-index.py: uv run --with pillow python tools/review-scenes.py
Images are still composition studies, not device or animation validation.
"""
from pathlib import Path
import json
from PIL import Image, ImageChops, ImageDraw, ImageOps

root=Path(__file__).resolve().parents[1]
public=root/'public'
out=root.parent/'storyboards/arrival-v3'
out.mkdir(parents=True,exist_ok=True)
scenes=json.loads((public/'gen/scene-library.json').read_text())['scenes']
style=Image.new('RGB',(1440,5*350),'#e6e1d7')
mobile=Image.new('RGB',(1250,2*600),'#e6e1d7')
motion=Image.new('RGB',(1440,5*350),'#e6e1d7')
sd,md,dd=ImageDraw.Draw(style),ImageDraw.Draw(mobile),ImageDraw.Draw(motion)
audit={'scope':'nine new candidates; existing Mirror Lake exports excluded from new native audit',
       'newScenes':{},'nativePlaneCount':0,'lockedPortraitCount':0}
for i,s in enumerate(scenes):
    if not s.get('master'):
        continue
    image=Image.open(public/s['master'].lstrip('/')).convert('RGB')
    label=s['place'].split(' (')[0]
    x,y=(i%2)*720,(i//2)*350
    style.paste(ImageOps.fit(image,(700,310)),(x,y+30))
    sd.text((x+8,y+8),label,fill='#173328')
    xx,yy=(i%5)*250,(i//5)*600
    mobile.paste(ImageOps.fit(image,(240,520),centering=(s['mobileCenter']/100,.5)),(xx,yy+50))
    md.text((xx+5,yy+5),label,fill='#173328')
    md.text((xx+5,yy+25),'Proposed phone crop — still',fill='#173328')
    folder=public/'gen/layers'/s['id']
    shifted=folder/'motion-left.jpg'
    motion_image=Image.open(shifted).convert('RGB') if shifted.exists() else image
    motion.paste(ImageOps.fit(motion_image,(700,310)),(x,y+30))
    dd.text((x+8,y+8),label+' — tested extreme; not motion clearance',fill='#173328')
    if s['id']=='mirror-lake':
        continue
    report=json.loads((folder/'figma-roundtrip.json').read_text())
    assert report['restackRgbMaxDiff']==0,s['id']
    assert all(v['alphaMaxDiff']==0 and v['visibleRgbMaxDiff']==0 for v in report['layers'].values()),s['id']
    entry={'nativePlanes':len(report['layers']),'restackMaxDiff':0}
    wide=Image.open(folder/'master-wide.png').convert('RGB')
    portrait=Image.open(folder/'master.png').convert('RGB')
    if portrait.size!=wide.size:
        x0=(wide.width-portrait.width)//2
        crop=wide.crop((x0,0,x0+portrait.width,portrait.height))
        extrema=ImageChops.difference(crop,portrait).getextrema()
        maximum=max(b for a,b in extrema)
        assert maximum==0,(s['id'],maximum)
        entry['lockedCenterMaxDiff']=maximum
        audit['lockedPortraitCount']+=1
    else:
        entry['expansion']='none; original landscape aspect retained'
    for layer in s['layers']:
        assert (public/layer['src'].lstrip('/')).exists(),layer['src']
    audit['nativePlaneCount']+=entry['nativePlanes']
    audit['newScenes'][s['id']]=entry
style.save(out/'style-review.jpg',quality=94)
mobile.save(out/'mobile-scene-review.jpg',quality=94)
motion.save(out/'motion-review.jpg',quality=94)
(out/'scene-batch-check.json').write_text(json.dumps(audit,indent=2)+'\n')
print(len(audit['newScenes']),'new scenes;',audit['nativePlaneCount'],'native planes;',audit['lockedPortraitCount'],'locked portraits; exact0 checks passed')
