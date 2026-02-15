var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".slick-slide:not(.slick-cloned)");
    const cells = [];
    slides.forEach((slide) => {
      const styles = slide.querySelectorAll("style");
      let bgUrl = "";
      styles.forEach((style) => {
        const text = style.textContent;
        const desktopMatch = text.match(/min-width:\s*768px\)[\s\S]*?background:\s*url\(["']?([^"')]+)["']?\)/);
        if (desktopMatch && !bgUrl) bgUrl = desktopMatch[1];
      });
      if (!bgUrl) {
        styles.forEach((style) => {
          const match = style.textContent.match(/url\(["']?([^"')]+)["']?\)/);
          if (match && !bgUrl) bgUrl = match[1];
        });
      }
      const heading = slide.querySelector(".component-text h1, .component-text h2");
      const desc = slide.querySelector(".component-text.text-block:not(.bold) p, .component-text p");
      const cta = slide.querySelector(".mega-cta a.btn, a.btn");
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:media_image "));
      if (bgUrl) {
        const img = document.createElement("img");
        img.src = bgUrl;
        imgFrag.appendChild(img);
      }
      const contentFrag = document.createDocumentFragment();
      contentFrag.appendChild(document.createComment(" field:content_text "));
      if (heading) contentFrag.appendChild(heading);
      if (desc) contentFrag.appendChild(desc);
      if (cta) contentFrag.appendChild(cta);
      cells.push(["carousel-slide", imgFrag, contentFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-logos.js
  function parse2(element, { document }) {
    const cells = [];
    const nonClonedSlides = element.querySelectorAll(".slick-slide:not(.slick-cloned)");
    if (nonClonedSlides.length > 0) {
      nonClonedSlides.forEach((slide) => {
        const imgs = slide.querySelectorAll(".component-image img");
        imgs.forEach((img) => {
          const imgFrag = document.createDocumentFragment();
          imgFrag.appendChild(document.createComment(" field:media_image "));
          imgFrag.appendChild(img);
          cells.push(["carousel-slide", imgFrag, ""]);
        });
      });
    } else {
      const logoImages = element.querySelectorAll(".component-image img");
      logoImages.forEach((img) => {
        const imgFrag = document.createDocumentFragment();
        imgFrag.appendChild(document.createComment(" field:media_image "));
        imgFrag.appendChild(img);
        cells.push(["carousel-slide", imgFrag, ""]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-logos", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-value-prop.js
  function parse3(element, { document }) {
    const col1 = document.createDocumentFragment();
    const heading = element.querySelector(".component-text-jumbo h2, .component-text h2");
    const desc = element.querySelector(".component-text-jumbo p, .component-text.text-block:not(.bold) p, .component-text p");
    const cta = element.querySelector(".component-cta-button a.btn, .component-cta-button a, a.btn");
    if (heading) col1.appendChild(heading);
    if (desc) col1.appendChild(desc);
    if (cta) col1.appendChild(cta);
    const col2 = document.createDocumentFragment();
    const lottie = element.querySelector('.lottie-lazy, .lottie-container, [class*="lottie"]');
    if (lottie) {
      const jsonSrc = lottie.getAttribute("data-jsonsrc");
      if (jsonSrc) {
        const p = document.createElement("p");
        p.textContent = jsonSrc;
        col2.appendChild(p);
      }
    } else {
      const img = element.querySelector(".component-image img, img.img-responsive");
      if (img) col2.appendChild(img);
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-value-prop", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-features.js
  function parse4(element, { document }) {
    const tabLabels = element.querySelectorAll("ul.nav-tabs li.arrow a.white-tab");
    const tabPanes = element.querySelectorAll(".tab-pane");
    const cells = [];
    tabLabels.forEach((label, i) => {
      const clone = label.cloneNode(true);
      const svgs = clone.querySelectorAll("svg");
      svgs.forEach((svg) => svg.remove());
      const tabName = clone.textContent.trim();
      const pane = tabPanes[i];
      const labelFrag = document.createDocumentFragment();
      labelFrag.appendChild(document.createComment(" field:title "));
      labelFrag.appendChild(document.createTextNode(tabName));
      const contentFrag = document.createDocumentFragment();
      contentFrag.appendChild(document.createComment(" field:content_richtext "));
      if (pane) {
        const texts = pane.querySelectorAll(".component-text");
        texts.forEach((t) => {
          const paragraphs = t.querySelectorAll("p");
          paragraphs.forEach((p) => contentFrag.appendChild(p));
        });
        const ctaLink = pane.querySelector(".mega-cta a.btn, .component-cta-button a, a.btn");
        if (ctaLink) contentFrag.appendChild(ctaLink);
      }
      cells.push([labelFrag, contentFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-features", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-case-study.js
  function parse5(element, { document }) {
    const col1 = document.createDocumentFragment();
    const lhs = element.querySelector(".lhs-section");
    if (lhs) {
      const mainImg = lhs.querySelector("img");
      if (mainImg) col1.appendChild(mainImg);
    }
    const col2 = document.createDocumentFragment();
    const rhs = element.querySelector(".rhs-section");
    if (rhs) {
      const textBlocks = rhs.querySelectorAll(".component-text, .component-text-jumbo");
      textBlocks.forEach((block2) => {
        const children = block2.querySelectorAll("p, h2, h3, h4, h5");
        children.forEach((child) => col2.appendChild(child));
      });
      const logo = rhs.querySelector(".component-image img");
      if (logo) col2.appendChild(logo);
    }
    const ausLink = element.querySelector("a.aus-link");
    if (ausLink) {
      const cta = document.createElement("a");
      cta.href = ausLink.href || ausLink.getAttribute("href");
      cta.textContent = "Read Case Study";
      col2.appendChild(cta);
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-case-study", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-testimonials.js
  function parse6(element, { document }) {
    const columns = element.querySelectorAll('[class*="col-lg-6"]');
    const colFrags = [];
    columns.forEach((col) => {
      const frag = document.createDocumentFragment();
      const logo = col.querySelector(".component-image img");
      if (logo) frag.appendChild(logo);
      const textBlocks = col.querySelectorAll(".component-text, .component-text-jumbo");
      textBlocks.forEach((block2) => {
        const children = block2.querySelectorAll("p");
        children.forEach((p) => frag.appendChild(p));
      });
      const link = col.querySelector('a.btn, .component-cta-button a, a[class*="link"]');
      if (link) frag.appendChild(link);
      colFrags.push(frag);
    });
    const cells = [colFrags.length > 0 ? colFrags : ["", ""]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-testimonials", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-award.js
  function parse7(element, { document }) {
    const allCols = element.querySelectorAll('[class*="col-lg-"]');
    const leftCol = allCols[0];
    const rightCol = allCols[1];
    const col1 = document.createDocumentFragment();
    if (leftCol) {
      const logos = leftCol.querySelectorAll(".component-image img");
      logos.forEach((img) => col1.appendChild(img));
      const headings = leftCol.querySelectorAll("h2, h3");
      headings.forEach((h) => col1.appendChild(h));
      const texts = leftCol.querySelectorAll(".component-text p");
      texts.forEach((t) => col1.appendChild(t));
      const cta = leftCol.querySelector(".component-cta-button a, a.btn");
      if (cta) col1.appendChild(cta);
    }
    const col2 = document.createDocumentFragment();
    if (rightCol) {
      const badgeImg = rightCol.querySelector(".component-image img, img");
      if (badgeImg) col2.appendChild(badgeImg);
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-award", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-resources.js
  function parse8(element, { document }) {
    const cells = [];
    const slides = element.querySelectorAll(".slick-slide:not(.slick-cloned)");
    slides.forEach((slide) => {
      const cards = slide.querySelectorAll(".component-horizontal-resource-card");
      cards.forEach((card) => {
        const img = card.querySelector("img");
        const imgFrag = document.createDocumentFragment();
        imgFrag.appendChild(document.createComment(" field:image "));
        if (img) imgFrag.appendChild(img);
        const contentFrag = document.createDocumentFragment();
        contentFrag.appendChild(document.createComment(" field:text "));
        const titleDiv = card.querySelector(".title");
        if (titleDiv) {
          const p = document.createElement("p");
          p.textContent = titleDiv.textContent.trim();
          contentFrag.appendChild(p);
        }
        const headingDiv = card.querySelector(".heading");
        if (headingDiv) {
          const h3 = document.createElement("h3");
          h3.textContent = headingDiv.textContent.trim();
          contentFrag.appendChild(h3);
        }
        const descDiv = card.querySelector(".description");
        if (descDiv) {
          const p = document.createElement("p");
          p.textContent = descDiv.textContent.trim();
          contentFrag.appendChild(p);
        }
        const link = card.querySelector("a.resource-card");
        if (link) {
          const a = document.createElement("a");
          a.href = link.href || link.getAttribute("href");
          a.textContent = headingDiv ? headingDiv.textContent.trim() : "Read More";
          contentFrag.appendChild(a);
        }
        cells.push(["card", imgFrag, contentFrag]);
      });
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-resources", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function parse9(element, { document }) {
    let bgUrl = "";
    const megaBanner = element.closest(".mega-banner") || element.querySelector(".mega-banner") || element;
    const styles = megaBanner.querySelectorAll("style");
    styles.forEach((style) => {
      const text = style.textContent;
      const desktopMatch = text.match(/min-width:\s*768px\)[\s\S]*?background:\s*url\(["']?([^"')]+)["']?\)/);
      if (desktopMatch && !bgUrl) bgUrl = desktopMatch[1];
    });
    if (!bgUrl) {
      styles.forEach((style) => {
        const match = style.textContent.match(/url\(["']?([^"')]+)["']?\)/);
        if (match && !bgUrl) bgUrl = match[1];
      });
    }
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(" field:image "));
    if (bgUrl) {
      const img = document.createElement("img");
      img.src = bgUrl;
      imgFrag.appendChild(img);
    }
    const contentFrag = document.createDocumentFragment();
    contentFrag.appendChild(document.createComment(" field:text "));
    const heading = element.querySelector(".component-text h2, .component-text h1");
    if (heading) contentFrag.appendChild(heading);
    const desc = element.querySelector(".component-text.text-block:not(.bold) p, .component-text p");
    if (desc) contentFrag.appendChild(desc);
    const cta = element.querySelector(".mega-cta a.btn, .component-cta-button a, a.btn");
    if (cta) contentFrag.appendChild(cta);
    const cells = [[imgFrag], [contentFrag]];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-blog-feed.js
  function parse10(element, { document }) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(" field:embed_uri "));
    const link = document.createElement("a");
    link.href = "https://www.gigamon.com/blog";
    link.textContent = "https://www.gigamon.com/blog";
    frag.appendChild(link);
    const cells = [[frag]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-blog-feed", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/gigamon-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".sticky-footer",
        "cs-native-frame-holder"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".global-navigation",
        ".fat-footer",
        "nav#mp-menu",
        "link",
        "iframe",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/gigamon-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== H2.after) return;
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;
    const reversedSections = [...sections].reverse();
    for (const section of reversedSections) {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) continue;
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.after(metaBlock);
      }
      if (section.id !== "section-1") {
        const hr = document.createElement("hr");
        sectionEl.before(hr);
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "carousel-logos": parse2,
    "columns-value-prop": parse3,
    "tabs-features": parse4,
    "columns-case-study": parse5,
    "columns-testimonials": parse6,
    "columns-award": parse7,
    "cards-resources": parse8,
    "hero-cta": parse9,
    "embed-blog-feed": parse10
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Gigamon corporate homepage with hero carousel, product highlights, customer testimonials, and promotional content",
    urls: [
      "https://www.gigamon.com/"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: ["div.carousel > section.component-carousel.whitearrows.move-dots-up"]
      },
      {
        name: "carousel-logos",
        instances: ["div.experiencefragment > div.xf-content-height div.component-background.medium-gray-5-bg section.component-responsive-layout"]
      },
      {
        name: "columns-value-prop",
        instances: ["div.responsive-layout > div.component-background.vert-pad-top-sm section.component-responsive-layout"]
      },
      {
        name: "tabs-features",
        instances: ["div.multi-tabs section.component-multi-tabs"]
      },
      {
        name: "columns-case-study",
        instances: ["div.columns > div.component-background.light-grey-bg div.container.anu-blade section.component-columns"]
      },
      {
        name: "columns-testimonials",
        instances: ["div.columns > div.component-background.light-grey-bg:not(.vert-pad-top-lg) section.component-columns"]
      },
      {
        name: "columns-award",
        instances: ["div.background-image > section.component-background-image"]
      },
      {
        name: "cards-resources",
        instances: ["div.carousel > div.component-background section.component-carousel.grayarrows"]
      },
      {
        name: "hero-cta",
        instances: ["section#ieedf375ef1e580bc427318e1a52ff9d0.component-mega-banner"]
      },
      {
        name: "embed-blog-feed",
        instances: ["div.rss-feeds section.component-rss-feeds"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: "div.carousel:first-of-type",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Customer Logo Bar",
        selector: "div.experiencefragment:first-of-type",
        style: "grey",
        blocks: ["carousel-logos"],
        defaultContent: ["p.tiletext"]
      },
      {
        id: "section-3",
        name: "Why Gigamon",
        selector: "div.responsive-layout.vert-pad-top-sm",
        style: null,
        blocks: ["columns-value-prop"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Learn How Gigamon Can Help You",
        selector: "div.multi-tabs",
        style: "dark",
        blocks: ["tabs-features"],
        defaultContent: ["section.component-text-jumbo"]
      },
      {
        id: "section-5",
        name: "Featured Case Study",
        selector: "div.columns:has(.anu-blade)",
        style: "grey",
        blocks: ["columns-case-study"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Customer Testimonials",
        selector: "div.columns:has(.component-columns.not-flush):not(:has(.anu-blade))",
        style: "grey",
        blocks: ["columns-testimonials"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Frost & Sullivan Award",
        selector: "div.experiencefragment:has(.background-image)",
        style: "dark",
        blocks: ["columns-award"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "What's New",
        selector: [
          "div.text-jumbo:has(#ie2b8fa95b2c89512ce15ed7e54e2ce29)",
          "div.carousel:has(.grayarrows)"
        ],
        style: null,
        blocks: ["cards-resources"],
        defaultContent: ["section#ie2b8fa95b2c89512ce15ed7e54e2ce29"]
      },
      {
        id: "section-9",
        name: "Explore Real-World Use Cases",
        selector: "div.mega-banner:has(#ieedf375ef1e580bc427318e1a52ff9d0)",
        style: null,
        blocks: ["hero-cta"],
        defaultContent: []
      },
      {
        id: "section-10",
        name: "Latest Blogs",
        selector: [
          "div.text-jumbo:has(#i23bc43674b877a97c14aa12054d81997)",
          "div.rss-feeds"
        ],
        style: null,
        blocks: ["embed-blog-feed"],
        defaultContent: ["section#i23bc43674b877a97c14aa12054d81997"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
