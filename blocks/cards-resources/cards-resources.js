import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function scrollSlider(block, direction) {
  const slidesContainer = block.querySelector('.cards-resources-slides');
  const slide = block.querySelector('.cards-resources-slide');
  if (!slide) return;
  const slideWidth = slide.offsetWidth;
  const gap = 24;
  const scrollAmount = (slideWidth + gap) * 3;

  slidesContainer.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth',
  });
}

function updateNavButtons(block) {
  const slidesContainer = block.querySelector('.cards-resources-slides');
  const prevBtn = block.querySelector('.slide-prev');
  const nextBtn = block.querySelector('.slide-next');

  if (!prevBtn || !nextBtn || !slidesContainer) return;

  const isAtStart = slidesContainer.scrollLeft <= 0;
  const maxScroll = slidesContainer.scrollWidth - slidesContainer.clientWidth - 10;
  const isAtEnd = slidesContainer.scrollLeft >= maxScroll;

  prevBtn.disabled = isAtStart;
  nextBtn.disabled = isAtEnd;
}

let carouselId = 0;

export default function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `cards-resources-${carouselId}`);
  const rows = [...block.children];

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'News Slider');

  // Create prev button
  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'slide-prev';
  prevBtn.setAttribute('aria-label', 'Previous Slide');
  prevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M15 18l-6-6 6-6"/>
  </svg>`;

  // Create next button
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'slide-next';
  nextBtn.setAttribute('aria-label', 'Next Slide');
  nextBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M9 6l6 6-6 6"/>
  </svg>`;

  const container = document.createElement('div');
  container.classList.add('cards-resources-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('cards-resources-slides');

  rows.forEach((row, idx) => {
    const slide = document.createElement('li');
    slide.dataset.slideIndex = idx;
    slide.setAttribute('id', `cards-resources-${carouselId}-slide-${idx}`);
    slide.classList.add('cards-resources-slide');
    moveInstrumentation(row, slide);

    [...row.children].forEach((column, colIdx) => {
      column.classList.add(`cards-resources-slide-${colIdx === 0 ? 'image' : 'content'}`);
      slide.append(column);
    });

    slidesWrapper.append(slide);
  });

  // Optimize images
  slidesWrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  container.append(slidesWrapper);

  // Clear and rebuild block structure
  block.textContent = '';
  block.append(prevBtn);
  block.append(container);
  block.append(nextBtn);

  // Event listeners
  prevBtn.addEventListener('click', () => scrollSlider(block, -1));
  nextBtn.addEventListener('click', () => scrollSlider(block, 1));
  slidesWrapper.addEventListener('scroll', () => updateNavButtons(block));

  // Initial button state
  setTimeout(() => updateNavButtons(block), 100);

  // Auto-play: advance every 3 seconds, loop back to start
  let autoplayInterval = setInterval(() => {
    const maxScroll = slidesWrapper.scrollWidth - slidesWrapper.clientWidth - 10;
    if (slidesWrapper.scrollLeft >= maxScroll) {
      slidesWrapper.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      scrollSlider(block, 1);
    }
  }, 3000);

  // Pause auto-play on hover
  block.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  block.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(() => {
      const maxScroll = slidesWrapper.scrollWidth - slidesWrapper.clientWidth - 10;
      if (slidesWrapper.scrollLeft >= maxScroll) {
        slidesWrapper.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollSlider(block, 1);
      }
    }, 3000);
  });
}
