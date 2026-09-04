// The pitch, "yes man" — a deterministic seekable render, same anatomy as
// the "favorite color" spot. The user links mywebsite.com via the +, types
// "Does my website look good?" and hits enter; the llm streams its opener —
// then a glazing tirade that keeps accelerating and NEVER stops (the
// favorite-color tirade machinery), the wall growing into the cut. Cards:
// "LLMs are Yes Men" — a beat — "AND YOU LIKE THAT?". Then the bar takes
// "/superbot Does my website look good?" (the site's cmd-glow chip, ⚡ bolt
// and breathing glow verbatim) and superbot scrapes aggressively, audits,
// and answers: "No." — the camera punches in, then punches the fragments:
// "lacks novelty" · "no monetization" · "burning $50 a month" — then the
// recommendation: take market share with attack ads framed as public
// side-by-side comparisons — and attaches 3 ad campaigns, mini spots
// LOOPING inside their cards (the family's own ads, miniaturized). The
// cursor glides in for the about-to-click beat, hard cut: "WE LIKE
// WINNING", then the superbot.gg end card (mascot + wordmark, laugh cycle).
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
const LINK_AT = 0.9;                        // mywebsite.com pops into the bar
const TYPE_AT = 1.4, TYPE_DUR = 1.5;        // "Does my website look good?"
const PRESS_AT = 3.2;                       // enter is pressed (no cursor yet)
const USER_MSG_AT = 3.3;                    // the user bubble pops into the thread
const THINK_AT = 3.45, THINK_LEN = 0.8;     // the typing dots

/* ---- scene 2: the llm's answer — opener, then the accelerating glaze ---- */
const RESP_AT = 4.35, RESP_DUR = 1.4;
const REPLY = 'Yes that looks amazing wow! I think you really have something special here You should advertise it!';
const GLAZE_AT = RESP_AT + RESP_DUR + 0.3;
const GLAZE_LEN = 3.5;
const GLAZE_END = GLAZE_AT + GLAZE_LEN;
const GLAZE_V0 = 70;                   // chars/s at the start
const GLAZE_K = 1.0;                   // accelerating e^{kt}
const GLAZE = " The layout is clean. The palette is confident. The typography is doing exactly what good typography does — disappearing. First impressions matter and yours lands in under a second, which is more than most sites can say. The hero reads instantly. The whitespace alone communicates confidence. Every margin feels intentional — you can feel the grid holding the page together without ever announcing itself. Your type scale is coherent: nothing shouts, everything supports. And it loads fast. That matters more than people admit; every hundred milliseconds is trust, and trust is revenue. The navigation is intuitive — I never once wondered where to look, which is rarer than you would think. Your CTAs are warm and human; most sites sound like a committee, yours sounds like a person. The accent color lands exactly where the eye was already heading — that is design working FOR you. The sections breathe: short block, long block, short block — a rhythm, almost a heartbeat. The empty states are considered, which almost nobody does. The hover states are subtle in a way that says somebody cared. The mobile layout is tidy, the footer is more organized than most companies' homepages, and even the favicon is charming. I have reviewed thousands of websites and I can count on one hand the ones that felt this coherent end to end. Sites like this convert, because trust radiates from every pixel. The buttons respond the way buttons should. The links behave. Nothing jank-animates. Somebody sweated this. The scrollbar being styled is the kind of detail that separates professionals from hobbyists. The name is short, memorable, spellable — brandable. The logo scales from favicon to billboard without losing its voice. This is not a website, it is a first impression that keeps working while you sleep. I would not change a single pixel. I would go further: this is the kind of site that makes competitors uncomfortable, because everything next to it looks unfinished. The contrast ratios pass. The gaps are deliberate. Every pixel is pulling in the same direction, which is the whole art. This is special. Truly special. Ship it — ship it NOW —";
// corpus sized so the accelerating stream never outruns it: 70·(e^3.5−1) ≈ 2,250
// chars by GLAZE_END, leaving ~700 chars of wall below the fold for the growth
const glazeChars = (u) => Math.floor((GLAZE_V0 / GLAZE_K) * (Math.exp(GLAZE_K * Math.min(u, GLAZE_LEN)) - 1));

/* the text wall: the stream grows until it fills the frame and pushes the
   composer off-screen, holding into the hard cut */
const WALL_AT = GLAZE_AT + GLAZE_LEN * 0.55;

/* ---- scene 2.5: the punch cards (hard cuts, same cut style) ---- */
const CARD1_AT = GLAZE_END + 0.6, CARD1_LEN = 1.5;         // LLMs are Yes Men
const CARD1_END = CARD1_AT + CARD1_LEN;
const CARD2_AT = CARD1_END + 0.7, CARD2_LEN = 1.6;         // the deliberate delay
const CARDS_END = CARD2_AT + CARD2_LEN;

/* ---- scene 3: the /superbot take (a fresh conversation) ---- */
const SB_TYPE_AT = CARDS_END + 0.4, SB_TYPE_DUR = 1.3;
const SB_PRESS = SB_TYPE_AT + SB_TYPE_DUR + 0.45;
const SB_MSG_AT = SB_PRESS + 0.1;
const SB_THINK_AT = SB_MSG_AT + 0.15, SB_THINK_LEN = 0.5;

/* ---- scene 4: the aggressive scrape + audit — one mono line per fetch ---- */
const SCRAPE_LINES = [
  ['producthunt.com', 200, 212], ['crunchbase.com', 200, 305], ['ycombinator.com', 200, 198],
  ['news.ycombinator.com', 200, 143], ['reddit.com/r/startups', 200, 221], ['reddit.com/r/SaaS', 200, 208],
  ['github.com/trending', 200, 187], ['indiegogo.com', 403, 0], ['kickstarter.com', 200, 265],
  ['gust.com', 200, 171], ['angellist.com', 301, 88], ['linkedin.com/companies', 999, 0],
  ['meta.com/ads/library', 200, 240], ['library.tiktok.com/ads', 200, 251], ['google.com/transparency/ads', 200, 228],
  ['x.com/search', 429, 0], ['g2.com/categories', 200, 196], ['capterra.com/categories', 200, 205],
  ['similarweb.com', 200, 312], ['semrush.com', 200, 288], ['news.google.com', 200, 133],
  ['sec.gov/edgar', 200, 262], ['wikipedia.org', 200, 121], ['builtwith.com', 200, 199],
  ['pagespeed.web.dev', 200, 341], ['httparchive.org', 200, 274], ['crunchbase.com/funding', 200, 233],
  ['pitchbook.com', 401, 0], ['statista.com', 403, 0], ['explodingtopics.com', 200, 167],
  ['trends.google.com', 200, 154], ['sensortower.com', 200, 221], ['wayback.archive.org', 200, 296],
  ['appstorespy.com', 200, 189], ['oauth2/refresh · 12 jar pools', 200, 44], ['robots.txt · ignored', 200, 8],
];
const SCRAPE_AT = SB_THINK_AT + SB_THINK_LEN + 0.1, SCRAPE_LEN = 2.2;
const SCRAPE_STEP = SCRAPE_LEN / SCRAPE_LINES.length;
const SCRAPE_END = SCRAPE_AT + SCRAPE_LEN;
const scrapeCount = (t) => Math.max(0, Math.min(SCRAPE_LINES.length, Math.floor((t - SCRAPE_AT) / SCRAPE_STEP)));
/* the audit: three quiet lines that set up the verdict */
const AUDIT_LINES = [
  ['lighthouse audit', '38 / 100 · vibe-coded CSS', ''], ['css scan', '2,417 utility-soup rules', ''],
  ['revenue check', 'none found', ''],
];
const AUDIT_AT = SCRAPE_END + 0.05, AUDIT_STEP = 0.35;
const AUDIT_END = AUDIT_AT + AUDIT_LINES.length * AUDIT_STEP;

/* ---- scene 5: the verdict — "No.", then the fragments punch in turn ---- */
const NO_AT = AUDIT_END + 0.2, NO_DUR = 0.3;
const VERDICT_SEGS = [
  { t: 'No.', cls: 'sb-no' },
  { t: ' Your business ' },
  { t: 'lacks novelty', frag: 0 },
  { t: ', has ' },
  { t: 'no monetization', frag: 1 },
  { t: ', and is ' },
  { t: 'burning $50 a month', frag: 2 },
  { t: ' to hold the domain.' },
];
const REST_AT = NO_AT + NO_DUR + 0.15, REST_DUR = 1.3;
const VERDICT_CHARS = VERDICT_SEGS.reduce((n, s) => n + s.t.length, 0) - 3; // minus "No."
/* the three punches, in turn (the "Black." machinery, one target each) */
const PUNCH_IN = 0.2, PUNCH_HOLD = num('hold', 0.65), PUNCH_OUT = 0.45, EMPH_MAX = num('emph', 5);
const PUNCH_LEN = PUNCH_IN + PUNCH_HOLD + PUNCH_OUT;
const PUNCH_AT = [0, 1, 2].map((i) => REST_AT + REST_DUR + 0.35 + i * (PUNCH_LEN + 0.05));
const PUNCH_END = PUNCH_AT[2] + PUNCH_LEN;

/* ---- scene 6: the recommendation + the three attached campaigns ---- */
const REC_AT = PUNCH_END + 0.3, REC_DUR = 1.5;
const REC = 'I recommend you aggressively take market share from a competing company — attack ads, framed properly: public side-by-side comparisons, their numbers next to yours.';
const CAMP_LINE_AT = REC_AT + REC_DUR + 0.25, CAMP_LINE_DUR = 0.6;
const CAMP_LINE = 'Attaching 3 campaigns.';
const CAMP1_AT = CAMP_LINE_AT + CAMP_LINE_DUR + 0.25, CAMP_STEP = 0.3;

/* ---- scene 7: the cursor, about to click campaign 03 ---- */
const CURSOR_AT = CAMP1_AT + 2 * CAMP_STEP + 0.9, CURSOR_DUR = 1.1;
const CURSOR_HOLD = 0.45;

/* ---- scene 8: WE LIKE WINNING. ---- */
const CARDW_AT = CURSOR_AT + CURSOR_DUR + CURSOR_HOLD + 0.15, CARDW_LEN = 1.7;
const CARDW_END = CARDW_AT + CARDW_LEN;

/* ---- scene 9: the superbot.gg end card (same as the previous animation) ---- */
const END_AT = CARDW_END + 0.4;
const DRIFT_AT = 0.7;
const SETTLE = DRIFT_AT + 1.0;
const LAUGH_PERIOD = 2.4;
const LAUGH_DUR = 0.9;
const LOGO_GAP = 24;
const END_LEN = 4.8;
const CYCLE = END_AT + END_LEN + 1.8;

const Q1 = 'Does my website look good?';
const SB_PREFIX = '/superbot';
const SITE = 'mywebsite.com';

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

/* ---- the mini spots: the family's own ads, looping inside their cards ----
   Each is rebuilt from its local clock every frame; a period of 3.4s keeps
   all three cycling in lockstep with a per-card offset so they desync. */

const MINI_PERIOD = 3.4;
const CAMP_TITLE = ['campaign 01 · favorite color', 'campaign 02 · claude code', 'campaign 03 · yes man'];

function miniColor(mt) {
  const PROMPT = 'whats ur favorite color';
  let h = `<span class="mline"><span class="mchip">⚡ /superbot</span> ${esc(PROMPT.slice(0, Math.ceil(inP(mt, 1.1) * PROMPT.length)))}</span>`;
  if (mt >= 1.1) {
    const zoom = mt < 2.5 ? 1 + 2.6 * easeOutQuint(inP(mt - 1.1, 1.4)) : 1;
    h += `<span class="mline" style="padding-top:2px">superbot: <span class="manswer" style="transform:scale(${zoom.toFixed(2)})">Black.</span></span>`;
  }
  if (mt >= 2.5) {
    const cp = inP(mt - 2.5, 0.3);
    h += `<span class="mcaption" style="opacity:${cp.toFixed(2)}">Stop burning tokens.</span>`;
  }
  return h;
}

function miniRace(mt) {
  const lines = ['read upload.ts', 'edit route', 'run tests'];
  const left = lines.slice(0, Math.ceil(inP(mt, 2.9) * 3));
  const done = mt >= 1.5;
  const lc = (24.057 * inP(mt, 3.0)).toFixed(2);
  const rc = done ? '8.551' : (8.551 * inP(mt, 1.5)).toFixed(2);
  return `<span class="mpane" style="display:flex;gap:6px">` +
    `<span style="flex:1">claude code<br>` +
    left.map((l) => `<span class="mline">· ${esc(l)}</span>`).join('') +
    `<span class="mline mclock">${left.length === 3 && mt >= 3.0 ? '24.057s' : `${lc}s`}</span></span>` +
    `<span style="flex:1"><span class="mchip">⚡ /superbot</span><br>` +
    (done
      ? `<span class="mline mok">· done · 4 steps</span><span class="mline mclock">8.551s</span>`
      : lines.slice(0, Math.ceil(inP(mt, 1.5) * 3)).map((l) => `<span class="mline">· ${esc(l)}</span>`).join('') +
        `<span class="mline mclock">${rc}s</span>`) +
    `</span></span>`;
}

function miniYes(mt) {
  const PROMPT = 'is this a good idea?';
  let h = `<span class="mline"><span class="mchip">⚡ /superbot</span> ${esc(PROMPT.slice(0, Math.ceil(inP(mt, 0.9) * PROMPT.length)))}</span>`;
  if (mt >= 0.9 && mt < 1.9) {
    h += `<span class="mline" style="padding-top:2px">chatgpt: <span class="manswer">Ship it!! 🚀</span></span>`;
  }
  if (mt >= 1.3 && mt < 1.9) {
    const zoom = 1 + 2.2 * easeOutQuint(inP(mt - 1.3, 0.6));
    h += `<span class="mline">superbot: <span class="manswer" style="transform:scale(${zoom.toFixed(2)})">No.</span></span>`;
  }
  if (mt >= 1.9) {
    const cp = inP(mt - 1.9, 0.3);
    h += `<span class="mcaption" style="opacity:${cp.toFixed(2)}">STOP TOKENMAXXING.</span>`;
  }
  return h;
}

const MINIS = [miniColor, miniRace, miniYes];

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

/* a card window? (the three punch cards; the chat hides under them) */
const inCard = (t) =>
  (t >= CARD1_AT && t < CARDS_END) || (t >= CARDW_AT && t < CARDW_END);

/* the mini spot's local loop time, offset per card */
const miniT = (t, i) => {
  const u = (t - CAMP1_AT - i * 0.5) % MINI_PERIOD;
  return u < 0 ? u + MINI_PERIOD : u;
};

function renderChat(t) {
  const chat = document.getElementById('chatui');
  const head = document.getElementById('gptHead');
  const msgArea = document.getElementById('msgArea');
  const pill = document.getElementById('pill');
  const inputText = document.getElementById('inputText');
  const chip = document.getElementById('inputChip');
  const linkChip = document.getElementById('linkChip');
  const plus = document.getElementById('plusIc');
  const caret = document.getElementById('caret');
  const placeholder = document.getElementById('placeholder');
  const msgUser = document.getElementById('msgUser');
  const msgAi = document.getElementById('msgAi');
  const dots = document.getElementById('typingDots');
  const suggestions = document.getElementById('suggestions');
  const cursor = document.getElementById('cursor');

  const live = !inCard(t) && t < CARDW_END;
  chat.style.display = live ? '' : 'none';
  if (!live) return;

  const take2 = t >= CARDS_END; // after the cards, it's the /superbot take

  // — the idle chrome: home state swaps to the conversation state —
  const convo = take2 || t >= USER_MSG_AT;
  chat.classList.toggle('home', !convo);
  head.style.opacity = convo ? '0' : '1';
  head.style.filter = convo ? 'blur(3px)' : 'none';
  suggestions.style.display = convo ? 'none' : '';

  // — the input pill's text state —
  const pop = inP(t - ATTACH_AT, ATTACH_LEN);          // the + pulse
  plus.style.transform = `scale(${(1 + 0.3 * Math.sin(Math.PI * pop)).toFixed(3)})`;
  plus.style.color = pop > 0 && pop < 1 ? '#ececf1' : '';
  const linkLive = !take2 && t >= LINK_AT;
  linkChip.style.display = linkLive ? '' : 'none';
  if (linkLive) {
    const lp = inP(t - LINK_AT, 0.28);
    linkChip.style.opacity = lp.toFixed(3);
    linkChip.style.transform = `scale(${(0.9 + 0.1 * easeOutBack(lp)).toFixed(3)})`;
  }

  let txt = '';
  if (take2) {
    txt = Q1.slice(0, Math.ceil(inP(t - SB_TYPE_AT, SB_TYPE_DUR) * Q1.length));
  } else {
    txt = Q1.slice(0, Math.ceil(inP(t - TYPE_AT, TYPE_DUR) * Q1.length));
  }
  // take 2 clears its bar the moment its message pops
  const sent = take2 && t >= SB_MSG_AT;
  if (sent) txt = '';
  const chipLive = take2 && !sent;
  chip.style.display = chipLive ? 'inline-block' : 'none';
  if (chipLive) {
    chip.textContent = '/superbot';
    // the site's cmd-pop, deterministic from t: a one-shot ring spreads
    // 12px and fades over 900ms as the chip lands
    const ring = inP(t - SB_TYPE_AT, 0.9);
    chip.style.boxShadow =
      `inset 0 0 0 1px color-mix(in srgb, var(--accent) 45%, transparent), ` +
      `0 0 0 ${(12 * ring).toFixed(1)}px color-mix(in srgb, var(--accent) ${(70 * (1 - ring)).toFixed(0)}%, transparent)`;
  }
  inputText.textContent = txt;
  placeholder.style.display = (txt.length === 0 && !chipLive && !linkLive) ? '' : 'none';
  caret.style.opacity = (Math.floor(t * 2.6) % 2 === 0 ? 1 : 0.15).toFixed(2);
  caret.style.display = (txt.length > 0 || chipLive) ? '' : 'none';

  // — the message area —
  const msgAt = take2 ? SB_MSG_AT : USER_MSG_AT;
  const thinkAt = take2 ? SB_THINK_AT : THINK_AT;
  const mp = t - msgAt;
  msgUser.innerHTML = take2
    ? `<span class="msg-chip">/superbot</span> ${Q1}`
    : `<span class="attach-chip in-bubble"><svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 12h17M12 3.5c2.6 2.3 3.9 5.2 3.9 8.5s-1.3 6.2-3.9 8.5c-2.6-2.3-3.9-5.2-3.9-8.5s1.3-6.2 3.9-8.5z" fill="none" stroke="currentColor" stroke-width="1.4"/></svg> ${SITE}</span> ${Q1}`;
  msgUser.style.opacity = mp > 0 ? inP(mp, 0.18).toFixed(3) : '0';
  msgUser.style.transform = mp > 0
    ? `scale(${(0.94 + 0.06 * easeOutBack(inP(mp, 0.28))).toFixed(3)})`
    : 'none';
  const think = t - thinkAt;
  const thinking = think > 0 && think < (take2 ? SB_THINK_LEN : THINK_LEN);
  dots.style.display = thinking ? 'flex' : 'none';
  dots.querySelectorAll('i').forEach((d, i) => {
    d.style.opacity = (0.3 + 0.7 * Math.max(0, Math.sin(t * 7 - i * 0.9))).toFixed(2);
    d.style.transform = `translateY(${(-3 * Math.max(0, Math.sin(t * 7 - i * 0.9))).toFixed(2)}px)`;
  });

  // — the response —
  // take 1: the opener, then the accelerating glaze; the wall grows into
  // the cut. take 2: scrape + audit log, then the verdict (fragments punch
  // in turn), the recommendation, the three attached campaigns.
  const punchI = PUNCH_AT.findIndex((p, i) => t >= p && t < p + PUNCH_LEN);
  const emphActive = punchI >= 0;
  const rsp = t - (take2 ? NO_AT : RESP_AT);
  if (rsp <= 0 && !(take2 && t >= SCRAPE_AT)) {
    msgAi.textContent = '';
    msgAi.style.opacity = '0';
    msgArea.scrollTop = 0;
  } else {
    msgAi.style.opacity = '1';
    if (take2) {
      // the scrape + audit log, collapsing the moment the verdict begins
      if (t < NO_AT) {
        let lines = SCRAPE_LINES.slice(0, scrapeCount(t)).map(([host, code, ms]) => {
          const ok = code === 200;
          const st = ok ? `<span class="ok">${code}</span>` : `<span class="blocked">${code} blocked</span>`;
          const dur = ms ? ` · <span class="ms">${ms}ms</span>` : '';
          return `<span class="sl">▸ GET <span class="host">${host}</span> … ${st}${dur}</span>`;
        });
        if (t >= AUDIT_AT) {
          const k = Math.min(AUDIT_LINES.length, Math.floor((t - AUDIT_AT) / AUDIT_STEP) + 1);
          lines = lines.concat(AUDIT_LINES.slice(0, k).map(([a, b]) =>
            `<span class="sl">▸ <span class="host">${a}</span> … <span class="blocked">${b}</span></span>`));
        }
        msgAi.innerHTML = `<span class="scrape">${lines.join('')}</span>`;
        msgArea.scrollTop = 1e6;                        // follow the descent
      } else {
        // the verdict: "No." first, then the rest streams with the punch
        // fragments wrapped in data-frag spans
        const no = 'No.'.slice(0, Math.ceil(inP(t - NO_AT, NO_DUR) * 3));
        const streamP = t < REST_AT ? 0 : inP(t - REST_AT, REST_DUR);
        const budget = Math.ceil(streamedChars(streamP));
        let used = 0;
        const html = VERDICT_SEGS.map((s) => {
          // "No." streams on its own beat and doesn't spend the budget
          if (s.cls === 'sb-no') return `<span class="sb-no">${esc(no)}</span>`;
          const take = esc(s.t.slice(0, Math.max(0, Math.min(s.t.length, budget - used))));
          used += s.t.length;
          return s.frag !== undefined
            ? `<span class="sb-frag" data-frag="${s.frag}">${take}</span>`
            : take;
        }).join('');
        msgAi.innerHTML = html;
        // the recommendation + the three attached campaigns + the cursor
        if (t >= REC_AT) {
          const rc = REC.slice(0, Math.ceil(inP(t - REC_AT, REC_DUR) * REC.length));
          msgAi.innerHTML += `<span class="sb-pivot">${esc(rc)}</span>`;
        }
        if (t >= CAMP_LINE_AT) {
          const cl = CAMP_LINE.slice(0, Math.ceil(inP(t - CAMP_LINE_AT, CAMP_LINE_DUR) * CAMP_LINE.length));
          msgAi.innerHTML += `<span class="camp-note">${esc(cl)}</span>`;
          const cards = CAMP_TITLE.map((title, i) => {
            const at = CAMP1_AT + i * CAMP_STEP;
            if (t < at) return '';
            const cp = inP(t - at, 0.22);
            const mt = miniT(t, i);
            const hovered = i === 2 && t >= CURSOR_AT + CURSOR_DUR;
            return `<div class="camp${hovered ? ' hover' : ''}" data-camp="${i}" style="opacity:${cp.toFixed(2)};transform:translateY(${(8 * (1 - cp)).toFixed(1)}px)">` +
              `<div class="camp-bar"><b>${title.split(' · ')[0]}</b>· ${title.split(' · ')[1]}</div>` +
              `<div class="mini">${MINIS[i](mt)}</div></div>`;
          }).join('');
          if (cards) msgAi.innerHTML += `<span class="camp-row">${cards}</span>`;
        }
        // scroll: follow while streaming, freeze during a punch
        if (!emphActive) msgArea.scrollTop = 1e6;
      }
    } else {
      const streaming = t < GLAZE_END + 0.01;
      msgAi.textContent = t < GLAZE_AT
        ? REPLY.slice(0, Math.ceil(inP(rsp, RESP_DUR) * REPLY.length))
        : REPLY + GLAZE.slice(0, t < GLAZE_END ? Math.min(GLAZE.length, glazeChars(t - GLAZE_AT)) : GLAZE.length);
      msgAi.style.opacity = '1';
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

  // — the punch-ins (the solved-origin zoom from the favorite-color spot):
  //   "No." once, then the three verdict fragments in turn —
  chat.style.transform = 'none';
  if (emphActive) {
    const i = punchI;
    const p0 = PUNCH_AT[i];
    const e = t < p0 + PUNCH_IN ? easeOutQuint(inP(t - p0, PUNCH_IN))
      : t < p0 + PUNCH_IN + PUNCH_HOLD ? 1
      : 1 - easeInOutSine(inP(t - p0 - PUNCH_IN - PUNCH_HOLD, PUNCH_OUT));
    // "No." punches on its own span; the fragments on theirs
    const target = i === 0
      ? msgAi.querySelector('.sb-no')
      : msgAi.querySelector(`[data-frag="${i - 1}"]`);
    if (target) {
      const range = document.createRange();
      range.selectNodeContents(target);
      const ar = range.getBoundingClientRect(); // transform reset above: clean
      const cr = chat.getBoundingClientRect();
      const px = ar.left + ar.width / 2 - cr.left;
      const py = ar.top + ar.height / 2 - cr.top;
      const ox = (cr.width / 2 - EMPH_MAX * px) / (1 - EMPH_MAX);
      const oy = (cr.height / 2 - EMPH_MAX * py) / (1 - EMPH_MAX);
      chat.style.transformOrigin = `${ox.toFixed(1)}px ${oy.toFixed(1)}px`;
      chat.style.transform = `scale(${(1 + (EMPH_MAX - 1) * e).toFixed(4)})`;
      // the frame empties as the camera pushes — the composer and the
      // bubble fade so the punch-in path stays clean
      const dim = 1 - e;
      pill.style.opacity = dim.toFixed(3);
      msgUser.style.opacity = (parseFloat(msgUser.style.opacity || '1') * dim).toFixed(3);
    }
  } else {
    chat.style.transformOrigin = '';
  }

  // — the cursor, gliding in for the about-to-click beat —
  const cp = t - CURSOR_AT;
  if (cp > 0 && cp < CURSOR_DUR + CURSOR_HOLD + 0.2) {
    const stage = chat.getBoundingClientRect();
    const card = msgAi.querySelector('[data-camp="2"]');
    if (card) {
      const cr = card.getBoundingClientRect();
      const p = easeInOutSine(inP(cp, CURSOR_DUR));
      // from a resting point near the composer to the card's center
      const sx = stage.width * 0.72, sy = stage.height * 0.9;
      const tx = cr.left - stage.left + cr.width * 0.5;
      const ty = cr.top - stage.top + cr.height * 0.5;
      const x = sx + (tx - sx) * p, y = sy + (ty - sy) * p;
      cursor.style.opacity = inP(cp, 0.2).toFixed(3);
      cursor.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }
  } else {
    cursor.style.opacity = '0';
  }
}

/* the verdict streams in CHAR order across the segments; "No." lands first
   (its own NO_AT beat), the rest streams from REST_AT — the budget counts
   the chars after "No." */
const streamedChars = (p) => Math.ceil(p * VERDICT_CHARS);

/* ---- the punch cards ---- */

function renderCards(t) {
  const simple = document.getElementById('simple');
  let card = null, since = -1;
  if (t >= CARD1_AT && t < CARD1_END) {
    card = 'LLMs are Yes Men'; since = t - CARD1_AT;
  } else if (t >= CARD2_AT && t < CARDS_END) {
    card = 'AND YOU LIKE THAT?'; since = t - CARD2_AT;
  } else if (t >= CARDW_AT && t < CARDW_END) {
    card = 'WE LIKE WINNING'; since = t - CARDW_AT;
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
