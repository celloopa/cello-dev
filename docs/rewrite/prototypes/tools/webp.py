#!/usr/bin/env python3
"""Turn layers exported from Figma (PNG) into the web copies the window loads. PIL only.

    python3 docs/rewrite/prototypes/tools/webp.py docs/rewrite/prototypes/public/gen/layers/mirror-lake

Reads DIR/figma/<name>.png (Figma's PNG export of each named layer: sky, far, mid, near) and
writes DIR/<name>.webp at 1536 px wide. The PNGs stay local (git-ignored); the .webp are committed.
"""
import os
import sys
from PIL import Image


def main(d, width=1536):
    src = os.path.join(d, "figma")
    for f in sorted(os.listdir(src)):
        if not f.endswith(".png"):
            continue
        im = Image.open(os.path.join(src, f))
        im = im.convert("RGBA" if "A" in im.getbands() and im.getchannel("A").getextrema()[0] < 255 else "RGB")
        if im.size[0] > width:
            im = im.resize((width, round(im.size[1] * width / im.size[0])), Image.LANCZOS)
        out = os.path.join(d, f[:-4] + ".webp")
        im.save(out, "WEBP", quality=86, method=6)
        print(out, im.mode, im.size, os.path.getsize(out) // 1024, "KB")


if __name__ == "__main__":
    main(sys.argv[1])
