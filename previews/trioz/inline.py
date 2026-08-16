"""Inline the bundled scene and the woff2 faces into a single HTML file."""
import base64, pathlib, sys

here = pathlib.Path(__file__).parent
fonts = here / "fonts"
dist = here / "dist"

missing = [n for n in ("archivo700.woff2", "plex400.woff2", "plex600.woff2")
           if not (fonts / n).exists()]
if missing:
    sys.exit(f"missing font files in {fonts}: {', '.join(missing)}\n"
             "Fetch the latin woff2 subsets and place them there — see README.")

html = (here / "template.html").read_text()
for token, name in (("__ARCHIVO700__", "archivo700.woff2"),
                    ("__PLEX400__", "plex400.woff2"),
                    ("__PLEX600__", "plex600.woff2")):
    html = html.replace(token, base64.b64encode((fonts / name).read_bytes()).decode())
html = html.replace("__SCENE_BUNDLE__", (dist / "scene.bundle.js").read_text())

out = dist / "trioz-preview.html"
out.write_text(html)
print(f"{out}  ({out.stat().st_size / 1024:.0f} KB)")
