// Initial setup
chrome.storage.sync.get(['itemsPerRow'], function (result) {
  updateGridLayout(result.itemsPerRow || 4);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'updateGrid') {
    updateGridLayout(request.itemsPerRow);
  }
});

// Function to update the grid layout and inject styles
function updateGridLayout(itemsPerRow) {
  const styleId = 'yt-grid-customizer';
  let style = document.getElementById(styleId);
  if (style) style.remove();

  injectLiquidGlassSVG();

  style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    #owner-sub-count {
      display: block !important;
    }
    :root { --ytd-rich-grid-items-per-row: ${itemsPerRow}; }
    ytd-rich-item-renderer:not([is-slim-grid]) {
      width: ${100 / itemsPerRow}% !important;
      max-width: ${100 / itemsPerRow}% !important;
      min-width: ${100 / itemsPerRow}% !important;
    }
    ytd-rich-item-renderer { position: relative !important; overflow: visible !important; }

    .yt-grid-hover-zoom { position: fixed !important; display: none !important; z-index: 2147483647 !important; pointer-events: auto !important; padding: 8px !important; border-radius: 16px !important; }
    .yt-grid-hover-zoom::before {
      content: ""; position: absolute; inset: 0; border-radius: inherit;
      background-color: color-mix(in srgb, var(--t3e41d7b17b187f69) 30%, transparent) !important;
      backdrop-filter: url(#yt-glass-blur) !important;
      -webkit-backdrop-filter: url(#yt-glass-blur) !important;
      box-shadow: 0 24px 56px rgba(0,0,0,0.38), inset 0 1px 4px 0 rgba(255, 255, 255, 0.2) !important;
      z-index: -1; pointer-events: none !important;
    }
    .yt-grid-hover-zoom.is-visible { display: block !important; }
    .yt-grid-hover-zoom * { pointer-events: auto !important; }
    .yt-grid-hover-zoom > * { width: 100% !important; max-width: 100% !important; display: block !important; transform: none !important; }
    .yt-grid-hover-zoom>.yt-grid-card-preview { width: 100% !important; border-radius: 16px !important; overflow: hidden !important; background: transparent !important; border: 1px solid var(--yt-spec-10-percent-layer, rgba(128,128,128,0.2)) !important; color: var(--yt-spec-text-primary) !important; }
    .yt-grid-card-preview { display: grid !important; gap: 8px !important; }
    .yt-grid-card-preview.is-short { width: 100% !important; margin: 0 !important; }
    .yt-grid-card-preview .preview-thumb { position: relative !important; width: 100% !important; aspect-ratio: 16 / 9 !important; overflow: hidden !important; background: #000 !important; }
    .yt-grid-card-preview.is-short .preview-thumb { aspect-ratio: 2 / 3 !important; }
    .yt-grid-card-preview .preview-thumb img { position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; object-fit: cover !important; }
    .yt-grid-card-preview .preview-duration { position: absolute !important; right: 8px !important; bottom: 8px !important; padding: 2px 6px !important; background: rgba(0,0,0,0.72) !important; color: #fff !important; font-size: 11px !important; border-radius: 2px !important; }
    .yt-grid-card-preview .preview-content { display: grid !important; gap: 8px !important; padding: 12px !important; }
    .yt-grid-card-preview .preview-title { color: var(--tde41338fc2bd4ba5) !important; text-shadow: 0 1px 2px rgba(0,0,0,0.1); font-size: 14px !important; line-height: 1.35 !important; font-weight: 500 !important; margin: 0 !important; display: -webkit-box !important; -webkit-line-clamp: 2 !important; -webkit-box-orient: vertical !important; overflow: hidden !important; text-overflow: ellipsis !important; }
    .yt-grid-card-preview .preview-title a { color: var(--tde41338fc2bd4ba5) !important; text-shadow: 0 1px 2px rgba(0,0,0,0.1); text-decoration: none !important;  }
    .yt-grid-card-preview .preview-channel { color: var(--tde41338fc2bd4ba5) !important; text-shadow: 0 1px 2px rgba(0,0,0,0.1); display: flex !important; align-items: center !important; gap: 10px !important; flex-wrap: wrap !important; }
    .yt-grid-card-preview .preview-avatars { display: flex !important; align-items: center !important; }
    .yt-grid-card-preview .preview-avatars img { width: 32px !important; height: 32px !important; border-radius: 50% !important; object-fit: cover !important; background: rgba(128,128,128,0.1) !important; border: 2px solid var(--yt-spec-base-background, #121212) !important; margin-left: -12px !important; }
    .yt-grid-card-preview .preview-avatars img:first-child { margin-left: 0 !important; }
    .yt-grid-card-preview .preview-channel span, .yt-grid-card-preview .preview-channel a { color: var(--tde41338fc2bd4ba5) !important; text-shadow: 0 1px 2px rgba(0,0,0,0.1); font-size: 13px !important; }
    .yt-grid-card-preview .preview-channel .preview-stats { display: flex !important; align-items: center !important; gap: 10px !important; margin-left: auto !important; }
    .yt-grid-card-preview .preview-stats span { white-space: nowrap !important; color: var(--tde41338fc2bd4ba5) !important; text-shadow: 0 1px 2px rgba(0,0,0,0.1); font-size: 12px !important; }
    .yt-grid-card-preview .preview-views-icon { color: var(--tde41338fc2bd4ba5) !important; margin-right: 4px !important; font-size: 11px !important; }
    .yt-grid-card-preview .preview-meta { display: none !important; }


    /* Reset nested backgrounds and borders to transparent to unify the elements */
    #frosted-glass, #frosted-glass.with-chipbar, ytd-app #frosted-glass, #search-form, #top-row,
    ytd-searchbox #container, ytd-searchbox #search-icon-legacy, ytd-searchbox button, ytd-searchbox yt-button-shape,
    .ytSearchboxComponentInputBox, .ytSearchboxComponentInputBoxDark,
    .ytSearchboxComponentSearchButton, .ytSearchboxComponentSearchButtonDark,
    .sbdd_b, .sbsb_a, .sbsb_b, .sbsb_c,
    .ytSearchboxComponentSuggestionsContainer, .ytSearchboxComponentSuggestionsContainerDark,
    ytd-searchbox-suggestions, yt-searchbox-suggestions,
    .ytSuggestionComponentSuggestion,
    #background {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      border-color: transparent !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }

    /* Apply Liquid Glass Effect using ::before pseudo-elements */
    /* This architectural pattern prevents Chrome from breaking 'position: sticky' or altering box dimensions! */

    /* 1. Masthead */
    body:not(.yt-watch-page) #masthead-container {
      background-color: transparent !important;
    }
    body:not(.yt-watch-page) #masthead-container::before {
      content: "";
      position: absolute;
      inset: 0;
      background-color: rgba(255, 255, 255, 0.05) !important;
      backdrop-filter: url(#yt-glass-blur) !important;
      -webkit-backdrop-filter: url(#yt-glass-blur) !important;
      z-index: -1;
      pointer-events: none;
      transition: background-color 0.3s ease;
    }
    


    /* Style individual chips to look like glass bubbles while preserving theme colors */
    yt-chip-cloud-chip-renderer chip-shape .ytChipShapeChip {
      background-color: var(--yt-spec-badge-chip-background, rgba(128, 128, 128, 0.1)) !important;
      border: 1px solid var(--yt-spec-10-percent-layer, rgba(128, 128, 128, 0.2)) !important;
      transition: all 0.2s ease;
    }
    yt-chip-cloud-chip-renderer chip-shape .ytChipShapeChip:hover {
      background-color: var(--yt-spec-button-chip-background-hover, rgba(128, 128, 128, 0.2)) !important;
    }
    yt-chip-cloud-chip-renderer chip-shape .ytChipShapeChip.ytChipShapeActive,
    yt-chip-cloud-chip-renderer chip-shape .ytChipShapeChip[aria-selected="true"] {
      background-color: var(--yt-spec-text-primary, #000) !important;
      color: var(--yt-spec-base-background, #fff) !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
    }

    /* 3. Search Box - Solid Pill */
    yt-searchbox {
      // background-color: transparent !important;
      border-radius: 40px !important;
      position: relative !important;
      z-index: 2000 !important;
      // border-color: transparent !important; /* Use transparent color instead of 'none' to maintain native box-model height! */
      min-height: 40px !important;
    }
      yt-searchbox {
      border: 1px solid rgba(0,0,0,0.2);
        &.ytSearchboxComponentHostIsFocused {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 2px 2px 6px 0 rgba(255, 255, 255, 0.4), inset -2px -2px 6px 0 rgba(255, 255, 255, 0.1) !important;
              }
      }
    ytd-searchbox::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background-color: rgba(255, 255, 255, 0.05) !important;
      backdrop-filter: url(#yt-glass-blur) !important;
      -webkit-backdrop-filter: url(#yt-glass-blur) !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 2px 2px 6px 0 rgba(255, 255, 255, 0.4), inset -2px -2px 6px 0 rgba(255, 255, 255, 0.1) !important;
      z-index: -1;
      pointer-events: none;
    }
    /* Indestructible border using ::after to avoid box-model clipping */
    ytd-searchbox::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      border: 1px solid rgba(255, 255, 255, 0.4) !important;
      z-index: 2;
      pointer-events: none;
    }

    /* 4. Suggestions Dropdown */
    .ytSearchboxComponentSuggestionsContainer, .ytSearchboxComponentSuggestionsContainerDark {
      /* background-color: transparent !important; */
      border-radius: 20px !important;
      z-index: 2001 !important;
      margin-top: 8px !important;
    }
    .ytSearchboxComponentSuggestionsContainer::before, .ytSearchboxComponentSuggestionsContainerDark::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background-color: rgba(255, 255, 255, 0.05) !important;
      backdrop-filter: url(#yt-glass-blur) !important;
      -webkit-backdrop-filter: url(#yt-glass-blur) !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 2px 2px 4px 0 rgba(255, 255, 255, 0.2), inset -2px -2px 4px 0 rgba(255, 255, 255, 0.1) !important;
      z-index: -1;
      pointer-events: none;
    }
    /* Indestructible border for dropdown */
    .ytSearchboxComponentSuggestionsContainer::after, .ytSearchboxComponentSuggestionsContainerDark::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      z-index: 2;
      pointer-events: none;
    }

    /* Restore suggestion hover effects since we reset the backgrounds */
    .sbsb_c:hover, .ytSuggestionComponentSuggestion:hover, .ytSuggestionComponentHighlighted, .sbdd_c:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }

  `;

  document.head.appendChild(style);
  setupHoverZoom();
}

function createLensDisplacementMap() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  const cx = size / 2;
  const cy = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x - cx) / cx;
      const ny = (y - cy) / cy;

      // Pure magnification: mathematically sample towards the center
      // This encodes the lens curvature directly into the R/G channels
      const rVal = 128 - (nx * 127);
      const gVal = 128 - (ny * 127);

      const i = (y * size + x) * 4;
      data[i] = Math.max(0, Math.min(255, rVal));
      data[i + 1] = Math.max(0, Math.min(255, gVal));
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

function injectLiquidGlassSVG() {
  if (document.getElementById('yt-liquid-glass-svg')) return;

  const displacementMapUrl = createLensDisplacementMap();

  const svg = document.createElement('div');
  svg.id = 'yt-liquid-glass-svg';
  // Use preserveAspectRatio="none" so the mathematically perfect lens stretches seamlessly into any container (like the pill-shaped search bar)
  svg.innerHTML = `
    <svg style="width: 0; height: 0; position: absolute; pointer-events: none;" xmlns="http://www.w3.org/2000/svg">
      <filter id="yt-glass-blur" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
        <!-- 1. Base ambient blur -->
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
        
        <!-- 2. True mathematical lens normal map (replaces feTurbulence noise) -->
        <feImage href="${displacementMapUrl}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="lens_map" />
        
        <!-- 3. Displace (magnify) using the lens map -->
        <feDisplacementMap in="blur" in2="lens_map" scale="25" xChannelSelector="R" yChannelSelector="G" result="displaced" />
        
        <!-- 4. Boost saturation (Apple liquid glass hallmark) -->
        <feColorMatrix in="displaced" type="saturate" values="1.5" />
      </filter>
    </svg>
  `;
  document.body.appendChild(svg);
}

let ytGridHoverObserver = null;
let ytGridOverlayEventsAdded = false;

function setupHoverZoom() {
  const existing = document.getElementById('yt-hover-zoom-overlay');
  if (!existing) {
    const overlay = document.createElement('div');
    overlay.id = 'yt-hover-zoom-overlay';
    overlay.className = 'yt-grid-hover-zoom';
    overlay.style.position = 'fixed';
    overlay.style.display = 'none';
    overlay.style.pointerEvents = 'auto';
    overlay.style.zIndex = '2147483647';
    document.body.appendChild(overlay);
  }

  bindCards();

  if (!ytGridHoverObserver) {
    ytGridHoverObserver = new MutationObserver(() => bindCards());
    ytGridHoverObserver.observe(document.body, { childList: true, subtree: true });
  }

  if (!ytGridOverlayEventsAdded) {
    window.addEventListener('scroll', () => {
      const overlay = document.getElementById('yt-hover-zoom-overlay');
      if (overlay) overlay.classList.remove('is-visible');
    }, true);
    window.addEventListener('resize', () => {
      const overlay = document.getElementById('yt-hover-zoom-overlay');
      if (overlay) overlay.classList.remove('is-visible');
    });
    ytGridOverlayEventsAdded = true;
  }

  const overlay = document.getElementById('yt-hover-zoom-overlay');
  if (overlay && !window.ytGridHoverabilityAdded) {
    overlay.addEventListener('mouseenter', () => {
      clearTimeout(window.ytGridHideTimeout);
    });
    overlay.addEventListener('mouseleave', () => {
      window.ytGridHideTimeout = setTimeout(() => {
        overlay.classList.remove('is-visible');
        overlay.style.display = 'none';
      }, 100);
    });
    window.ytGridHoverabilityAdded = true;
  }
}

function createHoverPreview(card) {
  const isShort = card.querySelector('ytm-shorts-lockup-view-model-v2, ytm-shorts-lockup-view-model, .shortsLockupViewModelHost') !== null;

  const thumbImg = card.querySelector('ytd-thumbnail img, yt-img-shadow img, img');
  const thumbSrc = thumbImg ? (thumbImg.currentSrc || thumbImg.src) : '';
  const durationEl = card.querySelector('ytd-thumbnail-overlay-time-status-renderer span, span.ytd-thumbnail-overlay-time-status-renderer, .ytd-thumbnail-overlay-time-status-renderer span');
  const durationText = durationEl ? durationEl.textContent.trim() : '';
  const titleAnchor = card.querySelector('#video-title, a#video-title, h3 a, h3, .ytLockupMetadataViewModelTitle, .shortsLockupViewModelHostMetadataTitle a');
  const titleText = titleAnchor ? titleAnchor.textContent.trim() : '';
  const titleUrl = titleAnchor ? titleAnchor.href : '';

  let channelText = '';
  let channelUrl = '';
  const channelAnchor = card.querySelector('ytd-channel-name a, ytd-channel-renderer a, #channel-name a, #channel-name yt-formatted-string a, a.yt-simple-endpoint, yt-content-metadata-view-model a, .ytAttributedStringLink');
  if (channelAnchor) {
    channelText = channelAnchor.textContent.trim();
    channelUrl = channelAnchor.href;
  } else {
    // Check multiple channels (avatar-stack)
    const metadataRow = card.querySelector('yt-content-metadata-view-model .ytContentMetadataViewModelMetadataRow');
    if (metadataRow) {
      const textSpans = Array.from(metadataRow.querySelectorAll('span[role="text"]')).map(el => el.textContent.trim());
      if (textSpans.length >= 3) {
        channelText = textSpans.slice(0, -2).join(' '); // everything except views and time
      } else if (textSpans.length > 0) {
        channelText = textSpans[0];
      }
    }
  }

  // Extract all unique avatars (handles single channel and multi-channel collaborations)
  const avatarImgs = Array.from(card.querySelectorAll('yt-avatar-stack-view-model img, yt-avatar-shape img, .ytSpecAvatarShapeImage, .ytCoreImageHost.ytSpecAvatarShapeImage, ytd-channel-name img, ytd-channel-renderer img, #avatar img, img#img, yt-img-shadow img'))
    .map(img => img.currentSrc || img.src)
    .filter(Boolean);
  const avatarSrcs = [...new Set(avatarImgs)]; // deduplicate

  let viewsText = '';
  let publishedText = '';

  if (isShort) {
    const shortsViews = card.querySelector('.shortsLockupViewModelHostOutsideMetadataSubhead span');
    if (shortsViews) viewsText = shortsViews.textContent.trim();
  } else {
    const metadataRow = card.querySelector('yt-content-metadata-view-model .ytContentMetadataViewModelMetadataRow, .ytContentMetadataViewModelMetadataRow, #metadata-line, .metadata-line, ytd-video-meta-block, .ytd-video-meta-block');
    if (metadataRow) {
      const metadataItems = Array.from(metadataRow.querySelectorAll('span, a'))
        .map((el) => {
          if (el.getAttribute('aria-hidden') === 'true') return '';
          if (el.hasAttribute('aria-label')) return el.getAttribute('aria-label').trim();
          return el.textContent.trim();
        })
        .filter(Boolean)
        .filter((text) => !/^[•· - ]+$/.test(text));

      const filteredItems = metadataItems.filter((item) => {
        if (!channelText) return true;
        return item !== channelText && item !== channelText.replace(/\s+/g, ' ');
      });

      if (filteredItems.length >= 2) {
        // ALWAYS grab the last two items, as the preceding ones might be unfiltered multi-channel names
        viewsText = filteredItems[filteredItems.length - 2];
        publishedText = filteredItems[filteredItems.length - 1];
      } else if (filteredItems.length === 1) {
        const single = filteredItems[0];
        if (/views?/i.test(single) || /lakh|million|thousand|k|M/i.test(single)) {
          viewsText = single;
        } else {
          publishedText = single;
        }
      }
    }

    if ((!viewsText || !publishedText) && metadataRow) {
      const metadata = metadataRow.textContent.trim().replace(/\s+/g, ' ');
      const parts = metadata.split(/(?:•|·|\u2022)/).map((part) => part.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const tail = parts.slice(-2);
        viewsText = viewsText || tail[0];
        publishedText = publishedText || tail[1];
      }
    }
  }

  const hideOverlay = () => {
    const o = document.getElementById('yt-hover-zoom-overlay');
    if (o) {
      o.style.display = 'none';
      o.classList.remove('is-visible');
    }
  };

  const wrapper = document.createElement('div');
  wrapper.className = 'yt-grid-card-preview';
  if (isShort) wrapper.classList.add('is-short');

  const thumb = document.createElement('div');
  thumb.className = 'preview-thumb';
  const thumbImage = document.createElement('img');
  thumbImage.src = thumbSrc || '';
  thumbImage.alt = titleText || 'Video thumbnail';

  thumb.appendChild(thumbImage);
  thumb.style.cursor = 'pointer';
  thumb.onclick = (e) => {
    e.preventDefault();
    hideOverlay();
    if (titleAnchor) titleAnchor.click();
  };
  if (durationText) {
    const duration = document.createElement('div');
    duration.className = 'preview-duration';
    duration.textContent = durationText;
    thumb.appendChild(duration);
  }

  const content = document.createElement('div');
  content.className = 'preview-content';

  const title = document.createElement('h3');
  title.className = 'preview-title';
  if (titleUrl) {
    const titleLink = document.createElement('a');
    titleLink.href = titleUrl;
    titleLink.textContent = titleText;
    titleLink.onclick = (e) => {
      e.preventDefault();
      hideOverlay();
      if (titleAnchor) titleAnchor.click();
    };
    title.appendChild(titleLink);
  } else {
    title.style.cursor = 'pointer';
    title.onclick = (e) => {
      e.preventDefault();
      hideOverlay();
      if (titleAnchor) titleAnchor.click();
    };
    title.textContent = titleText;
  }

  const channelRow = document.createElement('div');
  channelRow.className = 'preview-channel';

  if (!isShort) {
    const avatarsContainer = document.createElement('div');
    avatarsContainer.className = 'preview-avatars';
    if (avatarSrcs.length > 0) {
      avatarSrcs.forEach(src => {
        const avatar = document.createElement('img');
        avatar.src = src;
        avatar.alt = 'Channel avatar';
        avatarsContainer.appendChild(avatar);
      });
    } else {
      const avatar = document.createElement('img');
      avatar.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';
      avatar.alt = channelText || 'Channel avatar fallback';
      avatarsContainer.appendChild(avatar);
    }
    channelRow.appendChild(avatarsContainer);
  }
  const channelName = document.createElement('span');
  if (channelUrl) {
    const channelLink = document.createElement('a');
    channelLink.href = channelUrl;
    channelLink.textContent = channelText;
    channelLink.style.color = 'inherit';
    channelLink.style.textDecoration = 'none';
    channelLink.onclick = (e) => {
      e.preventDefault();
      hideOverlay();
      if (channelAnchor) channelAnchor.click();
    };
    channelName.appendChild(channelLink);
  } else {
    channelName.style.cursor = 'pointer';
    channelName.onclick = (e) => {
      e.preventDefault();
      hideOverlay();
      if (channelAnchor) channelAnchor.click();
    };
    channelName.textContent = channelText;
  }
  channelRow.appendChild(channelName);

  if (viewsText || publishedText) {
    const stats = document.createElement('div');
    stats.className = 'preview-stats';
    if (viewsText) {
      const views = document.createElement('span');
      views.className = 'preview-views';
      views.innerHTML = '<span class="preview-views-icon">▶</span> ' + viewsText;
      stats.appendChild(views);
    }
    if (publishedText) {
      const published = document.createElement('span');
      published.textContent = publishedText;
      stats.appendChild(published);
    }
    channelRow.appendChild(stats);
  }

  content.appendChild(title);
  content.appendChild(channelRow);

  wrapper.appendChild(thumb);
  wrapper.appendChild(content);
  return wrapper;
}

function bindCards() {
  const overlay = document.getElementById('yt-hover-zoom-overlay');
  if (!overlay) return;

  const cards = document.querySelectorAll('ytd-rich-item-renderer:not([is-slim-grid]), ytd-video-renderer, ytd-grid-video-renderer');
  cards.forEach((card) => {
    if (card.dataset.ytHoverZoomBound === 'true') return;
    card.dataset.ytHoverZoomBound = 'true';

    const showOverlay = () => {
      const rect = card.getBoundingClientRect();
      const contentEl = card.querySelector('#content');
      const contentRect = contentEl ? contentEl.getBoundingClientRect() : rect;

      const isShort = card.querySelector('ytm-shorts-lockup-view-model-v2, ytm-shorts-lockup-view-model, .shortsLockupViewModelHost') !== null;
      if (isShort) {
        overlay.style.width = `${contentRect.width + 16}px`; // Match card width precisely + padding
      } else {
        overlay.style.width = 'min(560px, calc(100vw - 24px))';
      }

      overlay.innerHTML = '';
      overlay.appendChild(createHoverPreview(card));

      const overlayWidth = overlay.offsetWidth;
      const overlayHeight = overlay.offsetHeight || 300;
      const cardRect = card.getBoundingClientRect();
      let left = cardRect.left + (cardRect.width - overlayWidth) / 2;
      if (left < 8) left = 8;
      if (left + overlayWidth > window.innerWidth - 8) left = window.innerWidth - overlayWidth - 8;
      let top = cardRect.top - overlayHeight - 10;
      if (top < 8) top = cardRect.bottom + 10;

      overlay.style.width = overlayWidth + 'px';
      overlay.style.left = Math.round(left) + 'px';
      overlay.style.top = Math.round(top) + 'px';
      overlay.style.display = 'block';
      overlay.classList.add('is-visible');
    };

    const hideOverlay = () => {
      overlay.classList.remove('is-visible');
      overlay.style.display = 'none';
    };

    card.addEventListener('mousemove', (e) => {
      // Only trigger if hovering over the title or the metadata (views count) block, supporting both legacy and new view-model DOM
      if (e.target.closest('#video-title, #video-title-link, .ytLockupMetadataViewModelTitle, .ytLockupMetadataViewModelHeadingReset, ytd-video-meta-block, #metadata-line, yt-content-metadata-view-model, .ytContentMetadataViewModelMetadataRow, .shortsLockupViewModelHostMetadataTitle, .shortsLockupViewModelHostOutsideMetadataSubhead')) {
        clearTimeout(window.ytGridHideTimeout);
        showOverlay();
      } else {
        clearTimeout(window.ytGridHideTimeout);
        window.ytGridHideTimeout = setTimeout(hideOverlay, 100);
      }
    });
    card.addEventListener('mouseleave', () => {
      clearTimeout(window.ytGridHideTimeout);
      window.ytGridHideTimeout = setTimeout(hideOverlay, 100);
    });
  });
}

// initial observer to reapply layout on DOM changes
const initialObserver = new MutationObserver(function (mutations) {
  chrome.storage.sync.get(['itemsPerRow'], function (result) {
    updateGridLayout(result.itemsPerRow || 4);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  initialObserver.observe(document.body, { childList: true, subtree: true });
});

// Global tracker for YouTube SPA navigation to detect the Watch page
const updatePageClass = () => {
  if (window.location.pathname === '/watch') {
    document.body.classList.add('yt-watch-page');
  } else {
    document.body.classList.remove('yt-watch-page');
  }
};
document.addEventListener('yt-navigate-finish', updatePageClass);
// Run initially
updatePageClass();
