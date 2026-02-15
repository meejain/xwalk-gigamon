import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const ARROW_SVG = `<svg class="cta-arrow" xmlns="http://www.w3.org/2000/svg" width="29" height="14" viewBox="0 0 29 14" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <line x1="1" y1="7" x2="25" y2="7" stroke="currentColor" stroke-width="2"/>
  <polyline points="19,1 26,7 19,13" stroke="currentColor" stroke-width="2" fill="none"/>
</svg>`;

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    const divs = [...li.children];
    let imageDiv = null;
    let logoDiv = null;
    let bodyDiv = null;
    divs.forEach((div) => {
      const hasOnlyImg = div.children.length === 1
        && (div.querySelector('picture') || div.querySelector('img'));
      if (hasOnlyImg && !imageDiv) {
        div.className = 'cards-featured-card-image';
        imageDiv = div;
      } else if (hasOnlyImg && !logoDiv) {
        div.className = 'cards-featured-card-logo';
        logoDiv = div;
      } else {
        div.className = 'cards-featured-card-body';
        bodyDiv = div;
      }
    });
    // Move logo into body after the first child (label paragraph)
    if (logoDiv && bodyDiv) {
      const logoContent = logoDiv.querySelector('p') || logoDiv.firstElementChild;
      if (logoContent && bodyDiv.firstElementChild) {
        bodyDiv.firstElementChild.after(logoContent);
      } else if (logoContent) {
        bodyDiv.prepend(logoContent);
      }
      logoDiv.remove();
    }
    ul.append(li);
  });
  ul.querySelectorAll('.cards-featured-card-image picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Add arrow SVG to CTA links
  ul.querySelectorAll('.cards-featured-card-body a').forEach((link) => {
    link.classList.add('cta-link');
    link.classList.remove('button');
    const wrapper = link.closest('.button-container');
    if (wrapper) wrapper.classList.add('cta-container');
    link.insertAdjacentHTML('beforeend', ARROW_SVG);
  });

  block.textContent = '';
  block.append(ul);
}
