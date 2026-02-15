/* eslint-disable */
/* global WebImporter */
/** Parser: columns-value-prop. Base: columns. Source: gigamon.com */
export default function parse(element, { document }) {
  const col1 = document.createDocumentFragment();
  const heading = element.querySelector('.component-text-jumbo h2, .component-text h2');
  const desc = element.querySelector('.component-text-jumbo p, .component-text.text-block:not(.bold) p, .component-text p');
  const cta = element.querySelector('.component-cta-button a.btn, .component-cta-button a, a.btn');
  if (heading) col1.appendChild(heading);
  if (desc) col1.appendChild(desc);
  if (cta) col1.appendChild(cta);

  const col2 = document.createDocumentFragment();
  // The right column contains a Lottie animation (no static image)
  // Reference the Lottie JSON source for migration
  const lottie = element.querySelector('.lottie-lazy, .lottie-container, [class*="lottie"]');
  if (lottie) {
    const jsonSrc = lottie.getAttribute('data-jsonsrc');
    if (jsonSrc) {
      const p = document.createElement('p');
      p.textContent = jsonSrc;
      col2.appendChild(p);
    }
  } else {
    // Fallback: try to find any image
    const img = element.querySelector('.component-image img, img.img-responsive');
    if (img) col2.appendChild(img);
  }

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-value-prop', cells });
  element.replaceWith(block);
}
