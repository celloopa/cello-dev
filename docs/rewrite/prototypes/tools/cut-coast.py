#!/usr/bin/env python3
"""Ecola four-plane candidate from one locked master, masks, and hidden fills.

Usage: python3 tools/cut-coast.py public/gen/layers/ecola
Requires Pillow. Source RGB is retained wherever visible; AI images supply masks and
occluded fill only. Restack equality is a color/coverage check, NOT proof of good masks.
This coast recipe uses a flat ocean horizon and forest-color refinement: it is not a
universal segmentation recipe. Review the motion extremes before adopting a cut.
"""
from pathlib import Path
import hashlib
import json
import subprocess
import sys
from PIL import Image, ImageChops, ImageFilter, ImageOps, ImageStat


def run(directory):
    d = Path(directory)
    master = Image.open(d / 'master-wide.png').convert('RGB')
    size = master.size
    w, h = size
    def align(name):
        im = Image.open(d / name).convert('RGB')
        if abs(im.width / im.height - w / h) > .01:
            raise ValueError(f'{name}: aspect mismatch; do not stretch a different crop')
        return im.resize(size, Image.Resampling.LANCZOS)
    def key(name):
        target = d / name.replace('-raw', '-key')
        subprocess.run([sys.executable, str(Path(__file__).with_name('key.py')), str(d / name), str(target), '--erode', '0'], check=True)
        return Image.open(target).getchannel('A').resize(size, Image.Resampling.LANCZOS).point(lambda v: 255 if v >= 128 else 0)
    forest = key('forest-wide-raw.png')
    ground = key('ground-wide-raw.png')
    # Model masks drift at branch edges. Restrict its nearby candidates to source
    # forest inks, so a tree plane does not carry chunks of the original blue sky.
    candidates = forest.filter(ImageFilter.MaxFilter(7))
    pixels = master.get_flattened_data() if hasattr(master, 'get_flattened_data') else master.getdata()
    semantic = Image.new('L', size)
    semantic.putdata([255 if ((r+g+b < 240) or (g > b+20 and g > r*.7)) else 0 for r,g,b in pixels])
    forest = ImageChops.multiply(candidates, semantic)
    # Leave a bounded overlap under the nearest strip; large movement needs more
    # authored hidden forest fill. Motion previews below deliberately remain small.
    forest = ImageChops.lighter(forest, ground)
    far_alpha = Image.new('L', size)
    far_alpha.paste(255, (0, round(h*.594), w, h))
    masks = [far_alpha, forest, ground]
    clean = align('clean-wide.png')
    sky_fill = ImageOps.fit(Image.open(d/'sky-raw.png').convert('RGB'), size, method=Image.Resampling.LANCZOS)
    def bleed_visible(visible, fallback):
        # Model hidden fills differ in cloud/foam detail. Extend the neighboring
        # source background under thin occluders before using the generated fill.
        # This is local color continuation, not an assertion of hidden geography.
        blur = visible.filter(ImageFilter.GaussianBlur(8))
        a = blur.tobytes()
        channels = []
        for channel in master.split():
            premul = ImageChops.multiply(channel, visible).filter(ImageFilter.GaussianBlur(8)).tobytes()
            result = bytes(min(255, round(v*255/alpha)) if alpha else 0 for v, alpha in zip(premul,a))
            channels.append(Image.frombytes('L',size,result))
        continued=Image.merge('RGB',channels)
        coverage=blur.point(lambda v:255 if v>=5 else 0)
        return Image.composite(continued,fallback,coverage)
    occlusion=ImageChops.lighter(forest,ground)
    clean=bleed_visible(ImageChops.multiply(far_alpha,ImageChops.invert(occlusion)),clean)
    sky_fill=bleed_visible(ImageChops.invert(ImageChops.lighter(occlusion,far_alpha)),sky_fill)
    fills = [clean, master, master]
    names = ['far', 'mid', 'near']
    # Each visible source region is restored from master; underlying fills can
    # change only where another plane hides them in the rest position.
    occupied = Image.new('L', size)
    layers = []
    for name, mask, fill in reversed(list(zip(names, masks, fills))):
        visible = ImageChops.multiply(mask, ImageChops.invert(occupied))
        rgb = Image.composite(master, fill, visible)
        rgba = rgb.convert('RGBA'); rgba.putalpha(mask)
        layers.insert(0, (name, rgba))
        occupied = ImageChops.lighter(occupied, mask)
    sky = Image.composite(sky_fill, master, occupied).convert('RGBA')
    layers.insert(0, ('sky', sky))
    for name, layer in layers:
        layer.save(d/f'{name}.png', optimize=True)
        web = layer.resize((1536,1024),Image.Resampling.LANCZOS)
        web.save(d/f'{name}.webp', quality=90, method=6)
    restack = layers[0][1].copy()
    for _, layer in layers[1:]: restack = Image.alpha_composite(restack, layer)
    restack.convert('RGB').save(d/'restack.png')
    diff = ImageChops.difference(restack.convert('RGB'), master)
    max_diff = max(v[1] for v in diff.getextrema())
    mean_diff = sum(ImageStat.Stat(diff).mean)/3
    # Bounded parallax checks; nearest moves only 6 source pixels, not 20.
    for sign, label in [(-1,'left'),(1,'right')]:
        preview = sky.copy()
        for (_,layer),dx in zip(layers[1:],[1,4,6]):
            shifted=Image.new('RGBA',size)
            shifted.paste(layer,(sign*dx,0))
            preview=Image.alpha_composite(preview,shifted)
        preview.convert('RGB').save(d/f'motion-{label}.jpg',quality=95)
    result = {'status':'candidate; aesthetic selection pending','source_size':list(size),'web_size':[1536,1024],
      'restack_max_difference':max_diff,'restack_mean_difference':mean_diff,
      'motion_test_source_px':{'far':1,'mid':4,'near':6},
      'limitations':['near ground overlaps forest; larger movement needs additional hidden forest fill','source-color refinement is specific to this forest/coast palette','restack equality does not validate cut edges or physical occlusion'],
      'layers':[{'name':n,'sha256':hashlib.sha256((d/f'{n}.png').read_bytes()).hexdigest()} for n,_ in layers]}
    (d/'cut-check.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result))
    if max_diff: raise RuntimeError('Restack no longer matches the locked master')


if __name__ == '__main__': run(sys.argv[1])
