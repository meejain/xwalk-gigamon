/* eslint-disable */
/* global WebImporter */
/** Parser: tabs-features. Base: tabs. Source: gigamon.com */
export default function parse(element, { document }) {
  const tabLabels = element.querySelectorAll('ul.nav-tabs li.arrow a.white-tab');
  const tabPanes = element.querySelectorAll('.tab-pane');
  const cells = [];

  tabLabels.forEach((label, i) => {
    // Clone and remove SVG elements to avoid SVG <title> text leaking into label
    // (each tab link has an SVG arrow icon with <title>images/angle-down</title>)
    const clone = label.cloneNode(true);
    const svgs = clone.querySelectorAll('svg');
    svgs.forEach((svg) => svg.remove());
    const tabName = clone.textContent.trim();

    const pane = tabPanes[i];

    const labelFrag = document.createDocumentFragment();
    labelFrag.appendChild(document.createComment(' field:title '));
    labelFrag.appendChild(document.createTextNode(tabName));

    const contentFrag = document.createDocumentFragment();
    contentFrag.appendChild(document.createComment(' field:content_richtext '));

    if (pane) {
      const texts = pane.querySelectorAll('.component-text');
      texts.forEach((t) => {
        const paragraphs = t.querySelectorAll('p');
        paragraphs.forEach((p) => contentFrag.appendChild(p));
      });
      const ctaLink = pane.querySelector('.mega-cta a.btn, .component-cta-button a, a.btn');
      if (ctaLink) contentFrag.appendChild(ctaLink);
    }

    cells.push([labelFrag, contentFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-features', cells });
  element.replaceWith(block);
}
