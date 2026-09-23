/**
 * <back-to-kidashi-tab> — sticky side-tab button, fixed to the left edge of
 * the viewport on every page. Fully self-contained (Shadow DOM), so it can
 * be dropped into any page with a single <script> include + one tag, with
 * no CSS duplication and no risk of clashing with the host page's styles.
 *
 * Usage:
 *   <script src="js/back-to-kidashi-tab.js" defer></script>
 *   ...
 *   <back-to-kidashi-tab></back-to-kidashi-tab>
 *
 * Optional: override the target URL via the "url" attribute, e.g.
 *   <back-to-kidashi-tab url="https://www.kidashidesign.com/"></back-to-kidashi-tab>
 */
(function () {
  const DEFAULT_URL = "https://www.kidashidesign.com/";
  const GREEN = "#CBCFAE";
  const GREEN_HOVER = "#B4B896";

  const TEMPLATE = document.createElement("template");
  TEMPLATE.innerHTML = `
    <style>
      :host {
        position: fixed;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        z-index: 9999;
        display: block;
      }

      a {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-height: 44px;
        padding: 0.75rem 1.25rem 0.75rem 1rem;
        background: ${GREEN};
        color: #ffffff;
        font-family: "Helvetica Neue", Arial, sans-serif;
        font-weight: 700;
        font-size: 0.85rem;
        letter-spacing: 0.01em;
        text-decoration: none;
        white-space: nowrap;
        border-radius: 0 999px 999px 0;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.25);
        transition: transform 0.2s ease, background-color 0.2s ease;
      }

      a:hover,
      a:focus-visible {
        transform: translateX(4px);
        background: ${GREEN_HOVER};
      }

      a:focus-visible {
        outline: 2px solid #ffffff;
        outline-offset: 2px;
      }

      svg {
        flex-shrink: 0;
        width: 14px;
        height: 14px;
      }

      @media (max-width: 600px) {
        a {
          padding: 0.6rem 0.85rem 0.6rem 0.65rem;
          font-size: 0.72rem;
          gap: 0.35rem;
        }

        svg {
          width: 12px;
          height: 12px;
        }
      }
    </style>
    <a part="link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      <span>Back to Kidashi Design</span>
    </a>
  `;

  class BackToKidashiTab extends HTMLElement {
    static get observedAttributes() {
      return ["url"];
    }

    connectedCallback() {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" }).appendChild(
          TEMPLATE.content.cloneNode(true)
        );
      }
      this._updateHref();
    }

    attributeChangedCallback() {
      this._updateHref();
    }

    _updateHref() {
      const link = this.shadowRoot && this.shadowRoot.querySelector("a");
      if (!link) return;
      link.href = this.getAttribute("url") || DEFAULT_URL;
    }
  }

  if (!customElements.get("back-to-kidashi-tab")) {
    customElements.define("back-to-kidashi-tab", BackToKidashiTab);
  }
})();
