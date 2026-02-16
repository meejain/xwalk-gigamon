import { getMetadata } from '../../scripts/aem.js';

const GIGAMON_DRIFT_EMBED_ID = 'iu3bua46tv44';

async function loadDrift(embedId) {
  if (!embedId || typeof embedId !== 'string' || !embedId.trim()) return false;
  const id = embedId.trim();
  return new Promise((resolve) => {
    const driftObj = window.driftt || [];
    window.driftt = driftObj;
    window.drift = driftObj;
    if (window.drift.init) {
      resolve(true);
      return;
    }
    window.drift.load = function loadDriftScript(eid) {
      const script = document.createElement('script');
      script.src = `https://js.driftt.com/include/${eid}/${eid}.js`;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    };
    window.drift.load(id);
    resolve(true);
  });
}

function isDriftWidgetInDom() {
  return !!document.getElementById('drift-frame-controller');
}

function pinDriftWidgetVisible() {
  if (typeof window.drift === 'undefined') return;
  const show = () => {
    try {
      if (window.drift.api && window.drift.api.widget && typeof window.drift.api.widget.show === 'function') {
        window.drift.api.widget.show();
      }
    } catch (e) {
      // ignore
    }
  };
  if (window.drift.on) {
    window.drift.on('ready', show);
  }
  setTimeout(show, 500);
  setTimeout(show, 1500);
}

function waitForDriftWidget(ms = 2500) {
  return new Promise((resolve) => {
    if (isDriftWidgetInDom()) {
      resolve(true);
      return;
    }
    const end = Date.now() + ms;
    const check = () => {
      if (isDriftWidgetInDom()) {
        resolve(true);
        return;
      }
      if (Date.now() < end) {
        requestAnimationFrame(check);
      } else {
        resolve(false);
      }
    };
    requestAnimationFrame(check);
  });
}

export default async function decorate(block) {
  const driftEmbedId = getMetadata('drift-id') || getMetadata('drift-embed-id') || GIGAMON_DRIFT_EMBED_ID;
  const useDrift = driftEmbedId.trim().length > 0;

  if (useDrift) {
    if (typeof window.drift === 'undefined' || !window.drift.invoked) {
      await loadDrift(driftEmbedId.trim());
    }
    const driftShown = await waitForDriftWidget(2500);
    if (driftShown) {
      pinDriftWidgetVisible();
    }
  }

  block.classList.add('chat-widget-drift-loaded');
  block.setAttribute('aria-hidden', 'true');
}
