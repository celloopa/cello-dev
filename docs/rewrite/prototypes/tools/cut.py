#!/usr/bin/env python3
"""Cut a place's master into depth layers sky/far/mid/near. PIL only (no numpy).

    python3 docs/rewrite/prototypes/tools/cut.py docs/rewrite/prototypes/public/gen/layers/mirror-lake

Expects in DIR: clean.png (master minus near), sky-raw.png, far-raw.png, mid-raw.png, near-raw.png
(the *-raw edits are on flat #FF00FF). Writes sky.png, far.png, mid.png, near.png
(RGBA masters, git-ignored) and web copies *.webp next to them.

Why: the edits line up with the master pixel for pixel, but the model redraws what it keeps
(Mt Hood's snowfields shift, the clouds move, the mid edit dropped the mountain's reflection).
So each edit is used only as a **matte** (key.py), and wherever a layer is visible in the master
its color comes from the master. Only what the master never showed (the sky behind the
mountain, the mountain's slopes behind the firs) comes from the edits.
"""
import os
import subprocess
import sys
from PIL import Image, ImageChops, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))


def key(d, name):
    out = os.path.join(d, name.replace("-raw", "-key") + ".png")
    subprocess.run([sys.executable, os.path.join(HERE, "key.py"), os.path.join(d, name + ".png"), out], check=True)
    return Image.open(out).convert("RGBA")


def webp(img, path, width=1536):
    if img.size[0] > width:
        img = img.resize((width, round(img.size[1] * width / img.size[0])), Image.LANCZOS)
    img.save(path, "WEBP", quality=86, method=6)


def main(d):
    clean = Image.open(os.path.join(d, "clean.png")).convert("RGB")
    sky_fill = Image.open(os.path.join(d, "sky-raw.png")).convert("RGB")
    far_k, mid_k, near_k = key(d, "far-raw"), key(d, "mid-raw"), key(d, "near-raw")
    a_far, a_mid = far_k.getchannel("A"), mid_k.getchannel("A")

    # mid: matte from the edit, color from the master (keeps the lake's reflection)
    mid = clean.copy(); mid.putalpha(a_mid)

    # far: master where the mountain shows above the firs, the edit's slopes where firs hid it
    shows = ImageChops.multiply(a_far, ImageChops.invert(a_mid)).point(lambda v: 255 if v > 200 else 0)
    shows = shows.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.5))
    far = Image.composite(clean, far_k.convert("RGB"), shows); far.putalpha(a_far)

    # sky: master wherever nothing stood in front of it, the edit's sky elsewhere
    land = ImageChops.lighter(a_far, a_mid).filter(ImageFilter.MaxFilter(41)).filter(ImageFilter.GaussianBlur(8))
    sky = Image.composite(sky_fill, clean, land)

    near = near_k  # the fireweed: keyed edit as is

    for n, im in (("sky", sky), ("far", far), ("mid", mid), ("near", near)):
        im.save(os.path.join(d, n + ".png"), optimize=True)
        webp(im, os.path.join(d, n + ".webp"))
        print(n, im.mode, im.size)

    # check: the layers stacked back should reproduce the master
    stack = sky.convert("RGBA")
    for im in (far, mid, near):
        stack = Image.alpha_composite(stack, im)
    stack.convert("RGB").save(os.path.join(d, "restack.png"))


if __name__ == "__main__":
    main(sys.argv[1])
