// The pitch, "yes man" — a deterministic seekable render, same anatomy as
// the "favorite color" spot: a chatgpt-like frontend, the user attaches
// proposal.pdf via the +, types "Is this a good business idea?" and hits
// enter; the llm gushes its yes-man answer. Three hard-cut punch cards:
// STOP BURNING TOKENS → ChatGPT is a Yes Man → You like that, don't you.
// Then the bar takes "/superbot Is this business idea good?" (the site's
// cmd-glow chip, ⚡ bolt and breathing glow verbatim) and superbot scrapes
// aggressively across the web — a fast mono log, one line per fetch —
// before answering: "No." (the camera punches in on the word, solved
// origin, same machinery as "Black."), the verdict, ten large companies
// doing the same, the pivot recommendation, some ideas. Then STOP
// TOKENMAXXING. and the superbot.gg end card (mascot + wordmark, laugh
// cycle — same as the previous animation).
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
const FILE_AT = 0.9;                        // proposal.pdf pops into the bar
const TYPE_AT = 1.35, TYPE_DUR = 1.4;       // "Is this a good business idea?"
const PRESS_AT = 3.15;                      // enter is pressed (no cursor)
const USER_MSG_AT = 3.25;                   // the user bubble pops into the thread
const THINK_AT = 3.4, THINK_LEN = 0.8;      // the typing dots

/* ---- scene 2: the llm's yes-man answer ---- */
const RESP_AT = 4.3, RESP_DUR = 1.2;
const REPLY = 'Yes that looks amazing! I say ship it! You can use chatgpt ads to release!';

/* ---- scene 2.5: the punch cards (hard cuts, same cut style) ---- */
const CARDS = ['STOP BURNING TOKENS', 'ChatGPT is a Yes Man', "You like that, don't you"];
const CARDS_AT = 6.3, CARD_LEN = 1.35;
const CARDS_END = CARDS_AT + CARDS.length * CARD_LEN;

/* ---- scene 3: the /superbot take (a fresh conversation) ---- */
const SB_TYPE_AT = CARDS_END + 0.4, SB_TYPE_DUR = 1.3;
const SB_PRESS = SB_TYPE_AT + SB_TYPE_DUR + 0.45;
const SB_MSG_AT = SB_PRESS + 0.1;
const SB_THINK_AT = SB_MSG_AT + 0.15, SB_THINK_LEN = 0.5;

/* ---- scene 4: the aggressive scrape — one mono line per fetch, fast ---- */
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
const scrapeCount = (t) => Math.max(0, Math.min(SCRAPE_LINES.length, Math.floor((t - SCRAPE_AT) / SCRAPE_STEP)));
const SCRAPE_AT = SB_THINK_AT + SB_THINK_LEN + 0.1, SCRAPE_LEN = 3.0;
const SCRAPE_STEP = SCRAPE_LEN / SCRAPE_LINES.length;
const SCRAPE_END = SCRAPE_AT + SCRAPE_LEN;

/* ---- scene 5: the verdict — "No." punches (the "Black." machinery),
   then the rest streams, the ten companies, the pivot, the ideas ---- */
const NO_AT = SCRAPE_END + 0.15, NO_DUR = 0.3;
const VERDICT_REST = ' There is no novelty in the concept, here are 10 other large companies doing the same. Your frontend design is visibly vibe coded, and you have no sales.';
const COMPANIES = ['PandaDoc', 'Proposify', 'Qwilr', 'Better Proposals', 'Nusii', 'Notion', 'Canva', 'Confluence', 'ClickUp', 'ChatGPT'];
const PIVOT = 'I recommend you pivot entirely, and collect a large dataset of objective a:b tested ad campaigns, here are some ideas.';
const IDEAS = [
  '· a public ledger of a:b-tested ad pairs, scored on measured lift',
  "· an agent that mines every platform's ad library every day",
  '· publish the benchmark your rivals are afraid to run',
];

/* the punch-in (same solved-origin machinery as the favorite-color spot) */
const EMPH_DELAY = num('delay', 0.55);
const EMPH_IN = 0.22, EMPH_HOLD = num('hold', 1.0), EMPH_OUT = 0.5, EMPH_MAX = num('emph', 6);
const EMPH_START = NO_AT + NO_DUR + EMPH_DELAY;
const EMPH_END = EMPH_START + EMPH_IN + EMPH_HOLD + EMPH_OUT;
const REST_AT = EMPH_END + 0.15, REST_DUR = 1.5;
const COMPANIES_AT = REST_AT + REST_DUR + 0.25, COMP_STEP = 0.09;
const PIVOT_AT = COMPANIES_AT + COMPANIES.length * COMP_STEP + 0.55, PIVOT_DUR = 1.6;
const IDEAS_AT = PIVOT_AT + PIVOT_DUR + 0.25, IDEA_STEP = 0.2;
const SETTLE_END = IDEAS_AT + IDEAS.length * IDEA_STEP + 0.7;

/* ---- scene 6: STOP TOKENMAXXING. ---- */
const CARD4_AT = SETTLE_END + 0.1, CARD4_LEN = 1.5;
const CARD4_END = CARD4_AT + CARD4_LEN;

/* ---- scene 7: the superbot.gg end card (same as the previous animation) ---- */
const END_AT = CARD4_END + 0.4;
const DRIFT_AT = 0.7;
const SETTLE = DRIFT_AT + 1.0;
const LAUGH_PERIOD = 2.4;
const LAUGH_DUR = 0.9;
const LOGO_GAP = 24;
const END_LEN = 4.8;
const CYCLE = END_AT + END_LEN + 1.8;

const Q1 = 'Is this a good business idea?';
const Q2 = 'Is this business idea good?';
const SB_PREFIX = '/superbot';
const FILE_NAME = 'proposal.pdf';

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

/* a card window? (the four punch cards; chat hides under them) */
const inCard = (t) =>
  (t >= CARDS_AT && t < CARDS_END) || (t >= CARD4_AT && t < CARD4_END);

function renderChat(t) {
  const chat = document.getElementById('chatui');
  const head = document.getElementById('gptHead');
  const msgArea = document.getElementById('msgArea');
  const pill = document.getElementById('pill');
  const inputText = document.getElementById('inputText');
  const chip = document.getElementById('inputChip');
  const fileChip = document.getElementById('fileChip');
  const plus = document.getElementById('plusIc');
  const caret = document.getElementById('caret');
  const placeholder = document.getElementById('placeholder');
  const msgUser = document.getElementById('msgUser');
  const msgAi = document.getElementById('msgAi');
  const dots = document.getElementById('typingDots');
  const suggestions = document.getElementById('suggestions');

  const live = !inCard(t) && t < CARD4_END;
  chat.style.display = live ? '' : 'none';
  if (!live) return;

  const take2 = t >= CARDS_END; // after the cards, it's the /superbot take

  // — the idle chrome: chatgpt.com's home state (greeting → composer →
  //   suggestions grouped upper-middle) swaps to the conversation state
  //   (thread pinned to the top, composer at the bottom) —
  const convo = take2 || t >= USER_MSG_AT;
  chat.classList.toggle('home', !convo);
  head.style.opacity = convo ? '0' : '1';
  head.style.filter = convo ? 'blur(3px)' : 'none';
  suggestions.style.display = convo ? 'none' : '';

  // — the input pill's text state —
  // take 1: + pulses, the file chip pops in, then the question types; the
  // bar keeps both through the whole stream (the bar never deletes fully).
  // take 2: the ⚡ /superbot chip (the site's cmd-glow, breathing glow)
  // then the question; the bar clears when its message pops.
  const pop = inP(t - ATTACH_AT, ATTACH_LEN);          // the + pulse
  plus.style.transform = `scale(${(1 + 0.3 * Math.sin(Math.PI * pop)).toFixed(3)})`;
  plus.style.color = pop > 0 && pop < 1 ? '#ececf1' : '';
  const fileLive = !take2 && t >= FILE_AT;
  fileChip.style.display = fileLive ? '' : 'none';
  if (fileLive) {
    const fp = inP(t - FILE_AT, 0.28);
    fileChip.style.opacity = fp.toFixed(3);
    fileChip.style.transform = `scale(${(0.9 + 0.1 * easeOutBack(fp)).toFixed(3)})`;
  }

  let txt = '';
  if (take2) {
    txt = Q2.slice(0, Math.ceil(inP(t - SB_TYPE_AT, SB_TYPE_DUR) * Q2.length));
  } else {
    txt = Q1.slice(0, Math.ceil(inP(t - TYPE_AT, TYPE_DUR) * Q1.length));
  }
  // take 2 clears its bar the moment its message pops
  const sent = take2 && t >= SB_MSG_AT;
  if (sent) txt = '';
  const chipLive = take2 && !sent;
  chip.style.display = chipLive ? 'inline-block' : 'none';
  if (chipLive) {
    // the bolt is the rule's ::before — the text is just the command
    chip.textContent = '/superbot';
    // the site's cmd-pop, deterministic from t: a one-shot ring spreads
    // 12px and fades over 900ms as the chip lands
    const ring = inP(t - SB_TYPE_AT, 0.9);
    chip.style.boxShadow =
      `inset 0 0 0 1px color-mix(in srgb, var(--accent) 45%, transparent), ` +
      `0 0 0 ${(12 * ring).toFixed(1)}px color-mix(in srgb, var(--accent) ${(70 * (1 - ring)).toFixed(0)}%, transparent)`;
  }
  inputText.textContent = txt;
  placeholder.style.display = (txt.length === 0 && !chipLive && !fileLive) ? '' : 'none';
  caret.style.opacity = (Math.floor(t * 2.6) % 2 === 0 ? 1 : 0.15).toFixed(2);
  caret.style.display = (txt.length > 0 || chipLive) ? '' : 'none';

  // — the send: an Enter keypress (the caret blink carries the beat) —
  const press = take2 ? SB_PRESS : PRESS_AT;

  // — the message area —
  const msgAt = take2 ? SB_MSG_AT : USER_MSG_AT;
  const thinkAt = take2 ? SB_THINK_AT : THINK_AT;
  const mp = t - msgAt;
  msgUser.innerHTML = take2
    ? `<span class="msg-chip">/superbot</span> ${Q2}`
    : `<span class="file-chip in-bubble"><svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M6 2.5h7l5 5V21a.9.9 0 01-.9.9H6a.9.9 0 01-.9-.9V3.4a.9.9 0 01.9-.9z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M13 2.8V8h4.7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg> ${FILE_NAME}</span> ${Q1}`;
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
  // take 1: the yes-man opener streams and holds.
  // take 2: the scrape log (one line per fetch, fast), then the verdict —
  // "No." punches, the rest streams, the companies land, the pivot, ideas.
  const emphActive = take2 && t >= EMPH_START && t < EMPH_END;
  const rsp = t - (take2 ? NO_AT : RESP_AT);
  if (rsp <= 0 && !(take2 && t >= SCRAPE_AT)) {
    msgAi.textContent = '';
    msgAi.style.opacity = '0';
    msgArea.scrollTop = 0;
  } else {
    msgAi.style.opacity = '1';
    if (take2) {
      // the scrape log, then it collapses the moment the verdict begins
      if (t < NO_AT) {
        const n = scrapeCount(t);
        msgAi.innerHTML = `<span class="scrape">` + SCRAPE_LINES.slice(0, n).map(([host, code, ms]) => {
          const ok = code === 200;
          const st = ok ? `<span class="ok">${code}</span>` : `<span class="blocked">${code} blocked</span>`;
          const dur = ms ? ` · <span class="ms">${ms}ms</span>` : '';
          return `<span class="sl">▸ GET <span class="host">${host}</span> … ${st}${dur}</span>`;
        }).join('') + `</span>`;
        msgArea.scrollTop = 1e6;                        // follow the descent
      } else {
        const emph = emphActive
          ? (t < EMPH_START + EMPH_IN ? easeOutQuint(inP(t - EMPH_START, EMPH_IN))
            : t < EMPH_START + EMPH_IN + EMPH_HOLD ? 1
            : 1 - easeInOutSine(inP(t - EMPH_START - EMPH_IN - EMPH_HOLD, EMPH_OUT)))
          : 0;
        const no = 'No.'.slice(0, Math.ceil(inP(t - NO_AT, NO_DUR) * 3));
        const rest = t < REST_AT ? '' : VERDICT_REST.slice(0, Math.ceil(inP(t - REST_AT, REST_DUR) * VERDICT_REST.length));
        let html = `<span class="sb-no">${esc(no)}</span><span class="sb-rest">${esc(rest)}</span>`;
        if (t >= COMPANIES_AT) {
          const k = Math.min(COMPANIES.length, Math.floor((t - COMPANIES_AT) / COMP_STEP) + 1);
          html += `<span class="comp-list">` + COMPANIES.slice(0, k)
            .map((c, i) => {
              const cp = inP(t - (COMPANIES_AT + i * COMP_STEP), 0.16);
              return `<div style="opacity:${cp.toFixed(2)};transform:translateX(${(6 * (1 - cp)).toFixed(1)}px)">· ${esc(c)}</div>`;
            }).join('') + `</span>`;
        }
        if (t >= PIVOT_AT) {
          const pv = PIVOT.slice(0, Math.ceil(inP(t - PIVOT_AT, PIVOT_DUR) * PIVOT.length));
          html += `<span class="sb-pivot">${esc(pv)}</span>`;
        }
        if (t >= IDEAS_AT) {
          const k = Math.min(IDEAS.length, Math.floor((t - IDEAS_AT) / IDEA_STEP) + 1);
          html += `<span class="idea-list">` + IDEAS.slice(0, k)
            .map((s, i) => {
              const ip = inP(t - (IDEAS_AT + i * IDEA_STEP), 0.22);
              return `<div style="opacity:${ip.toFixed(2)};transform:translateX(${(6 * (1 - ip)).toFixed(1)}px)">${esc(s)}</div>`;
            }).join('') + `</span>`;
        }
        msgAi.innerHTML = html;
        if (!emphActive) msgArea.scrollTop = t < SETTLE_END + 0.3 ? 1e6 : 0;
      }
    } else {
      msgAi.textContent = REPLY.slice(0, Math.ceil(inP(rsp, RESP_DUR) * REPLY.length));
      msgArea.scrollTop = 0;
    }
  }

  // — the punch-in on "No." (the solved-origin zoom from the favorite-color
  //   spot): a beat after "No." lands the camera punches ALL the way in —
  //   the word alone fills the frame at peak — holds, and relaxes —
  chat.style.transform = 'none';
  if (emphActive) {
    const e = t < EMPH_START + EMPH_IN ? easeOutQuint(inP(t - EMPH_START, EMPH_IN))
      : t < EMPH_START + EMPH_IN + EMPH_HOLD ? 1
      : 1 - easeInOutSine(inP(t - EMPH_START - EMPH_IN - EMPH_HOLD, EMPH_OUT));
    const no = document.querySelector('.sb-no');
    if (no) {
      const range = document.createRange();
      range.selectNodeContents(no);
      const ar = range.getBoundingClientRect(); // transform reset above: clean
      const cr = chat.getBoundingClientRect();
      const px = ar.left + ar.width / 2 - cr.left;
      const py = ar.top + ar.height / 2 - cr.top;
      const ox = (cr.width / 2 - EMPH_MAX * px) / (1 - EMPH_MAX);
      const oy = (cr.height / 2 - EMPH_MAX * py) / (1 - EMPH_MAX);
      chat.style.transformOrigin = `${ox.toFixed(1)}px ${oy.toFixed(1)}px`;
      chat.style.transform = `scale(${(1 + (EMPH_MAX - 1) * e).toFixed(4)})`;
      // the frame empties as the camera pushes — the composer and the bubble
      // fade so the punch-in path stays clean
      const dim = 1 - e;
      pill.style.opacity = dim.toFixed(3);
      msgUser.style.opacity = (parseFloat(msgUser.style.opacity || '1') * dim).toFixed(3);
    }
  } else {
    chat.style.transformOrigin = '';
  }
}

/* ---- the punch cards ---- */

function renderCards(t) {
  const simple = document.getElementById('simple');
  let card = null, since = -1;
  if (t >= CARDS_AT && t < CARDS_END) {
    const i = Math.floor((t - CARDS_AT) / CARD_LEN);
    card = CARDS[i]; since = t - (CARDS_AT + i * CARD_LEN);
  } else if (t >= CARD4_AT && t < CARD4_END) {
    card = 'STOP TOKENMAXXING.'; since = t - CARD4_AT;
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
