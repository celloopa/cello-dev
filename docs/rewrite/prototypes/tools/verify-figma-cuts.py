#!/usr/bin/env python3
"""Verify saved native Figma PNGs before deriving WebPs; never downloads assets.

Usage: uv run --with pillow --with numpy python tools/verify-figma-cuts.py <scene-id> [<scene-id> ...]
Native renders must already be saved as figma/<layer>.png (or figma-<layer>.png).
This verifies round-trip pixels only; visual cut/motion QA remains separate.
"""
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1]
for scene_id in sys.argv[1:]:
    folder = root / 'public/gen/layers' / scene_id
    manifest = json.loads((folder/'scene.json').read_text())
    results, renders = {}, []
    for layer in manifest['layers']:
        name = layer['name']
        target = folder/'figma'/f'{name}.png'
        flat = folder/f'figma-{name}.png'
        if not target.exists() and flat.exists():
            target.parent.mkdir(exist_ok=True)
            flat.replace(target)
        local = Image.open(folder/f'{name}.png').convert('RGBA')
        native = Image.open(target).convert('RGBA')
        if local.size != native.size:
            raise ValueError(f'{scene_id}/{name}: size mismatch {local.size} {native.size}')
        a, b = np.array(local).astype('int16'), np.array(native).astype('int16')
        alpha = int(np.abs(a[:,:,3]-b[:,:,3]).max())
        visible = a[:,:,3] > 0
        rgb = int(np.abs(a[:,:,:3]-b[:,:,:3])[visible].max()) if visible.any() else 0
        if alpha or rgb:
            raise ValueError(f'{scene_id}/{name}: alpha diff {alpha}, visible RGB diff {rgb}')
        results[name] = {'size':list(native.size),'alphaMaxDiff':alpha,
                         'visibleRgbMaxDiff':rgb,
                         'pngSha256':hashlib.sha256(target.read_bytes()).hexdigest()}
        renders.append((name,native))
    stack = renders[0][1].copy()
    for _, native in renders[1:]:
        stack = Image.alpha_composite(stack,native)
    master = Image.open(folder/'master-wide.png').convert('RGB')
    diff = np.abs(np.array(stack.convert('RGB')).astype('int16')-np.array(master).astype('int16'))
    if diff.max():
        raise ValueError(f'{scene_id}: native restack diff {diff.max()}')
    for name, native in renders:
        native.resize(tuple(manifest['webSize']),Image.Resampling.LANCZOS).save(folder/f'{name}.webp',quality=90,method=6)
    report={'status':'native isolated PNG round trip verified',
            'method':'get_screenshot contentsOnly true, source long-edge maxDimension, enableBase64Response true; URL endpoint failed',
            'layers':results,'restackRgbMaxDiff':int(diff.max()),
            'restackRgbMeanDiff':diff.mean(axis=(0,1)).tolist()}
    (folder/'figma-roundtrip.json').write_text(json.dumps(report,indent=2)+'\n')
    manifest['exportOrigin']='Figma native isolated PNG renders; source resolution; visible RGB and alpha exact against local cuts'
    if 'assetSource' in manifest:
        manifest['assetSource']=manifest['exportOrigin']
    manifest['limitations']=[l for l in manifest.get('limitations',[]) if not ('Figma download returned' in l or 'Figma export round trip blocked' in l)]
    if 'status' in manifest.get('figma',{}):
        manifest['figma']['status']='Uploaded and native isolated PNG round trip verified'
    (folder/'scene.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print(scene_id, len(renders),'native planes verified; alpha/RGB/restack maxdiff0; WebPs derived')
