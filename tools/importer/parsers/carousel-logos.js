/* eslint-disable */
/* global WebImporter */
/** Parser: carousel-logos. Base: carousel. Source: gigamon.com */
export default function parse(element, { document }) {
  const cells = [];
  // Logos are inside slick-slide wrappers; filter out cloned slides to avoid duplicates
  const nonClonedSlides = element.querySelectorAll('.slick-slide:not(.slick-cloned)');
  if (nonClonedSlides.length > 0) {
    nonClonedSlides.forEach((slide) => {
      const imgs = slide.querySelectorAll('.component-image img');
      imgs.forEach((img) => {
        const imgFrag = document.createDocumentFragment();
        imgFrag.appendChild(document.createComment(' field:media_image '));
        imgFrag.appendChild(img);
        cells.push(['carousel-slide', imgFrag, '']);
      });
    });
  } else {
    // Fallback if slick not initialized
    const logoImages = element.querySelectorAll('.component-image img');
    logoImages.forEach((img) => {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(' field:media_image '));
      imgFrag.appendChild(img);
      cells.push(['carousel-slide', imgFrag, '']);
    });
  }
  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-logos', cells });
  element.replaceWith(block);
}
