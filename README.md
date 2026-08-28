# Muddumagu Hospital — Website

A clean, minimal, responsive website for **Muddumagu Hospital** built with plain
HTML, CSS and JavaScript. No build step or dependencies required.

## Sections

- **Hero** with quick stats and a prominent emergency contact card
- **Services** — core care offerings
- **About** the hospital
- **Departments** — specialties available
- **Doctors** — specialist team
- **Appointment** request form (front-end validation)
- **Contact** details and hours

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup and content |
| `styles.css` | Design tokens, layout and responsive styles |
| `script.js`  | Mobile nav, appointment form, footer year |

## Notes

The appointment form is front-end only and shows a confirmation message; wire it
to a backend or form service to receive real submissions. Contact details,
doctor names and address are placeholders — replace them with real information.
