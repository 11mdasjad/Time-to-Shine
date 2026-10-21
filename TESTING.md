# Verification

## Automated

The automated suite includes the WhatsApp form update. Syntax and static document checks passed for all 17 pages.

- DOM rendering for all 16 public pages, internal links, combined catalogue filters, empty states, WhatsApp form validation, formatted messages, recipient, Unicode encoding and retry links, mobile menu and Escape state.

- JavaScript syntax and static HTML references across 17 pages.
- Required quote data, whole-number quantity bounds, email/phone and consent checks.
- Oversized fields and malformed objects rejected.
- Catalogue rejects script URLs, remote asset paths, duplicate IDs and invalid statuses.
- Client-side file type/size checks.
- API integration: request saved with a unique reference; valid image upload saved and downloadable only by admin.
- Spoofed PNG content rejected.
- Anonymous admin access rejected; authenticated status update succeeds only with CSRF token.
- Foreign Origin requests rejected; private storage is not publicly served.
- Tests use isolated temporary storage, never real customer data.

## Manual browser checklist

Desktop browser preview was attempted, but the computer-use capture service failed during navigation. An automatic approval review then blocked inspecting the browser because it could still contain an unrelated page. No visual or device-width pass is claimed.

Check before release at 360, 390, 768, 1024 and 1440 CSS pixels:

- No horizontal page overflow; cards, header, forms and footer remain readable.
- Mobile menu toggles, updates expanded state and closes on Escape; all links work by keyboard.
- Search + category filters combine; empty results are understandable.
- Correct service is preselected from each enquiry link.
- Contact/quote: missing required values block WhatsApp navigation; the correct recipient and structured message appear; tap Send manually. No admin submission is created.
- Artwork browse/drop/removal, unsupported file, oversize file and retry states.
- Artwork upload success appears only after a 201 response with a reference; WhatsApp forms never claim delivery.
- Actual transfer progress appears while uploading; a failed upload does not show success.
- FAQ toggles and lightbox close button/Escape return control to the page.
- Admin: login, logout, status changes, notes, catalogue edits, private downloads.
- Real PostgreSQL migration, persistence across restarts, database failure, backup restoration and disk permissions.
- Production-only approved services and final approved legal copy.
- Exact HTTPS origin, cookies, reverse proxy handling and production domain metadata.

No live database, production email integration, public hosting or physical-device testing was configured.
