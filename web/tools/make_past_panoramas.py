"""
Generate a period-photograph ("past") variant of each 360 panorama.

These are stylised albumen/silver-gelatin plate renderings of the SAME view,
not archival photographs. The goal is that toggling the Chronos Lens reads
unmistakably as stepping back in time: monochrome-toned, faded, grainy,
vignetted, softened by a slow period lens, and marked by dust and scratches.

Panoramas wrap horizontally, so every effect that varies across x is either
seamless-by-construction or generated with a horizontally periodic function —
otherwise a hard seam appears behind the viewer.
"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter

SRC_DIR = os.path.join("assets", "images")
RNG = np.random.default_rng(20250910)   # fixed seed = reproducible builds


def tone_curve(x, lift, gamma, shoulder):
    """Faded print: blacks lifted, highlights rolled off into a soft shoulder."""
    x = np.clip(x, 0.0, 1.0) ** gamma
    x = lift + (1.0 - lift) * x
    return x * (1.0 + shoulder) / (1.0 + shoulder * x)


def radial_vignette(h, w, strength=0.34, radius=0.88):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    # Only the vertical axis vignettes on an equirect map; a radial falloff in x
    # would seam at the wrap point, so x uses a full-period cosine instead.
    ny = (yy / (h - 1)) * 2.0 - 1.0
    vy = np.clip(np.abs(ny) / radius, 0, 1) ** 2.2
    vx = 0.5 - 0.5 * np.cos(2.0 * np.pi * (xx / w))       # seamless, period = w
    v = 1.0 - strength * np.clip(vy + 0.18 * vx, 0, 1)
    return v.astype(np.float32)


def add_grain(img, amount=0.055):
    """Luminance-weighted grain — heaviest in the midtones, like real film."""
    h, w, _ = img.shape
    lum = img.mean(axis=2, keepdims=True)
    weight = 1.0 - np.abs(lum - 0.5) * 1.6
    noise = RNG.normal(0.0, 1.0, (h, w, 1)).astype(np.float32)
    # Soften slightly so it reads as grain, not digital salt-and-pepper
    noise = np.asarray(
        Image.fromarray(((noise[:, :, 0] * 0.5 + 0.5) * 255).astype(np.uint8))
        .filter(ImageFilter.GaussianBlur(0.5)), dtype=np.float32
    )[:, :, None] / 255.0 * 2.0 - 1.0
    return img + noise * amount * np.clip(weight, 0, 1)


def add_dust_and_scratches(img, n_specks=700, n_scratches=11):
    """Emulsion damage. Scratches are vertical, as on a plate pulled from a holder."""
    h, w, _ = img.shape
    overlay = np.zeros((h, w), dtype=np.float32)

    ys = RNG.integers(0, h, n_specks)
    xs = RNG.integers(0, w, n_specks)
    vals = RNG.uniform(-0.75, 0.75, n_specks)
    sizes = RNG.integers(1, 3, n_specks)
    for y, x, v, s in zip(ys, xs, vals, sizes):
        overlay[y:y + s, x:x + s] += v

    for _ in range(n_scratches):
        x = int(RNG.integers(0, w))
        y0 = int(RNG.integers(0, h))
        length = int(RNG.integers(h // 12, h // 3))
        drift = RNG.uniform(-0.35, 0.35)
        v = RNG.uniform(0.18, 0.45) * (1 if RNG.random() < 0.6 else -1)
        for i in range(length):
            yy = y0 + i
            if yy >= h:
                break
            xx = int(x + drift * i) % w            # wrap, don't clip
            overlay[yy, xx] += v * (1.0 - i / length)

    overlay = np.asarray(
        Image.fromarray(np.clip(overlay * 127 + 128, 0, 255).astype(np.uint8))
        .filter(ImageFilter.GaussianBlur(0.4)), dtype=np.float32
    ) / 127.0 - 1.0035
    return img + overlay[:, :, None] * 0.38


def age(path_in, path_out):
    im = Image.open(path_in).convert("RGB")
    w, h = im.size

    # 1. Period lens softness + a touch of halation around bright areas
    soft = im.filter(ImageFilter.GaussianBlur(0.8))
    bloom = im.filter(ImageFilter.GaussianBlur(6.0))
    a = np.asarray(soft, dtype=np.float32) / 255.0
    b = np.asarray(bloom, dtype=np.float32) / 255.0
    highlights = np.clip((a.mean(axis=2, keepdims=True) - 0.62) / 0.38, 0, 1)
    a = a + b * highlights * 0.35

    # 2. Collapse to luminance on an ORTHOCHROMATIC response: early plates were
    #    over-sensitive to blue and nearly blind to red, so blue skies burned out
    #    to blank white while red stonework went dark. That inversion, more than
    #    the sepia tone, is what makes a photograph read as old.
    lum = (0.20 * a[:, :, 0] + 0.34 * a[:, :, 1] + 0.66 * a[:, :, 2])[:, :, None]

    # 3. Faded print tone curve
    lum = tone_curve(lum, lift=0.15, gamma=0.86, shoulder=0.35)
    lum = np.clip(lum, 0, 1)

    # 4. Albumen/sepia duotone: warm brown shadows, cream highlights
    shadow = np.array([0.30, 0.21, 0.14], dtype=np.float32)
    high = np.array([1.00, 0.96, 0.84], dtype=np.float32)
    img = shadow + (high - shadow) * lum

    # 5. Uneven chemical staining across the plate (seamless in x)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    stain = (
        0.05 * np.sin(2 * np.pi * xx / w + 0.7)
        + 0.04 * np.sin(4 * np.pi * xx / w + 2.1)
        + 0.05 * np.sin(np.pi * yy / h)
    )[:, :, None]
    img = img * (1.0 + stain)

    # 6. Vignette, grain, damage
    img = img * radial_vignette(h, w)[:, :, None]
    img = add_grain(img)
    img = add_dust_and_scratches(img)

    img = np.clip(img, 0, 1)
    out = Image.fromarray((img * 255).astype(np.uint8))
    out.save(path_out, "JPEG", quality=88, optimize=True)
    return out.size, os.path.getsize(path_out)


if __name__ == "__main__":
    os.chdir(r"d:\SIH 5")
    targets = sorted(f for f in os.listdir(SRC_DIR) if f.endswith("_panorama.png"))
    if not targets:
        print("no panoramas found"); sys.exit(1)
    for f in targets:
        src = os.path.join(SRC_DIR, f)
        dst = os.path.join(SRC_DIR, f.replace("_panorama.png", "_panorama_past.jpg"))
        size, nbytes = age(src, dst)
        print("%-42s -> %-46s %s  %d KB" % (f, os.path.basename(dst), size, nbytes // 1024))
