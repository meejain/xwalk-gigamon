const loadScript = (url, callback, type) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (type) script.setAttribute('type', type);
  script.onload = callback;
  head.append(script);
  return script;
};

const getDefaultEmbed = (url) => `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
      scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;

const loadEmbed = (block, link) => {
  if (block.classList.contains('embed-blog-feed-is-loaded')) return;
  const url = new URL(link);
  block.innerHTML = getDefaultEmbed(url);
  block.classList = 'block embed-blog-feed';
  block.classList.add('embed-blog-feed-is-loaded');
};

export default function decorate(block) {
  const link = block.querySelector('a')?.href;
  if (!link) return;
  block.textContent = '';
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadEmbed(block, link);
    }
  });
  observer.observe(block);
}
