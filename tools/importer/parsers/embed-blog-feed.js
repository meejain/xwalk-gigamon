/* eslint-disable */
/* global WebImporter */
/** Parser: embed-blog-feed. Base: embed. Source: gigamon.com */
export default function parse(element, { document }) {
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(' field:embed_uri '));
  const link = document.createElement('a');
  link.href = 'https://www.gigamon.com/blog';
  link.textContent = 'https://www.gigamon.com/blog';
  frag.appendChild(link);

  const cells = [[frag]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-blog-feed', cells });
  element.replaceWith(block);
}
