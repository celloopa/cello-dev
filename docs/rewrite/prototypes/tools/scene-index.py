#!/usr/bin/env python3
"""Refresh the review catalog from completed scene manifests; does not alter cuts."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
places=[('moss-falls','Forest falls, Cottage Grove','June'),('meadows','Mt Hood Meadows','June'),('meadows-lift','Meadows lift line','June'),('ecola','Ecola coast','July'),('salmon-ridge','Salmon River ridge','August'),('ramona','Ramona Falls','August'),('over-hood','Over Hood','September'),('bald-mountain','Near Bald Mountain','September'),('mirror-lake','Mirror Lake','September'),('sauvie','Sauvie Island','October')]
scenes=[]
for id,place,month in places:
    path=root/'public/gen/layers'/id/'scene.json'
    if path.exists():
        m=json.loads(path.read_text())
    elif id=='mirror-lake':
        m={'id':id,'place':place,'month':month,'status':'Selected screenprint style; existing four-layer runtime prototype','master':'/gen/style/mirror-lake-a-screenprint.webp','layers':[{'name':n,'src':f'/gen/layers/{id}/{n}.webp'} for n in ['sky','far','mid','near']],'limitations':['Forest, shore, lake and reflection share the mid plane.']}
    else:
        m={'id':id,'place':place,'month':month,'status':'Scene production queued or in progress','layers':[],'limitations':[]}
    m['place']=m.get('place',m.get('name',place))
    m['month']=m.get('month',month)
    m['mobileCenter']=m.get('mobileCropCenter',[m.get('mobileCenter',{'meadows':.62,'over-hood':.53,'ecola':.51}.get(id,.5)),.5])[0]*100
    m['motionReadiness']={
        'over-hood':'Still preferred: wing edge needs cleanup before motion.',
        'moss-falls':'Still preferred: hidden foreground edges need cleanup.',
        'meadows-lift':'Still preferred: thin cable masks need cleanup.',
        'salmon-ridge':'Still preferred: outpaint seam and near edges need cleanup.',
        'mirror-lake':'Existing runtime prototype; pointer behavior not manually verified here.',
    }.get(id,'Only the small source-pixel shifts documented in the run log have been inspected.' if m['layers'] else 'No cut motion evidence yet.')
    scenes.append(m)
(root/'public/gen/scene-library.json').write_text(json.dumps({'version':1,'scenes':scenes},indent=2)+'\n')
print('Review catalog:',sum(bool(s['layers']) for s in scenes),'of',len(scenes),'scenes have cuts')
