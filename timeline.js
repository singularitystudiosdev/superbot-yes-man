// The pitch, "yes man" — TRUNCATED at AND YOU LIKE THAT?: that card holds
// 1.1s and the show cuts straight to the superbot.gg end card (mascot +
// wordmark, laugh cycle — same as the previous animation). Same deterministic
// seekable anatomy as the "favorite color" spot. The user pastes
// carbkiller.com (plain text — verified 1:1 against chatgpt.com, 2026-09-03:
// a link is never a chip), types "Does my website look good?" and hits enter;
// the bar CLEARS like the real thing and the bubble holds what was sent. The
// llm streams its opener — then a glazing tirade with periodic 😍✨💖 emojis
// that keeps accelerating and NEVER stops, the wall growing into the hard
// cut. Cards: "LLMs are made to agree with you" (2.1s) — cut —
// "AND YOU LIKE THAT?" (1.1s) — straight to the outro.
// render(t) rebuilds every scene from scratch; every effect is computed
// from t, so ?t=SECONDS freeze-frames exactly. Arrows step ±0.25s in freeze.

import { Mascot } from './mascot.js';

/* variant overrides (?key=value — variants.html compares treatments side by
   side): the punch-in depth and its hold */
const Q = new URLSearchParams(location.search);
const num = (k, d) => { const v = parseFloat(Q.get(k)); return Number.isFinite(v) ? v : d; };

const SPEED = 1.15;          // the whole show plays ~15% faster (family style)

/* ---- scene 1: the attach, the typing + the send ---- */
const ATTACH_AT = 0.55, ATTACH_LEN = 0.35;  // the + pulses
const PASTE_AT = 0.9;                       // carbkiller.com lands as text (a paste)
const TYPE_AT = 1.4, TYPE_DUR = 1.5;        // "Does my website look good?"
const PRESS_AT = 3.2;                       // enter is pressed (no cursor yet)
const USER_MSG_AT = 3.3;                    // the user bubble pops into the thread
const THINK_AT = 3.45, THINK_LEN = 0.8;     // the typing dots

/* ---- scene 2: the llm's answer — opener, then the accelerating glaze ---- */
const RESP_AT = 4.35, RESP_DUR = 1.4;
const REPLY = 'Yes omg that looks great! ❤️';
const GLAZE_AT = RESP_AT + RESP_DUR + 0.3;
const GLAZE_LEN = 3.5;
const GLAZE_END = GLAZE_AT + GLAZE_LEN;
const GLAZE_V0 = 70;                   // chars/s at the start
const GLAZE_K = 1.0;                   // accelerating e^{kt}
const GLAZE = " The layout is clean 😍 The palette is confident. The typography is doing exactly what good typography does — disappearing. First impressions matter and yours lands in under a second ✨ which is more than most sites can say. The hero reads instantly. The whitespace alone communicates confidence 💖 Every margin feels intentional — you can feel the grid holding the page together without ever announcing itself. Your type scale is coherent: nothing shouts ✨ everything supports. And it loads fast 😊 That matters more than people admit; every hundred milliseconds is trust, and trust is revenue. The navigation is intuitive — I never once wondered where to look 🥰 which is rarer than you would think. Your CTAs are warm and human; most sites sound like a committee, yours sounds like a person ❤️ The accent color lands exactly where the eye was already heading — that is design working FOR you ✨ The sections breathe: short block, long block, short block — a rhythm, almost a heartbeat 😊 The empty states are considered, which almost nobody does. The hover states are subtle in a way that says somebody cared 💖 The mobile layout is tidy, the footer is more organized than most companies' homepages, and even the favicon is charming 🥰 I have reviewed thousands of websites and I can count on one hand the ones that felt this coherent end to end ✨ Sites like this convert, because trust radiates from every pixel ❤️ The buttons respond the way buttons should. The links behave. Nothing jank-animates 😊 Somebody sweated this. The scrollbar being styled is the kind of detail that separates professionals from hobbyists ✨ The name is short, memorable, spellable — brandable 💖 The logo scales from favicon to billboard without losing its voice. This is not a website, it is a first impression that keeps working while you sleep 😍 I would not change a single pixel ✨ I would go further: this is the kind of site that makes competitors uncomfortable, because everything next to it looks unfinished ❤️ The contrast ratios pass. The gaps are deliberate 😊 Every pixel is pulling in the same direction, which is the whole art ✨ This is special. Truly special 🥰 Ship it — ship it NOW ❤️";
// corpus sized so the accelerating stream never outruns it: 70·(e^3.5−1) ≈ 2,250
// chars by GLAZE_END, leaving ~700 chars of wall below the fold for the growth
const glazeChars = (u) => Math.floor((GLAZE_V0 / GLAZE_K) * (Math.exp(GLAZE_K * Math.min(u, GLAZE_LEN)) - 1));

/* the text wall: the stream grows until it fills the frame and pushes the
   composer off-screen, holding into the hard cut */
const WALL_AT = GLAZE_AT + GLAZE_LEN * 0.55;

/* ---- scene 2.5: the punch cards (hard cuts, no dead air between them) ---- */
const CARD1_AT = GLAZE_END + 0.08, CARD1_LEN = 2.1;  // LLMs are made to agree with you
const CARD1_END = CARD1_AT + CARD1_LEN;
const CARD2_AT = CARD1_END, CARD2_LEN = 1.1;         // AND YOU LIKE THAT? (holds, then straight to the outro)
const CARDS_END = CARD2_AT + CARD2_LEN;

/* ---- scene 3: the superbot.gg end card, straight from the card ---- */
const END_AT = CARDS_END;
const DRIFT_AT = 0.7;
const SETTLE = DRIFT_AT + 1.0;
const LAUGH_PERIOD = 2.4;
const LAUGH_DUR = 0.9;
const LOGO_GAP = 24;
const END_LEN = 4.8;
const CYCLE = END_AT + END_LEN + 1.8;

const Q1 = 'Does my website look good?';
const SITE = 'carbkiller.com';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const easeOutQuint = (p) => 1 - Math.pow(1 - p, 5);
const easeOutBack = (p) => 1 + 2.70158 * Math.pow(p - 1, 3) + 1.70158 * Math.pow(p - 1, 2);
const easeInOutSine = (p) => -(Math.cos(Math.PI * p) - 1) / 2;
const inP = (p, dur) => clamp(p / dur, 0, 1);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/* ---- chrome: the loop veil ---- */

function renderChrome(t) {
  const veil = document.getElementById('veil');
  let v = 0;
  if (t < 0.35) v = 1 - t / 0.35;
  if (t > CYCLE - 1.8) v = clamp((t - (CYCLE - 1.8)) / 1.4, 0, 1);
  veil.style.opacity = v.toFixed(3);
}

/* ---- the chat interface ---- */

let inited = false;
let endBot = null;
let endLaugh = false;

function initChat() {
  if (inited) return;
  inited = true;
  try {
    endBot = new Mascot(document.getElementById('endBot'), { cols: 30, rows: 15, anim: 'perky', autoMorph: false });
  } catch (err) {
    console.warn('[yesman] end-card mascot unavailable:', err);
  }
}

/* a card window? (the two punch cards; the chat hides under them) */
const inCard = (t) => t >= CARD1_AT && t < CARDS_END;

function renderChat(t) {
  const chat = document.getElementById('chatui');
  const head = document.getElementById('gptHead');
  const msgArea = document.getElementById('msgArea');
  const pill = document.getElementById('pill');
  const inputText = document.getElementById('inputText');
  const plus = document.getElementById('plusIc');
  const caret = document.getElementById('caret');
  const placeholder = document.getElementById('placeholder');
  const msgUser = document.getElementById('msgUser');
  const msgAi = document.getElementById('msgAi');
  const dots = document.getElementById('typingDots');
  const suggestions = document.getElementById('suggestions');

  const live = !inCard(t);
  chat.style.display = live ? '' : 'none';
  if (!live) return;

  // — the idle chrome: home state swaps to the conversation state —
  const convo = t >= USER_MSG_AT;
  chat.classList.toggle('home', !convo);
  head.style.opacity = convo ? '0' : '1';
  head.style.filter = convo ? 'blur(3px)' : 'none';
  suggestions.style.display = convo ? 'none' : '';

  // — the input pill's text state —
  const pop = inP(t - ATTACH_AT, ATTACH_LEN);          // the + pulse
  plus.style.transform = `scale(${(1 + 0.3 * Math.sin(Math.PI * pop)).toFixed(3)})`;
  plus.style.color = pop > 0 && pop < 1 ? '#ececf1' : '';

  // take 1: the URL lands as one chunk (a paste) and the question types
  // after it — a link is PLAIN TEXT in the real composer (verified 1:1 on
  // chatgpt.com, 2026-09-03: a link is plain text, never a chip.
  let txt = '';
  const pasted = t >= PASTE_AT ? `${SITE} ` : '';
  txt = pasted + Q1.slice(0, Math.ceil(inP(t - TYPE_AT, TYPE_DUR) * Q1.length));
  // the bar clears the moment the message pops — like the real thing: what
  // you sent lives in the thread, not the composer
  const sent = t >= USER_MSG_AT;
  if (sent) txt = '';
  inputText.innerHTML = esc(txt).replace(esc(SITE), `<span class="link">${esc(SITE)}</span>`);
  placeholder.style.display = txt.length === 0 ? '' : 'none';
  caret.style.opacity = (Math.floor(t * 2.6) % 2 === 0 ? 1 : 0.15).toFixed(2);
  caret.style.display = txt.length > 0 ? '' : 'none';

  // — the message area —
  const msgAt = USER_MSG_AT;
  const thinkAt = THINK_AT;
  const mp = t - msgAt;
  msgUser.innerHTML = `<span class="link">${SITE}</span> ${Q1}`;
  msgUser.style.opacity = mp > 0 ? inP(mp, 0.18).toFixed(3) : '0';
  msgUser.style.transform = mp > 0
    ? `scale(${(0.94 + 0.06 * easeOutBack(inP(mp, 0.28))).toFixed(3)})`
    : 'none';
  const think = t - thinkAt;
  const thinking = think > 0 && think < THINK_LEN;
  dots.style.display = thinking ? 'flex' : 'none';
  dots.querySelectorAll('i').forEach((d, i) => {
    d.style.opacity = (0.3 + 0.7 * Math.max(0, Math.sin(t * 7 - i * 0.9))).toFixed(2);
    d.style.transform = `translateY(${(-3 * Math.max(0, Math.sin(t * 7 - i * 0.9))).toFixed(2)}px)`;
  });

  // — the response: the opener, then the accelerating glaze; the wall
  //   grows into the cut —
  const rsp = t - RESP_AT;
  if (rsp <= 0) {
    msgAi.textContent = '';
    msgAi.style.opacity = '0';
    msgArea.scrollTop = 0;
  } else {
    msgAi.style.opacity = '1';
    msgAi.textContent = t < GLAZE_AT
      ? REPLY.slice(0, Math.ceil(inP(rsp, RESP_DUR) * REPLY.length))
      : REPLY + GLAZE.slice(0, t < GLAZE_END ? Math.min(GLAZE.length, glazeChars(t - GLAZE_AT)) : GLAZE.length);
    msgArea.scrollTop = 1e6;                      // follow the glaze
    // the wall: the stream grows until it fills the frame top-to-bottom
    // and pushes the composer off-screen, holding into the cut
    const wallP = t <= WALL_AT ? 0 : Math.pow(inP(t - WALL_AT, GLAZE_END - WALL_AT), 1.5);
    if (wallP > 0) {
      msgArea.style.flex = `0 0 ${(56 + 44 * wallP).toFixed(1)}%`;
      msgArea.style.maxHeight = 'none';
      if (wallP >= 1) {
        chat.style.justifyContent = 'flex-start';
        chat.style.paddingBottom = '0px';
      } else {
        chat.style.justifyContent = '';
        chat.style.paddingBottom = '';
      }
    } else {
      msgArea.style.flex = '';
      msgArea.style.maxHeight = '';
      chat.style.justifyContent = '';
      chat.style.paddingBottom = '';
    }
  }
}


/* ---- the punch cards ---- */

function renderCards(t) {
  const simple = document.getElementById('simple');
  let card = null, since = -1;
  if (t >= CARD1_AT && t < CARD1_END) {
    card = 'LLMs are made to agree with you'; since = t - CARD1_AT;
  } else if (t >= CARD2_AT && t < CARDS_END) {
    card = 'AND YOU LIKE THAT?'; since = t - CARD2_AT;
  }
  if (card === null) {
    simple.style.opacity = '0';
    return;
  }
  simple.textContent = card;
  simple.style.opacity = easeOutQuint(clamp(since / 0.35, 0, 1)).toFixed(3);
  simple.style.transform = `scale(${(0.94 + 0.06 * easeOutBack(inP(since, 0.45))).toFixed(3)})`;
  simple.style.filter = since < 0.35 ? `blur(${(4 * (1 - inP(since, 0.35))).toFixed(2)}px)` : 'none';
}

/* ---- the end card (same as the previous animation) ---- */

function renderEndcard(t) {
  const overlay = document.getElementById('endcard');
  const bot = document.getElementById('endBot');
  const word = document.getElementById('endWord');
  if (t < END_AT || t >= CYCLE) {
    overlay.style.display = 'none';
    endLaugh = false;
    return;
  }
  overlay.style.display = '';
  const s = t - END_AT;
  overlay.style.opacity = easeOutQuint(clamp(s / 0.5, 0, 1)).toFixed(3);

  const stage = overlay.getBoundingClientRect();
  const shift = easeOutQuint(clamp((s - DRIFT_AT) / 1.0, 0, 1));
  const w = bot.offsetWidth, h = bot.offsetHeight;
  const scale = 1.22;
  const wordW = word.offsetWidth;
  const total = w * scale + LOGO_GAP + wordW;
  const left = (stage.width - total) / 2;
  const midY = stage.height / 2;
  const logoX = stage.width / 2 + (left + (w * scale) / 2 - stage.width / 2) * shift;
  bot.style.transform =
    `translate(${(logoX - w / 2).toFixed(1)}px, ${(midY - h / 2).toFixed(1)}px) scale(${scale.toFixed(3)})`;
  word.style.opacity = shift.toFixed(3);
  word.style.filter = shift < 1 ? `blur(${(6 * (1 - shift)).toFixed(1)}px)` : 'none';
  word.style.transform =
    `translate(${(left + w * scale + LOGO_GAP + 20 * (1 - shift)).toFixed(1)}px, -50%)`;

  if (endBot) {
    const laughing = s >= SETTLE && ((s - SETTLE) % LAUGH_PERIOD) < LAUGH_DUR;
    Object.assign(endBot.expr, laughing
      ? { eyeL: 'happy', eyeR: 'happy', mouth: 'grin' }
      : { eyeL: 'open', eyeR: 'open', mouth: 'smile' });
    if (laughing && !endLaugh) {
      endBot.excitedUntil = performance.now() + LAUGH_DUR * 1000;
    }
    endLaugh = laughing;
    endBot.lookAt = { x: 0.05 + 0.1 * Math.sin(s * 0.9), y: -0.05 + 0.06 * Math.sin(s * 1.1) };
  }
}

/* ---- driving ---- */

function render(t) {
  renderChat(t);
  renderCards(t);
  renderEndcard(t);
  renderChrome(t);
}

const urlT = new URLSearchParams(location.search).get('t');

initChat();

let t0 = performance.now();

if (urlT !== null) {
  let t = clamp(parseFloat(urlT) || 0, 0, CYCLE);
  document.body.classList.add('freeze');
  render(t);
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowRight') { t = clamp(t + 0.25, 0, CYCLE); render(t); }
    if (ev.key === 'ArrowLeft')  { t = clamp(t - 0.25, 0, CYCLE); render(t); }
  });
} else {
  function tick(now) {
    let t = ((now - t0) / 1000) * SPEED;
    if (t >= CYCLE) { t0 = now; t = 0; }
    render(t);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// the recorder contract (same as the previous animation)
window.__V7 = { CYCLE, SPEED };
window.__V7.restart = () => { t0 = performance.now(); };
