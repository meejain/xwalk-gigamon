/* eslint-disable */
/* global WebImporter */
/** Parser: testimonials. Base: columns. Source: gigamon.com */
export default function parse(element, { document }) {
  // Columns are nested: div.columns > .component-background > .container >
  //   .adjust-column-width-90 > section.component-columns > div.col-lg-6
  const columns = element.querySelectorAll('[class*="col-lg-6"]');

  const colFrags = [];
  columns.forEach((col) => {
    const frag = document.createDocumentFragment();
    // Customer logo
    const logo = col.querySelector('.component-image img');
    if (logo) frag.appendChild(logo);
    // Quote and attribution text
    const textBlocks = col.querySelectorAll('.component-text, .component-text-jumbo');
    textBlocks.forEach((block) => {
      const children = block.querySelectorAll('p');
      children.forEach((p) => frag.appendChild(p));
    });
    // CTA link (Read Case Study / Watch Video)
    const link = col.querySelector('a.btn, .component-cta-button a, a[class*="link"]');
    if (link) frag.appendChild(link);
    colFrags.push(frag);
  });

  const cells = [colFrags.length > 0 ? colFrags : ['', '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'testimonials', cells });
  element.replaceWith(block);
}
