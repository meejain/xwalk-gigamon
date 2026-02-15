/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import carouselLogosParser from './parsers/carousel-logos.js';
import columnsValuePropParser from './parsers/columns-value-prop.js';
import tabsFeaturesParser from './parsers/tabs-features.js';
import columnsCaseStudyParser from './parsers/columns-case-study.js';
import columnsTestimonialsParser from './parsers/columns-testimonials.js';
import columnsAwardParser from './parsers/columns-award.js';
import cardsResourcesParser from './parsers/cards-resources.js';
import heroCtaParser from './parsers/hero-cta.js';
import embedBlogFeedParser from './parsers/embed-blog-feed.js';

// TRANSFORMER IMPORTS
import gigamonCleanupTransformer from './transformers/gigamon-cleanup.js';
import gigamonSectionsTransformer from './transformers/gigamon-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'carousel-logos': carouselLogosParser,
  'columns-value-prop': columnsValuePropParser,
  'tabs-features': tabsFeaturesParser,
  'columns-case-study': columnsCaseStudyParser,
  'columns-testimonials': columnsTestimonialsParser,
  'columns-award': columnsAwardParser,
  'cards-resources': cardsResourcesParser,
  'hero-cta': heroCtaParser,
  'embed-blog-feed': embedBlogFeedParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Gigamon corporate homepage with hero carousel, product highlights, customer testimonials, and promotional content',
  urls: [
    'https://www.gigamon.com/',
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['div.carousel > section.component-carousel.whitearrows.move-dots-up'],
    },
    {
      name: 'carousel-logos',
      instances: ['div.experiencefragment > div.xf-content-height div.component-background.medium-gray-5-bg section.component-responsive-layout'],
    },
    {
      name: 'columns-value-prop',
      instances: ['div.responsive-layout > div.component-background.vert-pad-top-sm section.component-responsive-layout'],
    },
    {
      name: 'tabs-features',
      instances: ['div.multi-tabs section.component-multi-tabs'],
    },
    {
      name: 'columns-case-study',
      instances: ['div.columns > div.component-background.light-grey-bg div.container.anu-blade section.component-columns'],
    },
    {
      name: 'columns-testimonials',
      instances: ['div.columns > div.component-background.light-grey-bg:not(.vert-pad-top-lg) section.component-columns'],
    },
    {
      name: 'columns-award',
      instances: ['div.background-image > section.component-background-image'],
    },
    {
      name: 'cards-resources',
      instances: ['div.carousel > div.component-background section.component-carousel.grayarrows'],
    },
    {
      name: 'hero-cta',
      instances: ['section#ieedf375ef1e580bc427318e1a52ff9d0.component-mega-banner'],
    },
    {
      name: 'embed-blog-feed',
      instances: ['div.rss-feeds section.component-rss-feeds'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: 'div.carousel:first-of-type',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Customer Logo Bar',
      selector: 'div.experiencefragment:first-of-type',
      style: 'grey',
      blocks: ['carousel-logos'],
      defaultContent: ['p.tiletext'],
    },
    {
      id: 'section-3',
      name: 'Why Gigamon',
      selector: 'div.responsive-layout.vert-pad-top-sm',
      style: null,
      blocks: ['columns-value-prop'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Learn How Gigamon Can Help You',
      selector: 'div.multi-tabs',
      style: 'dark',
      blocks: ['tabs-features'],
      defaultContent: ['section.component-text-jumbo'],
    },
    {
      id: 'section-5',
      name: 'Featured Case Study',
      selector: 'div.columns:has(.anu-blade)',
      style: 'grey',
      blocks: ['columns-case-study'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Customer Testimonials',
      selector: 'div.columns:has(.component-columns.not-flush):not(:has(.anu-blade))',
      style: 'grey',
      blocks: ['columns-testimonials'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Frost & Sullivan Award',
      selector: 'div.experiencefragment:has(.background-image)',
      style: 'dark',
      blocks: ['columns-award'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: "What's New",
      selector: [
        'div.text-jumbo:has(#ie2b8fa95b2c89512ce15ed7e54e2ce29)',
        'div.carousel:has(.grayarrows)',
      ],
      style: null,
      blocks: ['cards-resources'],
      defaultContent: ['section#ie2b8fa95b2c89512ce15ed7e54e2ce29'],
    },
    {
      id: 'section-9',
      name: 'Explore Real-World Use Cases',
      selector: 'div.mega-banner:has(#ieedf375ef1e580bc427318e1a52ff9d0)',
      style: null,
      blocks: ['hero-cta'],
      defaultContent: [],
    },
    {
      id: 'section-10',
      name: 'Latest Blogs',
      selector: [
        'div.text-jumbo:has(#i23bc43674b877a97c14aa12054d81997)',
        'div.rss-feeds',
      ],
      style: null,
      blocks: ['embed-blog-feed'],
      defaultContent: ['section#i23bc43674b877a97c14aa12054d81997'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  gigamonCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [gigamonSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
