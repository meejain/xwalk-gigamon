export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('embed-blog-feed-card');
  });
}
