# Project.Management — Phase-wise Build Prompts

## The idea, and why it monetises

**Concept:** *Project.Management*, a free, no-signup project-management tool hub. It combines:
- interactive tools
- long-form guides
- templates
- certification help
- vendor-neutral software matching
- lead generation for consultants, software and hiring

**Why this idea wins on revenue:**
1. **High-CPC niche.** "Project management software", "PMP certification" and "project management course" sit in the premium SaaS, B2B and education ad verticals, which pay high CPCs for AdSense.
2. **Tools create return visits and long sessions.** A Gantt chart or risk register is opened every week. More page views per user means more ad impressions.
3. **Lead value.** Software, consulting and training leads can be sold or routed to partners. PM software affiliate programmes, where available, typically pay per sale or per qualified trial.
4. **Gap in the market.** Of the 42 sites audited, every vendor "free tool" ends in a signup (see RESEARCH.md). A polished, private, no-signup suite with exports has no strong competitor.

---

## Phase 1: Foundation & compliance
> Build a static, dependency-free website for the domain **Project.Management** that can be hosted on GitHub Pages (free plan, main branch, root folder). Use relative links everywhere so it works both on `username.github.io/project-management/` and on the custom domain.
>
> **Every page must include:**
> - The exact AdSense code in `<head>`: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>`
> - `<meta name="google-adsense-account" content="ca-pub-6620975821265271">`
> - Canonical URL, Open Graph tags and JSON-LD (WebSite, Organization, Article, WebApplication, FAQPage, BreadcrumbList).
> - A top bar: "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership", linking to https://web.works/contact.
>
> **Site files:** `ads.txt` (`google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`), `robots.txt`, `sitemap.xml`, an HTML sitemap, a `404.html` that works at any depth, a web manifest, a favicon, an OG image and `.nojekyll`.
>
> **Legal pages:** Privacy (with Google's third-party cookie disclosure, opt-out links and the partner-sites link), Cookies, Terms, Disclaimer/Advertising disclosure, and Trademark & Copyright. The trademark notice states non-affiliation with ProjectManagement.com, PMI, PeopleCert/AXELOS, Scrum.org, Scrum Alliance and all software vendors.
>
> **Contact and forms:** The owner's single contact inbox (supplied privately to the builder) must never appear in HTML, JS strings or anywhere in source. Store it XOR-encoded and reversed, assemble it only at submit or click time, and send forms via FormSubmit's AJAX endpoint. Every form gets a honeypot field and a consent checkbox.

## Phase 2: Design system & shell
> Create one CSS design system:
> - **Visual style:** light/dark themes (respecting `prefers-color-scheme`, with a toggle saved to local storage) and a brand blue/teal/amber palette.
> - **Components:** cards, pills, KPIs, forms, choice tiles, multi-step indicators, tables, a sticky header and a mega-menu (Tools, Learn, Templates, Software, Certifications, Videos, More).
> - **Mobile:** a slide-down menu.
> - **Global UI:** a Ctrl+K site search over a generated JSON index, a cookie banner, a dismissible sticky "Free project consultation" CTA, a toolkit lead-magnet modal, a newsletter form in the footer and a print stylesheet.
> - **Accessibility:** WCAG AA — skip link, focus rings, labelled inputs, aria-live form messages.
>
> Use a small Python generator (`build.py`) to wrap page fragments in the shared layout. It also builds the search index and sitemaps.

## Phase 3: Twelve interactive tools (vanilla JS, local storage, CSV export, print to PDF)
> 1. **Gantt chart maker:** finish-to-start dependencies with auto-scheduling, milestones, % progress, a today line, CSV import/export.
> 2. **Kanban board:** drag and drop with mobile arrow buttons, WIP limits with an over-limit warning, priorities, owners, due dates.
> 3. **Critical path calculator:** topological sort, forward and backward pass, ES/EF/LS/LF, total and free float, multiple critical paths, cycle detection, float bars.
> 4. **PERT estimator:** E and σ per task, project totals, 68/95/99.7% ranges, probability of hitting a target (normal CDF), 90% commit figure.
> 5. **Earned value calculator:** CV, SV, CPI, SPI, three EAC methods, ETC, VAC, TCPI, plus a plain-English verdict.
> 6. **Risk register:** 5×5 heatmap, scoring bands, response strategies, sort by score.
> 7. **RACI generator:** click-to-cycle cells; a validator flags missing or duplicate A, missing R and overload.
> 8. **Project charter generator:** live preview; export to Word (.doc), TXT and PDF; worked example.
> 9. **Stakeholder power/interest map:** sliders, live grid and an engagement plan.
> 10. **Sprint capacity planner:** focus factor, ceremonies, time off, velocity history, release forecast.
> 11. **Meeting cost calculator:** annual cost plus a live meter.
> 12. **Methodology quiz:** eight weighted questions with a scored result. The result links to the matching guide and tool, and offers a lead CTA.
>
> Each tool page carries 300+ words of original how-to content and an FAQ with FAQPage schema.

## Phase 4: Content for AdSense approval and SEO
> **Thirteen original guides**, each 800–1,500 words with a TOC, key-takeaway boxes, tables, worked examples, internal links to tools, and Article schema:
> - What is PM
> - Life cycle
> - Agile
> - Scrum
> - Kanban
> - Waterfall
> - Agile vs Waterfall vs Hybrid
> - WBS
> - Critical path
> - Risk
> - Stakeholders
> - Earned value
> - Project charter
>
> **Other content pages:**
> - **Learn hub:** a learning path through the guides.
> - **Glossary:** 150+ searchable A–Z terms.
> - **Templates:** 12 templates generated client-side as CSV, with formulas where useful.
> - **Certifications:** comparison of 9 credentials, PMP/CAPM eligibility checker, study plan.
> - **Software:** comparison of 12 tools plus a transparent weighted matcher, with an affiliate-ready "sponsored" rel.
> - **Video library:** 20 oEmbed-verified YouTube videos, lazy-loaded in privacy-enhanced mode, with topic filters.

## Phase 5: Monetisation & conversion
> - **Lead generation (`get-help.html`):** a three-step qualifying form covering need, team size, industry, budget, timeline, methodology, details and contact, plus consent. Prefill it from query strings sent by the quiz, matcher and certification pages.
> - **Repeated conversion points:** quick-lead form on the homepage, sticky CTA, toolkit modal (lead magnet that unlocks a section), newsletter, and CTAs inside guides and tools.
> - **Support page:** one-time or monthly giving, three tiers, choice of where funds go (operations, tools, prizes, hiring, promotion), and "secure payment link" fulfilment. Never collect card data in a form.
> - **Advertise page:** six sponsorship packages, a media-kit request form, editorial standards, and the web.works acquisition notice.
> - **Contests page:** monthly skill-based challenge, judging criteria, prizes, entry form, official rules (18+, no purchase necessary).
> - **Careers page:** career guide, six open roles, talent-pool application form.
> - **About and Contact:** About with editorial standards and funding model; Contact with a topic selector and a click-to-email link that never exposes the address.

## Phase 6: QA, deploy, grow
> **QA:**
> - Run Playwright across every page and check for JS errors, mobile overflow at 375px and broken links/anchors.
> - Grep the source to confirm the email never appears.
> - Intercept form submissions to confirm the endpoint and payload.
>
> **Deploy:**
> 1. Push to `WEBWORKSA1/project-management` on `main`.
> 2. Enable Pages (Settings → Pages → Deploy from branch → main / root).
> 3. Point the domain: add a `CNAME` file containing `project.management`, set apex A records to GitHub's Pages IPs and a `www` CNAME record, then tick "Enforce HTTPS".
> 4. Submit `sitemap.xml` to Google Search Console.
> 5. Activate FormSubmit by clicking the link in the first submission email.
> 6. Apply for AdSense once the custom domain resolves.
>
> **Growth backlog:**
> - PMP practice-question bank
> - Interactive salary explorer
> - Burndown/CFD tool
> - Resource-levelling tool
> - AI status-report writer
> - Translations (ES, FR, DE, PT, HI)
> - Software "X vs Y" and "alternatives" pages
> - Weekly newsletter archive
