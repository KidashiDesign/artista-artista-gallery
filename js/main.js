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
setupNav();
setupContactForm();
