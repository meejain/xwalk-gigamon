/* eslint-disable */
/* global WebImporter */
/** Parser: columns-award. Base: columns. Source: gigamon.com */
export default function parse(element, { document }) {
  // Award section has two columns within a responsive-layout:
  // Left col (col-lg-6): F&S logo, heading, description, CTA
  // Right col (col-lg-5): Award badge image
  const allCols = element.querySelectorAll('[class*="col-lg-"]');
  const leftCol = allCols[0];
  const rightCol = allCols[1];

  const col1 = document.createDocumentFragment();
  if (leftCol) {
    const logos = leftCol.querySelectorAll('.component-image img');
    logos.forEach((img) => col1.appendChild(img));
    const headings = leftCol.querySelectorAll('h2, h3');
    headings.forEach((h) => col1.appendChild(h));
    const texts = leftCol.querySelectorAll('.component-text p');
    texts.forEach((t) => col1.appendChild(t));
    const cta = leftCol.querySelector('.component-cta-button a, a.btn');
    if (cta) col1.appendChild(cta);
  }

  const col2 = document.createDocumentFragment();
  if (rightCol) {
    const badgeImg = rightCol.querySelector('.component-image img, img');
    if (badgeImg) col2.appendChild(badgeImg);
  }

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-award', cells });
  element.replaceWith(block);
}
