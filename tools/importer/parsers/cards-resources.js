/* eslint-disable */
/* global WebImporter */
/** Parser: cards-resources. Base: cards. Source: gigamon.com */
export default function parse(element, { document }) {
  const cells = [];
  // Resource carousel: each slick-slide contains 3 cards in col-lg-4 columns
  // Each card uses .component-horizontal-resource-card with .title, .heading, .description divs
  const slides = element.querySelectorAll('.slick-slide:not(.slick-cloned)');

  slides.forEach((slide) => {
    const cards = slide.querySelectorAll('.component-horizontal-resource-card');
    cards.forEach((card) => {
      const img = card.querySelector('img');
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(' field:image '));
      if (img) imgFrag.appendChild(img);

      const contentFrag = document.createDocumentFragment();
      contentFrag.appendChild(document.createComment(' field:text '));

      const titleDiv = card.querySelector('.title');
      if (titleDiv) {
        const p = document.createElement('p');
        p.textContent = titleDiv.textContent.trim();
        contentFrag.appendChild(p);
      }
      const headingDiv = card.querySelector('.heading');
      if (headingDiv) {
        const h3 = document.createElement('h3');
        h3.textContent = headingDiv.textContent.trim();
        contentFrag.appendChild(h3);
      }
      const descDiv = card.querySelector('.description');
      if (descDiv) {
        const p = document.createElement('p');
        p.textContent = descDiv.textContent.trim();
        contentFrag.appendChild(p);
      }
      const link = card.querySelector('a.resource-card');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href || link.getAttribute('href');
        a.textContent = headingDiv ? headingDiv.textContent.trim() : 'Read More';
        contentFrag.appendChild(a);
      }

      cells.push(['card', imgFrag, contentFrag]);
    });
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-resources', cells });
  element.replaceWith(block);
}
