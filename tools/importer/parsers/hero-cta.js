/* eslint-disable */
/* global WebImporter */
/** Parser: hero-cta. Base: hero. Source: gigamon.com */
export default function parse(element, { document }) {
  // Background image is set via CSS in scoped <style> tags, not as an <img> element
  let bgUrl = '';
  const megaBanner = element.closest('.mega-banner') || element.querySelector('.mega-banner') || element;
  const styles = megaBanner.querySelectorAll('style');
  styles.forEach((style) => {
    const text = style.textContent;
    // Prefer the desktop (min-width: 768px) background image URL
    const desktopMatch = text.match(/min-width:\s*768px\)[\s\S]*?background:\s*url\(["']?([^"')]+)["']?\)/);
    if (desktopMatch && !bgUrl) bgUrl = desktopMatch[1];
  });
  // Fallback to any background URL
  if (!bgUrl) {
    styles.forEach((style) => {
      const match = style.textContent.match(/url\(["']?([^"')]+)["']?\)/);
      if (match && !bgUrl) bgUrl = match[1];
    });
  }

  const imgFrag = document.createDocumentFragment();
  imgFrag.appendChild(document.createComment(' field:image '));
  if (bgUrl) {
    const img = document.createElement('img');
    img.src = bgUrl;
    imgFrag.appendChild(img);
  }

  const contentFrag = document.createDocumentFragment();
  contentFrag.appendChild(document.createComment(' field:text '));
  const heading = element.querySelector('.component-text h2, .component-text h1');
  if (heading) contentFrag.appendChild(heading);
  const desc = element.querySelector('.component-text.text-block:not(.bold) p, .component-text p');
  if (desc) contentFrag.appendChild(desc);
  const cta = element.querySelector('.mega-cta a.btn, .component-cta-button a, a.btn');
  if (cta) contentFrag.appendChild(cta);

  const cells = [[imgFrag], [contentFrag]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
