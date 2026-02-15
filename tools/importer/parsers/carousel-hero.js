/* eslint-disable */
/* global WebImporter */
/** Parser: carousel-hero. Base: carousel. Source: gigamon.com */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('.slick-slide:not(.slick-cloned)');
  const cells = [];
  slides.forEach((slide) => {
    // Background images are CSS backgrounds in scoped <style> tags, not <img> elements
    const styles = slide.querySelectorAll('style');
    let bgUrl = '';
    styles.forEach((style) => {
      const text = style.textContent;
      // Prefer the desktop (min-width: 768px) background image URL
      const desktopMatch = text.match(/min-width:\s*768px\)[\s\S]*?background:\s*url\(["']?([^"')]+)["']?\)/);
      if (desktopMatch && !bgUrl) bgUrl = desktopMatch[1];
    });
    // Fallback to any background URL if desktop version not found
    if (!bgUrl) {
      styles.forEach((style) => {
        const match = style.textContent.match(/url\(["']?([^"')]+)["']?\)/);
        if (match && !bgUrl) bgUrl = match[1];
      });
    }

    const heading = slide.querySelector('.component-text h1, .component-text h2');
    const desc = slide.querySelector('.component-text.text-block:not(.bold) p, .component-text p');
    const cta = slide.querySelector('.mega-cta a.btn, a.btn');

    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:media_image '));
    if (bgUrl) {
      const img = document.createElement('img');
      img.src = bgUrl;
      imgFrag.appendChild(img);
    }

    const contentFrag = document.createDocumentFragment();
    contentFrag.appendChild(document.createComment(' field:content_text '));
    if (heading) contentFrag.appendChild(heading);
    if (desc) contentFrag.appendChild(desc);
    if (cta) contentFrag.appendChild(cta);

    cells.push(['carousel-slide', imgFrag, contentFrag]);
  });
  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
