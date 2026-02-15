# Local development

## Option 1: Local content (recommended when AEM returns 404)

Use the `content` folder so the site runs without calling AEM. Your blocks, styles, and scripts load from the repo; only the page HTML comes from the `content` folder.

1. From the project root, run:
   ```bash
   aem up --html-folder content
   ```
2. Open **http://localhost:3000/** or **http://localhost:3000/index** in your browser.

The repo includes a minimal **`content/index.html`** so the home page works. You can add more pages, e.g. `content/about.html` → **http://localhost:3000/about**. Edit any `.js` or `.css` in `blocks/` and refresh to see changes.

---

## Option 2: Content from AEM (path mapping)

When you run **`aem up`** (without `--html-folder`), the server fetches HTML from the URL in **`fstab.yaml`** (your AEM Cloud Service author instance). Path mapping is **not** configured in this repo; it is configured in **AEM**.

### Where path mapping is set

- In **AEM Cloud Service**, path mapping is usually under:
  - **Sites** → your site (e.g. “gigamon”) → **Configuration** (or the site’s Edge Delivery / Franklin configuration), or  
  - A **sites configuration** that defines:
    - **Internal path** (author): e.g. `/content/gigamon`
    - **External path** (public/delivery): e.g. `/` so that the index page is at `/` or `/index`

- A typical mapping for your structure would be:
  - **Internal (AEM):** `/content/gigamon/`
  - **External (site):** `/`

So:

- `/content/gigamon/index` → **/** or **/index**
- `/content/gigamon/footer` → **/footer** (if needed for fragments)
- `/content/gigamon/nav` (header) → **/nav** (if needed)

Until this mapping is correct and the delivery endpoint returns 200 for the requested path, **`aem up`** (without `--html-folder`) can return 404. Using **`aem up --html-folder content`** avoids that and lets you develop with local content.

### Publish status

If the delivery endpoint only serves **published** content, ensure the **Index** (and any other) page is **published** in AEM (e.g. **Quick Publish** from the Sites console). If you are using the **author** URL in `fstab.yaml`, unpublished content may still be served depending on your AEM setup.

---

## Summary

| Goal                         | Command                     | URL to open              |
|-----------------------------|-----------------------------|---------------------------|
| Develop with local content  | `aem up --html-folder content` | http://localhost:3000/    |
| Develop with AEM content    | `aem up`                    | Depends on path mapping (e.g. `/` or `/index`) |

For day-to-day block and style work, **`aem up --html-folder content`** is the most reliable.
