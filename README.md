# traestanley.com

Personal site of Trae Stanley: essays and notes on making video that people trust, with work produced at [Audion](https://www.audion.energy).

The site is plain HTML, CSS and JavaScript, with no build step. GitHub Pages publishes this branch (`traestanley.com`) to https://traestanley.com.

## Where things live

| File | What it holds |
| --- | --- |
| `index.html` | The page itself: menu bar, monitor, inspector, timeline, summary and footer |
| `assets/content.js` | **All the content.** Every essay, note, project and section is one entry in `CLIPS` |
| `assets/site.js` | How the edit suite behaves (timeline, playhead, tour, keyboard) |
| `assets/site.css` | Colors, type and layout |
| `assets/img/` | Project stills, the favicon and `og.jpg` (the preview image shown when the link is shared) |
| `CNAME` | Tells GitHub Pages to serve the site at traestanley.com |

## Common changes

- **Publish an essay:** add its page (for example `essays/polish-is-out/index.html`), then in `assets/content.js` remove `soon:true` from that essay and add `url:"essays/polish-is-out/"`.
- **Add a note:** copy a `note` entry in `assets/content.js`, give it a new `id`, a free `start` time on track `A1`, and new text.
- **Add a project:** copy a `film` entry (track `V2`), put a 16:9 still in `assets/img/`, and add it to `IMG` at the top of `content.js`.

The timeline is two minutes long (`LEN = 120`). `start` and `dur` are in seconds, and each entry should sit in a free spot on its track.
