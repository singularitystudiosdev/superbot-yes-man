// The pitch, "yes man" — TRUNCATED at AND YOU LIKE THAT?: that card holds
// 1.15s and the show DISSOLVES smoothly into the superbot.gg end card (mascot +
// wordmark, laugh cycle — same as the previous animation); both cards and
// the outro sit on PURE black — the chat never flashes through (user ask). Same deterministic
// seekable anatomy as the "favorite color" spot. The user pastes
// carbkiller.com (plain text — verified 1:1 against chatgpt.com, 2026-09-03:
// a link is never a chip), types "Does my website look good?" and hits enter;
// the bar CLEARS like the real thing and the bubble holds what was sent. The
// llm streams its opener — then a glazing tirade with periodic 😍✨💖 emojis
// that keeps accelerating and NEVER stops, the wall growing into the hard
// cut. Cards: "LLMs are made to agree with you" (2.1s) — cut —
// "AND YOU LIKE THAT?" (1.15s) — smooth dissolve into the outro.
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
const CARD2_AT = CARD1_END, CARD2_LEN = 1.15;        // AND YOU LIKE THAT? (1.15s, then the transition)
const CARDS_END = CARD2_AT + CARD2_LEN;

/* ---- the card→outro transition: 40 FUNDAMENTALLY different mechanisms
   (user ask — no two are the same trick with different timing). Pick one
   with ?tr=NAME; variants.html compares them all. Each entry owns how the
   "AND YOU LIKE THAT?" text leaves: d = leave duration, split = needs
   per-letter spans, mas = how the outro arrives, pre = pure-black beat.
   fn(el, L, p, t): el is the card overlay, L the letter spans (when split),
   p the eased 0→1 progress, t the absolute scene time. Deterministic in
   (p, t) — freeze-frames and arrow-stepping land exactly. ---- */
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const GLYPH_SCRAMBLE = '▓▒░#*+%@&';
const scrambleChar = (i, t) => GLYPH_SCRAMBLE[Math.floor(hash(i * 3.7 + Math.floor(t * 20)) * GLYPH_SCRAMBLE.length) % GLYPH_SCRAMBLE.length];

const LEAVES = {
  fade: { d: 0.55, fn: (el, L, p) => { el.style.opacity = (1 - p).toFixed(3); } },
  shatter: { d: 0.8, split: true, mas: 'pop', fn: (el, L, p) => {
    L.forEach((s, i) => {
      const a = hash(i) * Math.PI * 2, dist = 70 + 90 * hash(i + 7);
      const q = clamp(p * 1.3 - 0.3 * hash(i + 3), 0, 1);
      s.style.transform = `translate(${(Math.cos(a) * dist * q).toFixed(1)}px, ${(Math.sin(a) * dist * q + 26 * q * q).toFixed(1)}px) rotate(${((hash(i + 11) - 0.5) * 160 * q).toFixed(1)}deg)`;
      s.style.opacity = (1 - q).toFixed(3);
    });
  } },
  cascade: { d: 0.85, split: true, fn: (el, L, p) => {
    const n = L.length;
    L.forEach((s, i) => { s.style.opacity = clamp(p * 2 - (i / n) * 1.6, 0, 1) === 0 ? '0' : (1 - clamp(p * 2 - (i / n) * 1.6, 0, 1)).toFixed(3); });
  } },
  erase: { d: 0.7, fn: (el, L, p, t) => { setCard(el, cardNow(t, 1 - p)); } },
  wipe: { d: 0.55, fn: (el, L, p) => { el.style.clipPath = `inset(-2% ${(-2 + p * 102).toFixed(2)}% -2% -2%)`; } },
  iris: { d: 0.6, fn: (el, L, p) => { el.style.clipPath = `circle(${((1 - p) * 75).toFixed(2)}% at 50% 50%)`; } },
  melt: { d: 0.75, fn: (el, L, p) => {
    el.style.filter = `blur(${(14 * p).toFixed(2)}px)`;
    el.style.letterSpacing = `${(8 * p).toFixed(2)}px`;
    el.style.opacity = (1 - p * p).toFixed(3);
  } },
  slide: { d: 0.5, mas: 'rise', fn: (el, L, p) => { el.style.transform = `translateX(${(-p * 110).toFixed(2)}vw)`; } },
  flip: { d: 0.6, fn: (el, L, p) => {
    el.style.transform = `perspective(600px) rotateX(${(p * 90).toFixed(2)}deg)`;
    el.style.opacity = (1 - p * p).toFixed(3);
  } },
  zoom: { d: 0.55, mas: 'nodrift', fn: (el, L, p) => {
    el.style.transform = `scale(${(1 + 2.4 * p).toFixed(4)})`;
    el.style.filter = `blur(${(12 * p).toFixed(2)}px)`;
    el.style.opacity = (1 - p * p).toFixed(3);
  } },
  sink: { d: 0.6, fn: (el, L, p) => {
    el.style.transform = `translateY(${(45 * p * p).toFixed(2)}vh) scale(${(1 - 0.6 * p).toFixed(4)})`;
    el.style.opacity = (1 - p * p).toFixed(3);
  } },
  glitch: { d: 0.7, mas: 'pop', fn: (el, L, p, t) => {
    const step = Math.floor(t * 24);
    const dx = (hash(step) - 0.5) * 22, dy = (hash(step + 4) - 0.5) * 12;
    el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
    el.style.opacity = p > 0.85 ? '0' : (hash(step + 9) > 0.3 ? '1' : '0.35');
  } },
  embers: { d: 0.9, split: true, fn: (el, L, p, t) => {
    L.forEach((s, i) => {
      const q = clamp(p * 1.4 - 0.4 * hash(i), 0, 1);
      const sway = 14 * Math.sin(t * 3 + i) * q;
      s.style.transform = `translate(${sway.toFixed(1)}px, ${(-90 * (0.4 + hash(i + 5)) * q * q).toFixed(1)}px)`;
      s.style.opacity = (1 - q).toFixed(3);
    });
  } },
  gravity: { d: 0.8, split: true, fn: (el, L, p) => {
    L.forEach((s, i) => {
      const q = clamp(p * 1.5 - 0.5 * hash(i), 0, 1);
      s.style.transform = `translateY(${(70 * q * q * (0.6 + 0.8 * hash(i + 2))).toFixed(1)}vh) rotate(${((hash(i + 6) - 0.5) * 240 * q).toFixed(1)}deg)`;
      s.style.opacity = q > 0.85 ? '0' : '1';
    });
  } },
  wind: { d: 0.75, split: true, fn: (el, L, p) => {
    L.forEach((s, i) => {
      const q = clamp(p * 1.4 - 0.4 * hash(i), 0, 1);
      s.style.transform = `translateX(${(130 * (0.4 + hash(i + 8)) * q * q).toFixed(1)}vw) skewX(${(-30 * q).toFixed(1)}deg)`;
      s.style.opacity = (1 - q).toFixed(3);
    });
  } },
  crt: { d: 0.5, pre: 0.1, fn: (el, L, p) => {
    if (p < 0.5) {
      el.style.transform = `scaleY(${Math.max(0.02, 1 - p * 2).toFixed(4)})`;
    } else {
      el.style.transform = `scaleY(0.02) scaleX(${Math.max(0, 1 - (p - 0.5) * 2).toFixed(4)})`;
    }
  } },
  static: { d: 0.55, fn: (el, L, p, t) => {
    const full = cardNow(t);
    let out = '';
    for (let i = 0; i < full.length; i++) out += hash(i + Math.floor(t * 20)) < 1 - p ? scrambleChar(i, t) : ' ';
    setCard(el, out);
    el.style.opacity = p > 0.8 ? ((1 - p) * 6.6).toFixed(3) : '1';
  } },
  flicker: { d: 0.8, fn: (el, L, p, t) => {
    el.style.opacity = p >= 0.75 ? '0' : (hash(Math.floor(t * 30)) > p ? '1' : '0.15');
  } },
  ink: { d: 0.85, fn: (el, L, p) => {
    el.style.filter = `blur(${(20 * p).toFixed(2)}px)`;
    el.style.transform = `scale(${(1 + 0.5 * p).toFixed(4)})`;
    el.style.opacity = Math.pow(1 - p, 1.5).toFixed(3);
  } },
  stamp: { d: 0.75, mas: 'pop', fn: (el, L, p, t) => {
    if (p < 0.3) {
      el.style.transform = `scale(${(2.6 - 5.33 * p).toFixed(4)})`;
      el.style.opacity = '1';
    } else {
      const q = (p - 0.3) / 0.7;
      const shake = q < 0.15 ? (hash(Math.floor(t * 40)) - 0.5) * 8 : 0;
      el.style.transform = `translate(${shake.toFixed(1)}px, ${(60 * q * q).toFixed(2)}vh) scale(1)`;
      el.style.opacity = (1 - q * q).toFixed(3);
    }
  } },
  bounce: { d: 0.9, fn: (el, L, p) => {
    const y = 130 * p * p + 20 * Math.abs(Math.sin(p * 14)) * (1 - p);
    el.style.transform = `translateY(${y.toFixed(1)}vh)`;
    el.style.opacity = p > 0.9 ? ((1 - p) * 10).toFixed(3) : '1';
  } },
  slingshot: { d: 0.7, fn: (el, L, p) => {
    const x = p < 0.35 ? -60 * easeInOutSine(p / 0.35) : -60 + 1400 * Math.pow((p - 0.35) / 0.65, 2);
    el.style.transform = `translateX(${x.toFixed(1)}px) scale(${p < 0.35 ? 1 - 0.04 * (p / 0.35) : 1})`;
  } },
  coin: { d: 0.6, fn: (el, L, p) => {
    el.style.transform = `perspective(800px) rotateY(${(p * 160).toFixed(2)}deg) translateX(${(20 * p * p).toFixed(2)}vw)`;
  } },
  peel: { d: 0.6, fn: (el, L, p) => {
    const k = clamp(100 - 200 * p, 0, 100);
    el.style.clipPath = `polygon(0 0, 100% 0, 100% 0%, ${k}% 100%, 0% ${k}%)`;
  } },
  curtain: { d: 0.5, pre: 0.18, fn: (el, L, p) => {
    el.style.clipPath = `inset(-2% ${(p * 51).toFixed(2)}% -2% ${(p * 51).toFixed(2)}%)`;
  } },
  blinds: { d: 0.6, split: true, fn: (el, L, p) => {
    L.forEach((s, i) => {
      const band = i % 4;
      const q = clamp(p * 1.6 - band * 0.2, 0, 1);
      s.style.transform = `scaleY(${Math.max(0.02, 1 - q).toFixed(3)})`;
      s.style.opacity = q > 0.9 ? '0' : '1';
    });
  } },
  part: { d: 0.55, mas: 'pop', split: true, fn: (el, L, p) => {
    const n = L.length;
    L.forEach((s, i) => {
      const dir = i < n / 2 ? -1 : 1;
      s.style.transform = `translateX(${(dir * 110 * p).toFixed(1)}vw)`;
      s.style.opacity = (1 - p).toFixed(3);
    });
  } },
  elevator: { d: 0.6, mas: 'wordfirst', fn: (el, L, p) => {
    el.style.transform = `translateY(${(-55 * p * p).toFixed(2)}vh)`;
  } },
  strobe: { d: 0.6, pre: 0.12, fn: (el, L, p, t) => {
    el.style.opacity = p >= 0.85 ? '0' : (hash(Math.floor(t * 18)) > 0.5 ? '1' : '0');
  } },
  outline: { d: 0.7, fn: (el, L, p) => {
    if (p < 0.5) {
      const q = p / 0.5;
      el.style.color = `rgba(240,240,240,${(1 - q).toFixed(3)})`;
      el.style.webkitTextStroke = '1px #f0f0f0';
    } else {
      const q = (p - 0.5) / 0.5;
      el.style.color = 'rgba(240,240,240,0)';
      el.style.webkitTextStroke = `1px rgba(240,240,240,${(1 - q).toFixed(3)})`;
    }
  } },
  echo: { d: 0.65, fn: (el, L, p) => {
    const shadows = [];
    for (let k = 1; k <= 5; k++) shadows.push(`${(k * 26 * p).toFixed(1)}px ${(k * 26 * p).toFixed(1)}px 0 rgba(240,240,240,${Math.max(0, 0.5 - k * 0.08).toFixed(3)})`);
    el.style.textShadow = shadows.join(', ');
    el.style.opacity = (1 - p).toFixed(3);
  } },
  karaoke: { d: 0.8, split: true, fn: (el, L, p) => {
    const n = L.length;
    L.forEach((s, i) => {
      s.style.color = i / n < p ? 'rgba(240,240,240,0.06)' : '';
    });
    el.style.opacity = p > 0.85 ? ((1 - p) * 6.6).toFixed(3) : '1';
  } },
  magnet: { d: 0.6, split: true, fn: (el, L, p) => {
    const n = L.length;
    L.forEach((s, i) => {
      s.style.transform = `translateX(${((0.5 - i / n) * 340 * p).toFixed(1)}px) scale(${Math.max(0.01, 1 - p).toFixed(3)})`;
      s.style.opacity = (1 - p).toFixed(3);
    });
  } },
  vortex: { d: 0.85, split: true, fn: (el, L, p) => {
    L.forEach((s, i) => {
      const a = hash(i) * Math.PI * 2, r = 220 * (1 - p);
      s.style.transform = `translate(${(Math.cos(a) * r).toFixed(1)}px, ${(Math.sin(a) * r).toFixed(1)}px) rotate(${(p * 540).toFixed(1)}deg)`;
      s.style.opacity = (1 - p).toFixed(3);
    });
  } },
  heartbeat: { d: 0.7, fn: (el, L, p) => {
    el.style.transform = `scale(${(1 + 0.14 * Math.abs(Math.sin(p * Math.PI * 2)) * (1 - p)).toFixed(4)})`;
    el.style.opacity = p > 0.9 ? ((1 - p) * 10).toFixed(3) : '1';
  } },
  snow: { d: 1.0, split: true, fn: (el, L, p, t) => {
    L.forEach((s, i) => {
      const q = clamp(p * 1.2 - 0.2 * hash(i), 0, 1);
      const sway = 24 * Math.sin(t * 1.6 + i) * q;
      s.style.transform = `translate(${(sway + (hash(i + 4) - 0.5) * 60 * q).toFixed(1)}px, ${(85 * (0.5 + 0.8 * hash(i + 9)) * q * q).toFixed(1)}px)`;
      s.style.opacity = (1 - q * 0.95).toFixed(3);
    });
  } },
  scramble: { d: 0.7, fn: (el, L, p, t) => {
    const full = cardNow(t);
    let out = '';
    for (let i = 0; i < full.length; i++) out += i / full.length < p ? scrambleChar(i, t) : full[i];
    setCard(el, out);
    el.style.opacity = p > 0.85 ? ((1 - p) * 6.6).toFixed(3) : '1';
  } },
  bloom: { d: 0.6, mas: 'zoom', fn: (el, L, p) => {
    el.style.textShadow = `0 0 ${(8 + 34 * p).toFixed(1)}px rgba(240,240,240,${(0.85 * p).toFixed(3)})`;
    el.style.transform = `scale(${(1 + 0.06 * p).toFixed(4)})`;
    el.style.opacity = p > 0.72 ? Math.max(0, 1 - (p - 0.72) / 0.09).toFixed(3) : '1';
  } },
  shockwave: { d: 0.6, fn: (el, L, p) => {
    const k = Math.min(3, Math.floor(p * 3.2));
    el.style.transform = `scale(${(1 + k * 0.28).toFixed(3)})`;
    el.style.opacity = (1 - k / 3).toFixed(3);
  } },
  instant: { d: 0, fn: () => {} },
};
const TRANSITIONS = Object.keys(LEAVES).map((name) => ({
  name,
  leave: name,
  mas: LEAVES[name].mas || 'plain',
  pre: LEAVES[name].pre || 0,
  d: LEAVES[name].d,
  split: !!LEAVES[name].split,
}));
const T = (() => {
  const want = Q.get('tr');
  if (!want) return TRANSITIONS[0];
  const byIdx = parseInt(want, 10);
  if (Number.isFinite(byIdx) && TRANSITIONS[byIdx - 1]) return TRANSITIONS[byIdx - 1];
  return TRANSITIONS.find((t) => t.name === want || t.name.includes(want)) || TRANSITIONS[0];
})();

/* the outro reveals as the text starts leaving (so the fade reads as a
   crossfade into the mascot); the beat variants hold pure black first */
const OUT_AT = CARDS_END + T.pre;

/* ---- scene 3: the superbot.gg end card, after the transition ---- */
const DRIFT_AT = 0.7;
const SETTLE = DRIFT_AT + 1.0;
const LAUGH_PERIOD = 2.4;
const LAUGH_DUR = 0.9;
const LOGO_GAP = 24;
const END_LEN = 4.8;
const CYCLE = OUT_AT + END_LEN + 1.8;

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
let endPop = false;

function initChat() {
  if (inited) return;
  inited = true;
  try {
    endBot = new Mascot(document.getElementById('endBot'), { cols: 30, rows: 15, anim: 'perky', autoMorph: false });
  } catch (err) {
    console.warn('[yesman] end-card mascot unavailable:', err);
  }
}

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

  // the chat stays visible only before the first card — from the cards
  // through the outro the background is pure black (fixes the chat flash
  // that used to read between the card and the outro)
  const live = t < CARD1_AT;
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


/* ---- the punch cards: hard cuts, pure black. The second card holds, then
   LEAVES by the selected mechanism (40 in LEAVES above) while the outro
   shows through the transparent card background beneath it. ---- */

let currentCard = null;

function setCard(el, text, split) {
  if (!split) { el.textContent = text; return; }
  el.textContent = '';
  for (const ch of text) {
    const s = document.createElement('span');
    s.className = 'ltr';
    s.textContent = ch;
    el.appendChild(s);
  }
}

function cardNow(t, frac) {
  if (!currentCard) return '';
  if (frac == null) return currentCard;
  return currentCard.slice(0, Math.max(0, Math.ceil(frac * currentCard.length)));
}

function renderCards(t) {
  const simple = document.getElementById('simple');
  let card = null, since = -1, leaving = false;
  const LEAVE = LEAVES[T.leave];
  const LEAVE_END = CARDS_END + (T.leave === 'instant' ? 0 : LEAVE.d);
  if (t >= CARD1_AT && t < CARD1_END) {
    card = 'LLMs are made to agree with you'; since = t - CARD1_AT;
  } else if (t >= CARD2_AT && t < LEAVE_END) {
    card = 'AND YOU LIKE THAT?'; since = t - CARD2_AT;
    leaving = t >= CARDS_END && T.leave !== 'instant';
  }
  if (card === null) {
    simple.style.opacity = '0';
    currentCard = null;
    return;
  }
  currentCard = card;
  setCard(simple, card, T.split && leaving);
  if (leaving) {
    // reset every property a leave mechanism can own, then hand the card
    // to it whole — the outro shows through the transparent card background
    simple.style.background = 'transparent';
    simple.style.opacity = '1';
    simple.style.transform = 'none';
    simple.style.filter = 'none';
    simple.style.letterSpacing = '';
    simple.style.clipPath = '';
    simple.style.textShadow = '';
    simple.style.webkitTextStroke = '';
    simple.style.color = '';
    const p = easeInOutSine(inP(t - CARDS_END, LEAVE.d));
    LEAVE.fn(simple, LEAVE.split ? Array.from(simple.children) : null, p, t);
    return;
  }
  simple.style.background = '';
  simple.style.letterSpacing = '';
  simple.style.clipPath = '';
  simple.style.textShadow = '';
  simple.style.webkitTextStroke = '';
  simple.style.color = '';
  simple.style.opacity = easeOutQuint(clamp(since / 0.35, 0, 1)).toFixed(3);
  simple.style.transform = `scale(${(0.94 + 0.06 * easeOutBack(inP(since, 0.45))).toFixed(3)})`;
  simple.style.filter = since < 0.35 ? `blur(${(4 * (1 - inP(since, 0.35))).toFixed(2)}px)` : 'none';
}

/* ---- the end card: reveals at OUT_AT (after the text leaves + the beat) ---- */

function renderEndcard(t) {
  const overlay = document.getElementById('endcard');
  const bot = document.getElementById('endBot');
  const word = document.getElementById('endWord');
  if (t < OUT_AT || t >= CYCLE) {
    overlay.style.display = 'none';
    endLaugh = false;
    endPop = false;
    return;
  }
  overlay.style.display = '';
  const s = t - OUT_AT;
  overlay.style.opacity = '1';   // instant reveal on pure black

  const stage = overlay.getBoundingClientRect();
  let shift = easeOutQuint(clamp((s - DRIFT_AT) / 1.0, 0, 1));
  if (T.mas === 'nodrift') shift = 1;
  const w = bot.offsetWidth, h = bot.offsetHeight;
  let scale = 1.22;
  if (T.mas === 'zoom') scale = 1.22 + 0.08 * (1 - clamp(s / 0.7, 0, 1));
  const rise = T.mas === 'rise' ? (1 - clamp(s / 0.6, 0, 1)) * 14 : 0;
  const wordW = word.offsetWidth;
  const total = w * scale + LOGO_GAP + wordW;
  const left = (stage.width - total) / 2;
  const midY = stage.height / 2;
  const logoX = stage.width / 2 + (left + (w * scale) / 2 - stage.width / 2) * shift;
  bot.style.transform =
    `translate(${(logoX - w / 2).toFixed(1)}px, ${(midY - h / 2 + rise).toFixed(1)}px) scale(${scale.toFixed(3)})`;
  const wordO = T.mas === 'wordfirst' ? clamp((s - 0.2) / 0.5, 0, 1) : shift;
  word.style.opacity = wordO.toFixed(3);
  word.style.filter = wordO < 1 ? `blur(${(6 * (1 - wordO)).toFixed(1)}px)` : 'none';
  word.style.transform =
    `translate(${(left + w * scale + LOGO_GAP + 20 * (1 - shift)).toFixed(1)}px, -50%)`;

  if (endBot) {
    // the mascot pops as the text finishes leaving (variants marked pop)
    if (T.mas === 'pop' && !endPop) {
      endBot.excitedUntil = performance.now() + 600;
      endPop = true;
    }
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
