# News Autopilot

Automatically scrapes the most viral/recent news from the best available sources,
rewrites it into a complete, polished **English** article with an AI editor,
attaches a real image, and publishes it on a schedule — never repeating a story
we've already covered.

By default each category publishes **1 article/day, occasionally 2**, at **random
times** within a daily window (8 categories → ~8–16 posts/day). All of this is
configurable.

It is a Node port of the Python pipeline at `../../Lokmangal`.

## Flow (per article)

```
gather candidates        Serper (if key) + InShorts + site scrapers (TOI/HT/India Today)
  → relevance filter      OpenAI: is this worth publishing now? (on titles — cheap)
  → freshness             drop stale; date-less candidates hydrate their article page
  → prefer image-rich      keep candidates whose image is actually available
  → pick best (+verify)   OpenAI: choose freshest/most clickable; reject thin bodies, retry
  → image guard           reject any image with a watermark / publication logo /
                          channel bug / agency credit (OpenAI vision); try next image
  → enrich                fetch the FULL publisher article + a verified, CLEAN og:image
  → rewrite               OpenAI: complete English article (who/what/when/where/why)
  → content guard         reject copy still carrying source attribution (TOI/PTI/©/…)
  → publish               insert via the News model, attributed to the site user
  → record                save sourceId so it's never reused
```

Every pick must clear **all** gates (body, image, content). If a pick fails the
image or content guard it is dropped and the next-best is tried; if nothing in a
category clears every gate, that category publishes nothing this run rather than
risk a copyright issue.

All sources expose real publisher article URLs, so every candidate yields a full
body (via JSON-LD `articleBody` / article markup) and a real image. Google News
RSS is intentionally **not** used — its redirect links hide both.

Dedup is stored in the `AutopilotSource` MongoDB collection.

## Schedule

A daily **planner** (`scheduler.js`) decides, per category, how many articles to
publish today (`min`, plus one more with probability `extraChance`, up to `max`)
and schedules each at a **random time** inside `[DAY_START, DAY_END]` (editorial
timezone). It re-plans at 00:05 each day and on startup.

It is **restart-safe**: the per-day target is deterministic per (day, category)
and only the not-yet-published remainder is scheduled, so restarts never exceed
the cap. Publishes are run through a single-flight queue so they never overlap.
The scheduler auto-starts from `server.js` when `AUTOPILOT_ENABLED=true`.

## Configuration (.env)

| Var | Default | Meaning |
| --- | --- | --- |
| `AUTOPILOT_ENABLED` | `false` | Master on/off for the scheduler |
| `AUTOPILOT_DRY_RUN` | `false` | Scrape + rewrite but do NOT write to the DB |
| `OPENAI_API_KEY` | – | Required. Used for relevance/selection/rewrite/image-guard |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model |
| `OPENAI_VISION_MODEL` | = `OPENAI_MODEL` | Vision model for the image guard (gpt-4o-mini has vision) |
| `SERPER_API_KEY` | – | Optional. Enables Serper (best source + real images for every category) |
| `AUTOPILOT_AUTHOR_USERNAME` | – | Site user to attribute posts to (falls back to any admin) |
| `AUTOPILOT_TIMEZONE` | `Asia/Kolkata` | Editorial + scheduling timezone |
| `AUTOPILOT_MIN_PER_CATEGORY` | `1` | Articles per category per day (minimum) |
| `AUTOPILOT_MAX_PER_CATEGORY` | `2` | Articles per category per day (maximum) |
| `AUTOPILOT_EXTRA_CHANCE` | `0.35` | Probability of going above min toward max (the "sometimes 2") |
| `AUTOPILOT_DAY_START` | `08:00` | Start of the random publishing window |
| `AUTOPILOT_DAY_END` | `22:00` | End of the random publishing window |
| `AUTOPILOT_ONLY_TODAY` | `false` | `true` = strict same-day only (can be too rigid) |
| `AUTOPILOT_MAX_AGE_DAYS` | `2` | Rolling recency window when `ONLY_TODAY=false` (per-category caps also apply); selection always prefers the freshest |
| `AUTOPILOT_PER_SOURCE_LIMIT` | `15` | Max candidates pulled per source/query |
| `AUTOPILOT_DEFAULT_IMAGE` | Brand logo | Fallback featured image when no clean, on-topic photo is found |
| `AUTOPILOT_IMAGE_GUARD` | `true` | Vision check rejecting branded, off-topic or indecent images |
| `AUTOPILOT_IMAGE_GUARD_FAIL_OPEN` | `false` | `true` = allow images that can't be *verified* (download/API error). Default fails closed |
| `AUTOPILOT_BLOCK_PUBLISHER_CDN` | `false` | `true` = hard-reject any image hot-linked from a publisher/agency/stock CDN (strictest, no-hotlink posture) |
| `AUTOPILOT_CONTENT_GUARD` | `true` | Reject rewritten copy still carrying source attribution |
| `AUTOPILOT_VISION_DETAIL` | `high` | Vision detail for the image guard. `low` = flat ~85 tokens/image (cheapest), `high` = most accurate |
| `AUTOPILOT_BUDGET_ENABLED` | `true` | Hard daily OpenAI spend cap (calls + tokens) |
| `AUTOPILOT_MAX_DAILY_CALLS` | `500` | Max OpenAI API calls per day (`0` = unlimited) |
| `AUTOPILOT_MAX_DAILY_TOKENS` | `2000000` | Max OpenAI tokens per day (`0` = unlimited) |

Examples:
- 2 per category every day: `MIN=2 MAX=2`.
- mostly 1, rarely 3: `MIN=1 MAX=3 EXTRA_CHANCE=0.2`.

## Sources

All scraping goes through a **human-like HTTP client** (`sources/common.js`):
rotating real desktop browser User-Agents, full browser headers (`sec-ch-ua`,
`Accept-Language`, `Referer`, …), retries with backoff and jittered delays — so
scraping the big sites is reliable and rarely blocked.

| Source | Needs key | Images | Coverage |
| --- | --- | --- | --- |
| **Serper** (`google.serper.dev`) | `SERPER_API_KEY` | real (direct) | every category — optional extra |
| **InShorts** top_stories | no | real (direct) | देश, दुनिया, राजनीति, खेल, मनोरंजन, अपराध |
| **Times of India** sections | no | real (og:image / JSON-LD) | **all categories** incl. crime, MP, cities |
| **Hindustan Times** sections | no | real (og:image / JSON-LD) | **all categories** incl. crime, MP, cities |
| **India Today** sections | no | real (og:image) | देश, दुनिया, राजनीति, खेल, मनोरंजन |

Sites are configured in `sources/siteScraper.js` (a `SITES` array: per-category
section URLs + an article-URL regex). Add a publisher by adding an entry there.

## Manual runs

```bash
npm run autopilot:dry              # one article per category, NO DB writes
npm run autopilot                  # one article per category, publishes live
node backend/automation/run.js --category खेल            # single category (live)
node backend/automation/run.js --category खेल --dry-run  # single category, dry
```

## Article quality

The rewriter is fed the **full original publisher article** (not just a short
digest) and is prompted to produce a complete 6–10 paragraph story covering the
who / what / when / where / why with specific names, dates, numbers and quotes —
while being explicitly forbidden from inventing facts not in the source.

## Compliance guards (copyright safety)

To avoid republishing third-party material (e.g. a Times of India photo with a
visible "TOI" logo), every pick passes two compliance gates before publishing.
Both **fail closed** — when in doubt, the article is dropped.

1. **Image guard** (`imageGuard.js`) — for each candidate image we:
   - run a **domain reputation** check (publisher/agency/stock CDN). It's a logged
     flag by default; set `AUTOPILOT_BLOCK_PUBLISHER_CDN=true` to hard-reject hot-links.
   - download the bytes and run an **OpenAI vision** pass that rejects any visible
     publication watermark, masthead/logo, TV-channel bug, news-agency or stock
     credit (PTI/ANI/Reuters/AFP/Getty/Shutterstock…), burned-in URL/©/handle, or
     screenshot of another site.
   The candidate's own image is tried first, then the article's og:image. If none
   is clean, the article is dropped (no watermarked image is ever published, and no
   silent fallback to a generic banner).
2. **Content guard** (`contentGuard.js`) — a fast text scan of the rewritten
   headline/dek/body/hashtags that rejects leftover source attribution: publisher
   names, agency credits, "read more"/"also read" boilerplate, `Source:`/`Courtesy:`,
   © marks and stray social handles.

Tune with `AUTOPILOT_IMAGE_GUARD`, `AUTOPILOT_IMAGE_GUARD_FAIL_OPEN`,
`AUTOPILOT_BLOCK_PUBLISHER_CDN`, `AUTOPILOT_CONTENT_GUARD` and `OPENAI_VISION_MODEL`.

## Spend cap (no surprise OpenAI bill)

Every OpenAI request — relevance, selection, rewrite **and** the image-guard
vision pass — goes through one budget-guarded client (`openaiClient.js` →
`budget.js`). Before each call it checks a **hard daily ceiling** on both API
calls and tokens; once either cap is hit, the current wave stops and the
autopilot publishes nothing more until the next editorial day. Actual token usage
is read from each API response, and the running daily total is **persisted in
MongoDB** (`AutopilotUsage`, one doc/day) so a crash-loop or restart can't reset
the counter and blow past the cap.

- Defaults: `500` calls/day and `2,000,000` tokens/day on `gpt-4o-mini` — far
  above a normal day (~100 calls) but a firm backstop against a runaway loop.
- Tune via `AUTOPILOT_MAX_DAILY_CALLS` / `AUTOPILOT_MAX_DAILY_TOKENS` (set `0` to
  disable a limit), or turn the whole cap off with `AUTOPILOT_BUDGET_ENABLED=false`.
- Cut per-image vision cost with `AUTOPILOT_VISION_DETAIL=low`.
- Each wave logs `OpenAI usage today: <calls>/<cap> calls, <tokens>/<cap> tokens`.

## Notes & limitations

- **Images:** every published image is HEAD-verified to actually load and be an
  image, **and** must clear the image guard above. There is no longer a silent
  fallback to the default banner — an uncleared category simply publishes nothing.
- **No thin articles:** a pick is rejected (and the next-best tried) unless its
  real article body is at least ~250 chars, so the rewrite always has full material.
- **Cost:** each published article ≈ 3 OpenAI text calls (relevance, selection,
  rewrite) + ~1–2 vision calls (image guard) on `gpt-4o-mini` — still a few
  cents/day at this volume. The content guard is free (local regex).
- For 24/7 operation run the server under a process manager (e.g. `pm2`); the
  scheduler lives in-process and re-plans daily.
- The site stores titles as `<h1><strong>…</strong></h1>`; the rewriter matches that.
