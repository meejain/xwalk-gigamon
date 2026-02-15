/* eslint-disable */
/* global WebImporter */
/** Parser: columns-case-study. Base: columns. Source: gigamon.com */
export default function parse(element, { document }) {
  const col1 = document.createDocumentFragment();
  // LHS has the main photo image
  const lhs = element.querySelector('.lhs-section');
  if (lhs) {
    const mainImg = lhs.querySelector('img');
    if (mainImg) col1.appendChild(mainImg);
  }

  const col2 = document.createDocumentFragment();
  // RHS has logo, quote, attribution
  const rhs = element.querySelector('.rhs-section');
  if (rhs) {
    // Extract text content blocks (FEATURED CASE STUDY label, quote, attribution)
    const textBlocks = rhs.querySelectorAll('.component-text, .component-text-jumbo');
    textBlocks.forEach((block) => {
      const children = block.querySelectorAll('p, h2, h3, h4, h5');
      children.forEach((child) => col2.appendChild(child));
    });
    // Extract the customer logo
    const logo = rhs.querySelector('.component-image img');
    if (logo) col2.appendChild(logo);
  }

  // The entire section is wrapped in a.aus-link - extract as CTA
  const ausLink = element.querySelector('a.aus-link');
  if (ausLink) {
    const cta = document.createElement('a');
    cta.href = ausLink.href || ausLink.getAttribute('href');
    cta.textContent = 'Read Case Study';
    col2.appendChild(cta);
  }

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-case-study', cells });
  element.replaceWith(block);
}
