/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Gigamon section breaks and section-metadata.
 * Runs in afterTransform only. Uses payload.template.sections
 * to insert <hr> section breaks and section-metadata blocks.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== H.after) return;

  const { document } = payload;
  const sections = payload.template && payload.template.sections;
  if (!sections || sections.length < 2) return;

  // Process sections in reverse order so DOM insertions don't shift positions
  const reversedSections = [...sections].reverse();

  for (const section of reversedSections) {
    // Find the first element matching the section selector
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    let sectionEl = null;
    for (const sel of selectors) {
      sectionEl = element.querySelector(sel);
      if (sectionEl) break;
    }

    if (!sectionEl) continue;

    // Add section-metadata block if section has a style
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      sectionEl.after(metaBlock);
    }

    // Add <hr> section break before this section (skip first section)
    if (section.id !== 'section-1') {
      const hr = document.createElement('hr');
      sectionEl.before(hr);
    }
  }
}
