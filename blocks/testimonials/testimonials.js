export default function decorate(block) {
  // Restructure: convert multiple rows (one per testimonial, each with logo|text cols)
  // into a single row with one column per testimonial (logo + text combined in each)
  const items = [...block.children];
  const row = document.createElement('div');

  items.forEach((item) => {
    const cols = [...item.children];
    const card = document.createElement('div');

    // Move logo from first column
    if (cols[0]) {
      [...cols[0].children].forEach((child) => card.appendChild(child));
    }

    // Move text content from second column
    if (cols[1]) {
      [...cols[1].children].forEach((child) => card.appendChild(child));
    }

    row.appendChild(card);
  });

  block.textContent = '';
  block.appendChild(row);
  block.classList.add(`testimonials-${items.length}-cols`);

  // Ensure parent section has layout class
  const section = block.closest('.section');
  if (section) section.classList.add('testimonials-container');
}
