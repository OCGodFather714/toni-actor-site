# Toni Redman — Actor • Director • Producer • Coach (OC)

Static HTML/CSS/JS site with an in-browser editor and a Request Service flow.  
No backend required. Deploys on GitHub Pages or any static host.

## Features

- Mobile-first design with a unique animated flower accent
- Sections: Hero, About, Acting (reels), Coaching & Classes, Hire Toni, Testimonials, Contact
- Request buttons on services (email/Formspree/Calendly)
- Optional Stripe Payment Links (“Pay Now”) per service
- Admin editor at `/admin.html` → Update Preview → Export `config.js` (no code editing)
- All content configurable in `scripts/config.js` (name, bio, services, colors, flower)

## Project Structure

```
index.html
admin.html
styles/
└─ style.css
scripts/
├─ config.js       # Site content & settings
├─ main.js         # Renders content, request flow, flower
└─ admin.js        # Editor logic
assets/
├─ favicon.svg
├─ headshot.svg
└─ blossom-poster.svg
```

## Quick Start (Local)

1. Download or clone the repo.
2. Open `index.html` in a browser to preview.
3. Open `admin.html` to edit content.
4. Click **Update Preview** to see changes locally.
5. Click **Export `config.js`** and replace `scripts/config.js` in the repo to publish.

> Note: The editor stores preview data in the browser only (localStorage). Export to publish.

## Deploy on GitHub Pages

1. Push files to a public repo (for example, `toni-actor-site`).
2. In GitHub: Settings → Pages → Deploy from branch (root).
3. Open your Pages URL, e.g. `https://<username>.github.io/toni-actor-site/`.
4. Editor URL (optional to share): `https://<username>.github.io/toni-actor-site/admin.html`.

To hide the editor link from the navbar, remove this from `index.html`:

```html
<a href="admin.html">Edit</a>
```

---

## Editing Content (for Toni)

- Open `/admin.html`.
- Fill in: name, tagline, email, IMDb, bio, socials, reels, services, hire cards, testimonials.
- Click **Update Preview**.
- Click **Export `config.js`**, then replace `scripts/config.js` in the repo.

Media (reels, headshots, videos) should be uploaded to `assets/` and referenced in the editor or in `scripts/config.js`.

---

## Services and Requests

All service and hire cards include a Request button that pre-fills the contact form.

Configure submission behavior in `scripts/config.js`:

```js
booking: {
  mode: "mailto",            // 'mailto' (default), 'formspree', or 'calendly'
  formspreeEndpoint: "",     // e.g. "https://formspree.io/f/xxxxxxx"
  calendly: ""               // e.g. "https://calendly.com/your-link"
}
```

### Optional: Stripe “Pay Now”

Add a payment link to any service:

```js
services: [
  {
    title: "Private Coaching (Zoom or OC)",
    desc: "Audition prep, scene work, actionable notes.",
    price: "$95 / hr",
    stripeLink: "https://buy.stripe.com/your-link"
  }
]
```

---

## Customize the Animated Flower

In `scripts/config.js`:

```js
flower: { petal: "#ff71d8", center: "#ffd166", ring: "#8be9fd", petals: 8 }
```

- Include “Orange County” in the hero tagline.
- Use descriptive alt text for real images you upload.

---

## Common Tasks

**Add a new service**
- Editor → Coaching & Classes → Add Service → Update Preview → Export.

**Add a reel**
- Upload MP4 (or JPG/PNG) to `assets/`.
- Editor → Reels → Add Reel → set src to `assets/your-file.mp4`.

**Change theme colors**
- Editor → Basics → Theme Primary/Accent (or edit theme in `config.js`).

---

## Troubleshooting

- **Email client doesn’t open:** Some browsers block `mailto:`. Use `booking.mode = "formspree"` with a Formspree endpoint.
- **Videos don’t autoplay:** Keep them muted or rely on user controls.
- **404 on GitHub Pages:** Ensure files are at the repository root (or configure Pages to the correct folder).
- **Editor preview not updating:** Clear localStorage or export to confirm state, then reload.

---

## Privacy and Access

- The editor does not require login and stores preview data locally.
- Remove the navbar link to keep `/admin.html` less discoverable and share the URL privately.

---

## License

Use for this project as needed. Consider adding an MIT license if you plan to share the template.

---

## Credits

Built with vanilla HTML, CSS, and JavaScript for a simple, fast, and non-technical editing workflow.
