# superbot-yes-man

superbot.gg advertisement — "ChatGPT is a Yes Man". A chatgpt-like frontend,
deterministic and seekable, rendered live in a 16:9 frame:

1. the user attaches `proposal.pdf` via the `+`, types **"Is this a good
   business idea?"** and hits enter; the llm gushes *"Yes that looks amazing!
   I say ship it! You can use chatgpt ads to release!"*
2. hard-cut punch cards: **STOP BURNING TOKENS** → **ChatGPT is a Yes Man** →
   **You like that, don't you**
3. the bar takes `/superbot Is this business idea good?` — superbot scrapes
   aggressively across the web (fast mono log, one line per fetch), then:
   **"No.** There is no novelty in the concept, here are 10 other large
   companies doing the same. Your frontend design is visibly vibe coded, and
   you have no sales." — the camera punches in on the word — then *"I
   recommend you pivot entirely, and collect a large dataset of objective
   a:b tested ad campaigns, here are some ideas."*
4. **STOP TOKENMAXXING.** → the superbot.gg end card (mascot + wordmark,
   laugh cycle)

## Render

Any static server (`npx serve` or `python3 -m http.server`). Every frame is
computed from `t`:

- `?t=SECONDS` — freeze-frame at that second; ←/→ step ±0.25s
- `?emph=6&hold=1.0` — punch-in depth and hold (see `variants.html`)

## Record

The **Record** button plays the loop once from frame one while the tab is
captured (Screen Capture API) and downloads a 1920×1080 webm.
