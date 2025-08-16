import { siteConfig as base } from './config.js';
const $ = (id) => document.getElementById(id);
const state = structuredClone(base);

function renderArray(containerId, items, schema){
  const box = $(containerId);
  box.innerHTML = '';
  (items||[]).forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = schema.map(f => `
      <label>${f.label}<input type="${f.type||'text'}" data-idx="${i}" data-key="${f.key}" value="${(item[f.key] ?? '').toString().replace(/"/g,'&quot;')}" ${f.placeholder?`placeholder="${f.placeholder}"`:''}></label>
    `).join('') + `<div class="btnbar"><button class="btn alt" data-remove="${i}">Remove</button></div>`;
    box.appendChild(row);
  });
  box.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', e => {
      const idx = Number(e.target.dataset.idx);
      const key = e.target.dataset.key;
      items[idx][key] = e.target.value;
    });
  });
  box.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = Number(e.currentTarget.dataset.remove);
      items.splice(idx,1); render();
    });
  });
}

function bindBasics(){
  $('name').value = state.name || '';
  $('tagline').value = state.tagline || '';
  $('email').value = state.email || '';
  $('imdb').value = state.imdb || '';
  $('headshot').value = state.headshot || '';
  $('about').value = state.about || '';
  $('primary').value = state.theme?.primary || '#7a5cff';
  $('accent').value = state.theme?.accent || '#ff71d8';
  $('petals').value = state.flower?.petals || 8;
  $('flowerPetal').value = state.flower?.petal || '#ff71d8';
  $('flowerCenter').value = state.flower?.center || '#ffd166';
  $('flowerRing').value = state.flower?.ring || '#8be9fd';

  $('bookingMode').value = state.booking?.mode || 'mailto';
  $('formspree').value = state.booking?.formspreeEndpoint || '';
  $('calendly').value = state.booking?.calendly || '';
}

function wireBasics(){
  ['name','tagline','email','imdb','headshot','about'].forEach(id => {
    $(id).addEventListener('input', e => state[id] = e.target.value);
  });
  $('primary').addEventListener('input', e => { state.theme = state.theme||{}; state.theme.primary = e.target.value; });
  $('accent').addEventListener('input', e => { state.theme = state.theme||{}; state.theme.accent = e.target.value; });
  $('petals').addEventListener('input', e => { state.flower = state.flower||{}; state.flower.petals = Number(e.target.value)||8; });
  $('flowerPetal').addEventListener('input', e => { state.flower = state.flower||{}; state.flower.petal = e.target.value; });
  $('flowerCenter').addEventListener('input', e => { state.flower = state.flower||{}; state.flower.center = e.target.value; });
  $('flowerRing').addEventListener('input', e => { state.flower = state.flower||{}; state.flower.ring = e.target.value; });

  $('bookingMode').addEventListener('change', e => { state.booking = state.booking||{}; state.booking.mode = e.target.value; });
  $('formspree').addEventListener('input', e => { state.booking = state.booking||{}; state.booking.formspreeEndpoint = e.target.value; });
  $('calendly').addEventListener('input', e => { state.booking = state.booking||{}; state.booking.calendly = e.target.value; });
}

function render(){
  bindBasics();
  renderArray('socials', state.socials = state.socials || [], [
    {label:'Name', key:'name'}, {label:'URL', key:'url'}
  ]);
  renderArray('reels', state.reels = state.reels || [], [
    {label:'Title', key:'title'}, {label:'Src (MP4/JPG path in assets/)', key:'src'}
  ]);
  renderArray('services', state.services = state.services || [], [
    {label:'Title', key:'title'}, {label:'Description', key:'desc'}, {label:'Price', key:'price'}, {label:'Stripe Payment Link (optional)', key:'stripeLink', placeholder:'https://buy.stripe.com/...', type:'url'}
  ]);
  renderArray('hire', state.hire = state.hire || [], [
    {label:'Title', key:'title'}, {label:'Description', key:'desc'}, {label:'Price', key:'price'}
  ]);
}
wireBasics(); render();

$('addSocial').addEventListener('click', () => { (state.socials = state.socials||[]).push({name:'Instagram', url:'#'}); render(); });
$('addReel').addEventListener('click', () => { (state.reels = state.reels||[]).push({title:'New Reel', src:'assets/acting-reel.mp4'}); render(); });
$('addService').addEventListener('click', () => { (state.services = state.services||[]).push({title:'New Service', desc:'', price:'', stripeLink:''}); render(); });
$('addHire').addEventListener('click', () => { (state.hire = state.hire||[]).push({title:'Hire Toni — Role', desc:'', price:'Request quote'}); render(); });

$('preview').addEventListener('click', () => {
  try{
    localStorage.setItem('siteConfigPreview', JSON.stringify(state));
    alert('Preview saved. Open the site to see your changes.');
    window.open('index.html','_blank');
  }catch(e){ alert('Could not save preview: '+e.message); }
});
$('export').addEventListener('click', () => {
  const js = 'export const siteConfig = ' + JSON.stringify(state, null, 2) + ';\n';
  const blob = new Blob([js], {type:'text/javascript'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'config.js'; a.click(); URL.revokeObjectURL(url);
});
