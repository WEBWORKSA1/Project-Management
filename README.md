# Project.Management

Free, no-signup project management tools, templates and guides. A static site hosted on GitHub Pages from the `main` branch root.

- **Live (GitHub Pages):** https://webworksa1.github.io/Project-Management/
- **Domain:** project.management (see "Custom domain" below)
- **Interested in this website, the domain, sponsorship, advertising or partnership?** https://web.works/contact

## What's inside
- **12 browser tools** in `tools/`: Gantt, Kanban, critical path, PERT, earned value, risk matrix, RACI, project charter, stakeholder map, sprint capacity, meeting cost and a methodology quiz.
- **13 guides** in `learn/`, plus a 170-term glossary, 12 CSV templates, a software matcher, a certification comparison with an eligibility checker, and a 20-video library.
- **Monetisation:** Google AdSense (`ca-pub-6620975821265271`, with `ads.txt`), a multi-step lead form (`get-help.html`), a toolkit lead magnet, newsletter, support/donations, advertising packages, a monthly contest, and careers with a talent pool.
- **Privacy:** tool data stays in the visitor's browser. Forms post through FormSubmit to an inbox address that never appears in the source.
- **Compliance:** privacy, cookie, terms, disclaimer and trademark/copyright pages. Schema.org markup, sitemaps and robots.txt.

## Editing
Every page is plain static HTML, so you can edit any `.html` file directly. Shared parts live in `assets/`:
- `assets/css/style.css` holds the design system.
- `assets/js/main.js` holds the menus, footer columns, modals, forms and search.
- `assets/js/tools/` holds one script per tool.

The original generator (`build.py` plus page fragments) is kept outside the repo and can be added later for bulk edits.

## Go-live checklist
1. **GitHub Pages:** Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)` → Save. The site then appears at https://webworksa1.github.io/Project-Management/
2. **FormSubmit:** the first form submission sends an activation email to the site inbox. Click **Activate** once.
3. **Custom domain:**
   - Add a `CNAME` file containing `project.management`.
   - At the registrar, set A records for `@` to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
   - Set a CNAME record for `www` pointing to `webworksa1.github.io`.
   - Then tick **Enforce HTTPS**.
4. **Google Search Console:** verify the domain and submit `https://project.management/sitemap.xml`.
5. **AdSense:** add the site `project.management` in AdSense; `ads.txt` is already in place.

## Research
See `RESEARCH.md` for the 42-site competitive audit, and `BUILD-PROMPTS.md` for the phase-wise build specification.

## Trademark notice
Project.Management is independent and not affiliated with ProjectManagement.com, PMI, PeopleCert/AXELOS, Scrum.org, Scrum Alliance or any software vendor. All third-party marks belong to their owners. See `trademark.html`.
