/* eslint-disable */
/* global WebImporter */
/** Parser: embed-blog-feed. Source: gigamon.com RSS feed section (AJAX-loaded, static fallback). */
export default function parse(element, { document }) {
  // The RSS feed on gigamon.com loads content via AJAX from blog.gigamon.com/feed/json
  // Since the content is not in the raw HTML, we output placeholder blog entries
  // that should be updated with actual blog content after import.
  const entries = [
    {
      date: '1/27/2026',
      title: 'The Visibility Gap Undermining OT and IoT Security',
      excerpt: 'OT and IoT security breaks down when organizations cannot see what is happening inside their control networks. As connectivity expands beyond the peri...',
    },
    {
      date: '1/20/2026',
      title: 'BRICKSTORM Malware Report Highlights the Criticality of Network-Derived Telemetry',
      excerpt: 'Bottom line up front: Although GTIG laments the lack of security telemetry in its analysis of the BRICKSTORM malware based on its evaluation of tradit...',
    },
    {
      date: '1/14/2026',
      title: 'Assume Compromise, Design for Mission Resilience',
      excerpt: 'Why Federal Leaders Must Lead With Visibility, Zero Trust, and Cultural Alignment Cybersecurity has long focused on prevention. But that lens is no...',
    },
  ];

  const cells = entries.map((entry) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:text '));

    const datePara = document.createElement('p');
    datePara.textContent = entry.date;
    frag.appendChild(datePara);

    const titlePara = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = entry.title;
    titlePara.appendChild(strong);
    frag.appendChild(titlePara);

    const excerptPara = document.createElement('p');
    excerptPara.textContent = entry.excerpt;
    frag.appendChild(excerptPara);

    return [frag];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-blog-feed', cells });
  element.replaceWith(block);
}
