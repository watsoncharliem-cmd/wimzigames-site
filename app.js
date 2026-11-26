// Wimzi Games home page: store buttons, the sky crew pop-up and the "Match the crew" mini game.

// App Store: set to true once Wimzi Solitaire is live on the App Store (the button then links there).
const APP_STORE_LIVE = false;
const APP_STORE_URL = 'https://apps.apple.com/app/id6827376167';
document.querySelectorAll('[data-appstore]').forEach(a => {
  if (APP_STORE_LIVE) { a.href = APP_STORE_URL; a.rel = 'noopener'; }
  else { a.classList.add('soon'); a.setAttribute('aria-disabled', 'true'); a.querySelector('small').textContent = 'Coming soon to the'; }
});

// ---- The sky crew
const crew = {
  pip:   { name: 'Pip',   role: 'Crew captain', color: '#2f8cf0', img: 'crew_bunny',    bio: 'First in the cockpit and first to cheer when you win. Never met a deck that couldn\'t be shuffled.' },
  rudy:  { name: 'Rudy',  role: 'Navigator',    color: '#43b02a', img: 'crew_raccoon',  bio: 'Has a map for everything and a knack for spotting the move everyone else missed.' },
  fen:   { name: 'Fen',   role: 'Speed flyer',  color: '#f28a1e', img: 'crew_fox',      bio: 'Lives for a race. Challenge Fen and you\'d better play fast.' },
  bao:   { name: 'Bao',   role: 'Co-pilot',     color: '#e0343a', img: 'crew_panda',    bio: 'Calm, steady and never in a hurry. The perfect partner for a tricky FreeCell.' },
  ollie: { name: 'Ollie', role: 'Night watch',  color: '#8a45d6', img: 'crew_owl',      bio: 'Up all night studying Spider. Knows four suits like the back of a wing.' },
  hazel: { name: 'Hazel', role: 'Builder',      color: '#f2c21b', img: 'crew_hedgehog', bio: 'Give Hazel a few sky stones and a castle will be back before lunch.' },
};
const dialog = document.querySelector('.crew-dialog');
document.querySelectorAll('[data-crew]').forEach(b => b.addEventListener('click', () => {
  const c = crew[b.dataset.crew];
  dialog.querySelector('.crew-pic').src = `/assets/sky/${c.img}.webp`;
  dialog.querySelector('.crew-pic').alt = c.name;
  dialog.querySelector('h2').textContent = c.name;
  const role = dialog.querySelector('.crew-role'); role.textContent = c.role; role.style.background = c.color;
  dialog.querySelector('.crew-bio').textContent = c.bio;
  dialog.showModal();
}));
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

// ---- Match the crew (3 pairs)
const board = document.querySelector('.match'), status = document.querySelector('.status');
const faces = ['crew_bunny', 'crew_fox', 'crew_owl'];
let open = [], busy = false, found = 0, round = 0;
function deal() {
  round++; open = []; busy = false; found = 0; board.replaceChildren(); status.textContent = 'Ready when you are!';
  const deck = faces.flatMap(f => [f, f]);
  for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  deck.forEach((f, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'mcard'; b.dataset.face = f;
    b.setAttribute('aria-label', `Card ${i + 1}`);
    const img = document.createElement('img'); img.src = `/assets/sky/${f}.webp`; img.alt = ''; b.append(img);
    b.addEventListener('click', () => flip(b));
    board.append(b);
  });
}
function flip(b) {
  if (busy || b.disabled || open.includes(b)) return;
  b.classList.add('open'); open.push(b);
  if (open.length < 2) return;
  if (open[0].dataset.face === open[1].dataset.face) {
    open.forEach(c => { c.classList.add('done'); c.disabled = true; });
    open = []; found++;
    status.textContent = found === 3 ? 'All three pairs! The crew is ready for take-off.' : `${found} of 3 pairs found. Keep going!`;
  } else {
    busy = true; status.textContent = 'Not quite. Try another pair!';
    const r = round;
    setTimeout(() => { if (r !== round) return; open.forEach(c => c.classList.remove('open')); open = []; busy = false; }, 900);
  }
}
document.querySelector('.reset').addEventListener('click', deal);
deal();

document.querySelector('#year').textContent = new Date().getFullYear();
