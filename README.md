# superbot-yes-man

superbot.gg advertisement — "ChatGPT is a Yes Man". A chatgpt-like frontend,
deterministic and seekable, rendered live in a 16:9 frame:

1. the user links `mywebsite.com` via the `+`, types **"Does my website look
   good?"** and hits enter; the llm gushes *"Yes that looks amazing wow! I
   think you really have something special here You should advertise it!"* —
   then a glazing tirade that keeps accelerating and never stops
2. hard-cut punch cards: **LLMs are Yes Men** → (a deliberate beat) →
   **AND YOU LIKE THAT?**
3. the bar takes `/superbot Does my website look good?` — superbot scrapes
   aggressively across the web and audits, then: **"No.** Your business
   lacks novelty, has no monetization, and is burning $50 a month to hold
   the domain." — the camera punches in on each fragment in turn — then
   *"I recommend you aggressively take market share from a competing
   company — attack ads, framed properly: public side-by-side comparisons,
   their numbers next to yours."* and attaches **3 ad campaigns** — the
   family's own spots looping as mini scenes inside their cards
4. the cursor glides in, about to click campaign 03 — hard cut: **WE LIKE
   WINNING** → the superbot.gg end card (mascot + wordmark, laugh cycle)

## Render

Any static server (`npx serve` or `python3 -m http.server`). Every frame is
computed from `t`:

- `?t=SECONDS` — freeze-frame at that second; ←/→ step ±0.25s
- `?emph=6&hold=1.0` — punch-in depth and hold (see `variants.html`)

## Record

The **Record** button plays the loop once from frame one while the tab is
captured (Screen Capture API) and downloads a 1920×1080 webm.
