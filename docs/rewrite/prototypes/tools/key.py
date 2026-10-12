#!/usr/bin/env python3
"""Key a flat #FF00FF background to alpha, with defringe. PIL only (no numpy).

    python3 docs/rewrite/prototypes/tools/key.py IN.png OUT.png [--key auto|#FF00FF]
        [--lo 40] [--hi 110] [--erode 1] [--webp OUT.webp --webp-width 1536]

How it works:
- Key color: `auto` takes the median of the magenta-ish border pixels (the model's "flat"
  magenta drifts a little, e.g. #F706F9), else the given hex.
- Alpha from the RGB distance to the key: below `lo` is background (0), above `hi` is ink (255),
  smooth in between. Fireweed magenta sits well over 110 away from #FF00FF, so it stays opaque.
- Defringe, in three passes: edge pixels are unmixed (C = a*F + (1-a)*K solved for F), which
  takes the magenta out of anti-aliased edges instead of leaving a pink halo; the alpha is
  eroded by `erode` px (MinFilter) to drop the last fringe ring; and leftover magenta spill on
  visible pixels near the edge is pulled back toward green.
"""
import argparse
import sys
from PIL import Image, ImageFilter


def parse_hex(s):
    s = s.lstrip("#")
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def border_median(img):
    w, h = img.size
    px = img.load()
    samples = []
    step = max(1, min(w, h) // 200)
    for x in range(0, w, step):
        samples += [px[x, 0], px[x, h - 1]]
    for y in range(0, h, step):
        samples += [px[0, y], px[w - 1, y]]
    # only magenta-ish samples: a layer can touch the border (trees, lake), the key still can't
    samples = [c for c in samples if c[0] > 180 and c[2] > 180 and c[1] < 90] or [(255, 0, 255)]
    return tuple(sorted(c[i] for c in samples)[len(samples) // 2] for i in range(3))


def pixels(img):
    return img.get_flattened_data() if hasattr(img, "get_flattened_data") else img.getdata()


def smooth(t):
    t = 0.0 if t < 0 else 1.0 if t > 1 else t
    return t * t * (3 - 2 * t)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src")
    ap.add_argument("out")
    ap.add_argument("--key", default="auto")
    ap.add_argument("--lo", type=float, default=40)
    ap.add_argument("--hi", type=float, default=110)
    ap.add_argument("--erode", type=int, default=1)
    ap.add_argument("--webp")
    ap.add_argument("--webp-width", type=int, default=1536)
    a = ap.parse_args()

    img = Image.open(a.src).convert("RGB")
    w, h = img.size
    kr, kg, kb = border_median(img) if a.key == "auto" else parse_hex(a.key)
    span = max(1.0, a.hi - a.lo)

    # 1. alpha from key distance, unmix partial pixels
    alpha = bytearray(w * h)
    rgb = []
    for i, (r, g, b) in enumerate(pixels(img)):
        d = ((r - kr) ** 2 + (g - kg) ** 2 + (b - kb) ** 2) ** 0.5
        al = smooth((d - a.lo) / span)
        alpha[i] = int(al * 255 + 0.5)
        if 0 < al < 1:
            inv = 1 - al
            r, g, b = (int(max(0, min(255, (c - inv * k) / al))) for c, k in ((r, kr), (g, kg), (b, kb)))
        rgb.append((r, g, b))

    raw_alpha = Image.frombytes("L", (w, h), bytes(alpha))
    # 2. erode the fringe ring
    a_img = raw_alpha.filter(ImageFilter.MinFilter(a.erode * 2 + 1)) if a.erode > 0 else raw_alpha

    # 3. spill clamp near the edge: magenta casts (R≈B, both well above G) only, so the
    #    fireweed's red-pink (R far above B) is left alone
    near = raw_alpha.filter(ImageFilter.MinFilter(7)).load()
    for i, (r, g, b) in enumerate(rgb):
        if near[i % w, i // w] < 255:
            m = min(r, b)
            if m > g + 24 and abs(r - b) < 40:
                s = m - g - 24
                rgb[i] = (r - s, g, b - s)

    out = Image.new("RGB", (w, h))
    out.putdata(rgb)
    out.putalpha(a_img)
    out.save(a.out, optimize=True)
    if a.webp:
        o = out
        if w > a.webp_width:
            o = o.resize((a.webp_width, round(h * a.webp_width / w)), Image.LANCZOS)
        o.save(a.webp, "WEBP", quality=88, method=6)

    hist = a_img.histogram()
    print(f'{{"out":"{a.out}","key":"#{kr:02X}{kg:02X}{kb:02X}","size":[{w},{h}],'
          f'"transparent":{hist[0] / (w * h):.3f},"opaque":{hist[255] / (w * h):.3f}}}')


if __name__ == "__main__":
    sys.exit(main())
