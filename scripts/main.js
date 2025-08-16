import { siteConfig as importedConfig } from './config.js';

// Use preview from admin.html if present
let siteConfig = (() => {
  try { const raw = localStorage.getItem('siteConfigPreview'); if (raw) return JSON.parse(raw); }
  catch {}
  return importedConfig;
})();
const c = siteConfig;

// Theme & header
document.documentElement.style.setProperty('--primary', c.theme?.primary || '#7a5cff');
document.documentElement.style.setProperty('--accent', c.theme?.accent || '#ff71d8');
const setText = (id, v) => { const el = document.getElementById(id); if (el && v!=null) el.textContent = v; };
setText('brand-name', c.name); setText('name', c.name); setText('brand-tagline', c.tagline); setText('tagline', c.tagline);
document.getElementById('year').textContent = new Date().getFullYear(); setText('footerName', c.name);
const headshot = document.getElementById('headshot'); if (c.headshot) headshot.src = c.headshot;
const imdbLink = document.getElementById('imdbLink'); if (c.imdb) imdbLink.href = c.imdb; else imdbLink.remove();

// Socials
const socials = document.getElementById('socials');
if (Array.isArray(c.socials)) socials.innerHTML = c.socials.map(s => `<a class="btn alt" href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`).join('');

// About
document.getElementById('aboutText').textContent = c.about || '';

// Reels
const reels = document.getElementById('reels');
if (Array.isArray(c.reels)) {
  reels.innerHTML = c.reels.map(r => `
    <article class="card">
      ${r.src?.match(/\.(jpg|png|svg)$/i) ? `<img src="${r.src}" alt="${r.title||''}">` : `<video src="${r.src}" controls preload="metadata"></video>`}
      <div class="pad"><strong>${r.title||''}</strong></div>
    </article>
  `).join('');
}

// Services
const servicesEl = document.getElementById('services');
if (Array.isArray(c.services)) {
  servicesEl.innerHTML = c.services.map(s => `
    <li class="service">
      <h3>${s.title||''} <span class="price">${s.price || ''}</span></h3>
      <div>${s.desc || ''}</div>
      <div class="cta-row" style="margin-top:10px">
        <button class="btn alt request" data-service="${(s.title||'').replace(/"/g, '&quot;')}">Request</button>
        ${s.stripeLink ? `<a class="btn" href="${s.stripeLink}" target="_blank" rel="noopener">Pay Now</a>` : ''}
      </div>
    </li>
  }).join('');
}

// Hire
const hireEl = document.getElementById('hireCards');
if (Array.isArray(c.hire)) {
  hireEl.innerHTML = c.hire.map(s => `
    <li class="service">
      <h3>${s.title||''} <span class="price">${s.price || ''}</span></h3>
      <div>${s.desc || ''}</div>
      <div class="cta-row" style="margin-top:10px">
        <button class="btn alt request" data-service="${(s.title||'').replace(/"/g, '&quot;')}">Request</button>
      </div>
    </li>
  }).join('');
}

// Testimonials
const quotes = document.getElementById('quotes');
if (Array.isArray(c.testimonials)) {
  quotes.innerHTML = c.testimonials.map(q => `
    <figure class="quote"><em>“${q.quote||''}”</em><br><small>${q.author||''}</small></figure>
  `).join('');
}

// Contact & request logic
const emailLink = document.getElementById('emailLink');
if (c.email) emailLink.href = `mailto:${c.email}?subject=Inquiry`;

const form = document.getElementById('contactForm');
const serviceSelect = document.getElementById('f-service');
const statusEl = document.getElementById('formStatus');

// Populate dropdown from services + hire
if (serviceSelect) {
  const items = [...(c.services||[]), ...(c.hire||[])];
  serviceSelect.innerHTML = `<option value="">Select a service…</option>` + items.map(s => `<option value="${s.title}">${s.title}</option>`).join('');
}

// Request buttons scroll & preselect
document.addEventListener('click', e => {
  const btn = e.target.closest('.request');
  if (!btn) return;
  const title = btn.getAttribute('data-service') || '';
  if (serviceSelect) serviceSelect.value = title;
  document.getElementById('contact')?.scrollIntoView({behavior:'smooth'});
});

// Submit
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const service = serviceSelect?.value || '';
  const name = document.getElementById('f-name')?.value?.trim() || '';
  const email = document.getElementById('f-email')?.value?.trim() || '';
  const phone = document.getElementById('f-phone')?.value?.trim() || '';
  const message = document.getElementById('f-msg')?.value?.trim() || '';
  if (!name || !email || !message) { statusEl.textContent = "Please complete required fields."; return; }

  const mode = (c.booking?.mode || 'mailto').toLowerCase();
  if (mode === 'formspree' && c.booking?.formspreeEndpoint) {
    statusEl.textContent = "Sending…";
    try {
      const resp = await fetch(c.booking.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, name, email, phone, message })
      });
      statusEl.textContent = resp.ok ? "Thanks! Your request was sent." : "Could not send just now. Please email instead.";
      if (resp.ok) form.reset();
    } catch { statusEl.textContent = "Network error. Please email instead."; }
    return;
  }
  if (mode === 'calendly' && c.booking?.calendly) {
    window.open(c.booking.calendly, '_blank');
    statusEl.textContent = "Opening booking calendar…";
    return;
  }
  // mailto fallback
  const to = encodeURIComponent(c.email || 'someone@example.com');
  const subject = encodeURIComponent(`Service Request: ${service || 'General Inquiry'}`);
  const body = encodeURIComponent(`Service: ${service || '(not selected)'}\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '(none)'}\n\nMessage:\n${message}`);
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
});

// Animated flower
const flower = document.getElementById('flower');
const petals = Math.max(5, Math.min(14, Number(c.flower?.petals || 8)));
const petalColor = c.flower?.petal || '#ff71d8';
const centerColor = c.flower?.center || '#ffd166';
const ringColor = c.flower?.ring || '#8be9fd';
const makePetal = (angle, i) => {
  const d = 'M100 30 C 120 50, 120 90, 100 110 C 80 90, 80 50, 100 30 Z';
  return `<path class="petal" d="${d}" style="--rot:${angle}deg;--delay:${i*80}ms" fill="${petalColor}" opacity="0.95"/>`;
};
let p = ''; for (let i=0;i<petals;i++){ p += makePetal((360/petals)*i, i); }
flower.innerHTML = p + `<circle cx="100" cy="100" r="20" fill="${ringColor}" opacity="0.25"/>` + `<circle class="center" cx="100" cy="100" r="14" fill="${centerColor}"/>`;
