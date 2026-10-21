# Time To Shine Graphics

A complete local website implementation using HTML5, CSS3 and vanilla JavaScript, with a separate Express backend. Includes 16 public pages plus an admin page, a configurable catalogue, simple WhatsApp quote/contact enquiries, artwork uploads, FAQ accordions and an inspiration lightbox.

## Run locally

Requires Node.js 22 or later.

```sh
npm ci
cp .env.example .env
npm run dev
```

Open **http://localhost:4173**. The project intentionally uses port 4173 to avoid other local projects. If changing the port, also change `PUBLIC_ORIGIN` to match the exact browser origin.

The contact and quote pages now use WhatsApp click-to-chat at the owner-confirmed number **+91 9999777681**. They do not POST to the backend or create admin records. The customer fills in one short form, clicks Continue to WhatsApp, then taps Send in WhatsApp. Details use headings and line breaks; artwork must be attached in the chat. An Open WhatsApp again link is shown if the initial new tab does not open. No delivery success is claimed. The recipient is configured in `public/js/whatsapp.js`. See [WhatsApp click-to-chat documentation](https://faq.whatsapp.com/5913398998672934).

Separate artwork-upload submissions and direct API submissions are saved to `server/private/data.json`; artwork is saved to `server/private/artwork/`. These paths are ignored by Git and never served by Express. This is a real local submission workflow, not a simulated success message. No emails are automatically sent: staff review requests in the admin dashboard and contact customers directly.

## Admin setup

```sh
node scripts/admin-password.js
```

Enter a password of at least 12 characters in the terminal. Input is hidden. Copy the printed salted `ADMIN_PASSWORD_HASH` into `.env`, restart the server, and visit **/admin.html**. No default password exists.

The dashboard supports request review, private artwork downloads, status updates and internal notes. Its catalogue JSON editor supports adding/updating/archiving services, local image paths, FAQ question-answer pairs, portfolio entries and contact settings. This is a technical content editor, not a drag-and-drop CMS.

Service objects use `id`, `name`, `category`, `headline`, `description`, `details`, `url`, `image`, `status`, and optionally `number`. Use `service-details.html?service=your-id` for a new category. Status is `proposed`, `available` or `archived`. Assets must exist under `public/assets/`. Portfolio entries use `{ "title": "...", "image": "/assets/example.jpg" }`; only upload photos you have approval to use. Settings accept `phone`, `email` and `address`.

Admin authentication is server-side, with HttpOnly SameSite cookies, eight-hour expiry, an admin role check, CSRF tokens for mutations and a sign-in rate limit. Sessions are in memory and are invalidated on restart. Deploy a single process; use a shared session store before horizontal scaling. Administrator identities are currently configured by environment, not the optional users table.

## Production deployment

1. Complete the business approval list below, approve legal wording and review the prepared logo asset. The supplied logo reference is now used in the header and footer as `public/assets/time-to-shine-logo.png`; a source SVG or original high-resolution logo can replace this prepared raster asset.
2. Provision PostgreSQL and a private persistent disk for artwork. Set `DATABASE_URL` using the database provider's TLS settings; do not disable certificate verification. A Supabase PostgreSQL connection URL can be used server-side. Never expose the connection string to visitors.
3. Run `npm run migrate` to apply `server/migrations/001_initial.sql`. Run as the intended application table owner, then restrict runtime database permissions appropriately. The migration is idempotent and revokes PUBLIC table access. It has not been executed against a live database in this workspace.
4. Set `NODE_ENV=production`, `PUBLIC_ORIGIN=https://your-approved-domain`, `ADMIN_PASSWORD_HASH`, `PORT`, and an absolute `DATA_DIR` outside `public/`. Production refuses to start without PostgreSQL, an admin hash and an HTTPS origin.
5. Use a Node host or Linux service with an HTTPS reverse proxy to the loopback Express listener. Configure the proxy body limit to at least 11 MB. Set up restart supervision, backups of the database and private artwork volume, monitoring and a retention/deletion process. The current rate limit uses the direct peer IP; proxy deployments should configure a verified trusted proxy topology before enabling per-client forwarding.
6. Mark only owner-approved services `available` in the admin catalogue. Production API hides proposed and archived categories. Review all promotional copy before public exposure.
7. Set `SITE_URL=https://your-approved-domain` and run `BUSINESS_APPROVED=yes node --env-file=.env scripts/prepare-seo.js`. This generates canonical URLs, Open Graph URLs and a real sitemap, and removes development noindex tags. Until approval, robots.txt intentionally blocks indexing and sitemap.xml is empty. Do not invent a domain.
8. Run `npm run check` and `npm test`. Complete the manual browser checklist in `TESTING.md` against the final deployment.

The Express backend requires Node hosting; a static-only host cannot process these forms. Sites/Cloudflare Worker publication is not used because the requested Express/PostgreSQL architecture and unapproved business content are retained locally.

### Storage model

Production actively uses `quotation_requests` for all three enquiry kinds, `site_settings` for the versioned catalogue document and `admin_audit_logs`. Customer details, specifications and safe file metadata are stored as JSONB; file bytes stay on the private disk. The migration also supplies normalized tables for users, roles, categories, services, images, quotation items, artwork metadata, enquiries, portfolio and FAQs for a future CMS expansion. Those supplementary tables are not synchronized by the current document-based catalogue adapter. Development JSON is for local review only and does not migrate automatically to PostgreSQL.

### Upload handling

One file per request, 10 MB maximum. PNG/JPEG/PDF extension and binary signature checks run on the server, regardless of browser MIME. Files use UUID storage names, private filesystem permissions and authenticated attachment-only downloads. They are not rendered in the admin UI. The application does not claim to sanitize PDF contents or perform malware scanning. Add a scanner/quarantine workflow if required by the production artwork review environment. SVG, AI and EPS are deliberately disabled. No public or unauthenticated download endpoint exists.

## Business details still requiring confirmation

- A logo reference has been supplied and prepared for the header/footer. Original SVG or high-resolution artwork can replace the prepared raster for exact source fidelity.
- Available services: every supplied category remains proposed by default.
- Materials, print methods, quantities, dimensions, garment sourcing and transfer-only options.
- Accepted production artwork formats, resolution, bleed and colour specifications. PNG/JPEG/PDF are configured for initial enquiry intake only.
- Prices, payment terms, cancellations, refunds, turnaround, collection/delivery and opening hours.
- Official social profiles remain unconfirmed. WhatsApp number 9999777681 was confirmed by the owner and is enabled for quote/contact enquiries.
- Genuine project photos and permission to publish them; no invented testimonials are present.
- Legal policy wording, retention periods, hosting/data processor choices and contact procedures.
- GSTIN against original registration documents. It is intentionally omitted from public legal content.
- Production domain, PostgreSQL credentials, persistent storage and admin password.

## Assets

`public/assets/studio.png` and `public/assets/products.png` are generated illustrative mockups created with the built-in imagegen tool. They are not the business's actual premises or finished customer projects. Prompts are recorded in `ASSETS.md`. The six service images use CSS framing of the product contact sheet. Font loading uses Google Fonts with system fallbacks.

## Checks

`npm run check` validates JavaScript syntax and HTML asset references. `npm test` covers input rules, catalogue URL constraints, file validation, real local request persistence, admin login, CSRF protection, cross-origin rejection, binary-signature rejection and authorized private downloads. Browser verification and production-specific limits are recorded in `TESTING.md`.

## Additional enquiry services

The 60 owner-supplied category names live in `public/js/service-options.js`. They appear in one compact picker on Services and in the Contact and Quote dropdowns, without creating extra service cards. Services-to-Contact links preselect the category; both WhatsApp message formats include the selected service. These enquiry choices are independent of the nine detailed catalogue cards.
