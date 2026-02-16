export default function decorate(block) {
  // Content has 3 columns per row: logo | text | image
  // Restructure into 2 columns: (logo + text combined) | image
  // to match the da-gigamon columns-banner DOM structure
  const rows = [...block.children];

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length >= 3) {
      const logoCol = cols[0];
      const textCol = cols[1];
      const imageCol = cols[2];

      // Merge logo into text column (logo goes first)
      const combined = document.createElement('div');
      [...logoCol.children].forEach((child) => combined.appendChild(child));
      [...textCol.children].forEach((child) => combined.appendChild(child));

      // Replace the row contents with combined + image
      row.textContent = '';
      row.appendChild(combined);
      row.appendChild(imageCol);
    }
  });

  // Ensure parent section has layout class
  const section = block.closest('.section');
  if (section) section.classList.add('award-banner-container');
}
