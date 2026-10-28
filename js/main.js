const BENTO_COLS = 4;

// Desktop bento layout: portrait = 1x2, landscape = 2x2, plus occasional larger
// feature tiles. Tiles are placed on an occupancy grid; whenever a gap would be
// left, the next artwork that fits is pulled forward so the grid stays closed.
function layoutBento(items) {
  const occupied = [];
  const isFree = (r, c, rs, cs) => {
    if (c + cs > BENTO_COLS) return false;
    for (let y = r; y < r + rs; y++)
      for (let x = c; x < c + cs; x++) if (occupied[y] && occupied[y][x]) return false;
    return true;
  };
  const sizeOf = (art, index) => {
    const landscape = art.width >= art.height;
    if (index % 8 === 4 && index < items.length - 12) return landscape ? { cs: 3, rs: 3 } : { cs: 2, rs: 4 };
    return landscape ? { cs: 2, rs: 2 } : { cs: 1, rs: 2 };
  };

  const remaining = items.map((art, i) => ({ art, size: sizeOf(art, i) }));
  const placed = [];
  while (remaining.length) {
    let r = 0, c = 0;
    outer: for (r = 0; ; r++)
      for (c = 0; c < BENTO_COLS; c++) if (!(occupied[r] && occupied[r][c])) break outer;

    let pick = remaining.findIndex((t) => isFree(r, c, t.size.rs, t.size.cs));
    if (pick === -1) pick = remaining.findIndex((t) => isFree(r, c, 2, 1) && t.size.cs === 1);
    if (pick === -1) {
      // Nothing fits this slot; leave it empty and move on
      (occupied[r] = occupied[r] || [])[c] = true;
      continue;
    }
    const tile = remaining.splice(pick, 1)[0];
    for (let y = r; y < r + tile.size.rs; y++) {
      occupied[y] = occupied[y] || [];
      for (let x = c; x < c + tile.size.cs; x++) occupied[y][x] = true;
    }
    placed.push({ ...tile, row: r + 1, col: c + 1 });
  }
  return placed;
}

function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = layoutBento(artworks)
    .map(({ art, size, row, col }) => {
      const orientation = art.width >= art.height ? "landscape" : "portrait";
      const feature = size.cs > 2 || size.rs > 2 ? " is-feature" : "";
      return `
      <figure class="artwork-card ${orientation}${feature}" style="--col:${col};--row:${row};--cs:${size.cs};--rs:${size.rs}">
        <img class="artwork-image" src="${art.image}" width="${art.width}" height="${art.height}" alt="${art.title}" loading="lazy" decoding="async">
        <figcaption class="artwork-info">
          <h3>${art.title}</h3>
          <p>${art.artist}</p>
        </figcaption>
      </figure>`;
    })
    .join("");
}

// Spotlight: only one artwork is sharp and zoomed at a time. Scrolling walks
// through the artworks one after another in reading order (row by row); a moving
// mouse pointer takes over and highlights the artwork it is resting on.
function setupSpotlight() {
  const grid = document.getElementById("galleryGrid");
  const cards = Array.from(grid.children);
  if (!cards.length) return;
  grid.classList.add("spotlight");

  let triggers = [];
  let active = -1;
  let mode = "scroll";
  let queued = false;

  const docTop = (el) => {
    let y = 0;
    for (; el; el = el.offsetParent) y += el.offsetTop;
    return y;
  };

  // Each artwork gets an anchor position: its vertical centre, pushed down where
  // needed so artworks sharing a row still take turns instead of switching all
  // at once. The artwork whose position is closest to the screen centre is active.
  function measure() {
    const step = Math.min(Math.max(window.innerHeight * 0.1, 60), 140);
    let prev = -Infinity;
    triggers = cards.map((card) => {
      prev = Math.max(docTop(card) + card.offsetHeight / 2, prev + step);
      return prev;
    });
  }

  function setActive(i) {
    if (i === active) return;
    if (active >= 0) cards[active].classList.remove("is-active");
    cards[i].classList.add("is-active");
    active = i;
  }

  function update() {
    queued = false;
    if (mode !== "scroll") return;
    const anchor = window.scrollY + window.innerHeight / 2;
    let i = 0;
    while (i + 1 < triggers.length && anchor - triggers[i] > triggers[i + 1] - anchor) i++;
    setActive(i);
  }

  function request() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", () => { mode = "scroll"; request(); }, { passive: true });
  window.addEventListener("resize", () => { measure(); request(); });
  window.addEventListener("load", () => { measure(); request(); });

  // Browsers fire a synthetic pointermove after scrolling; those repeat the
  // previous coordinates and must not hand control back to the pointer.
  let lastX = null, lastY = null;
  document.addEventListener("pointermove", (e) => {
    const moved = e.clientX !== lastX || e.clientY !== lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    if (!moved || e.pointerType === "touch") return;
    const card = e.target.closest && e.target.closest(".artwork-card");
    if (!card) return;
    mode = "pointer";
    setActive(cards.indexOf(card));
  }, { passive: true });

  measure();
  update();
}

function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  toggle.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => links.classList.remove("open"))
  );
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    note.textContent = "Thanks for reaching out — we'll get back to you soon.";
    form.reset();
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
renderGallery();
setupSpotlight();
setupNav();
setupContactForm();
