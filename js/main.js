const artworks = [
  { title: "Fragmented Light", artist: "Mira Solen", hue: "#d9a441" },
  { title: "Silent Horizon", artist: "Kenji Aoto", hue: "#7c9885" },
  { title: "Woven Static", artist: "Ada Row", hue: "#b3564a" },
  { title: "Interior Weather", artist: "Yusuf Karam", hue: "#5b7fb5" },
  { title: "Rift", artist: "Elin Voss", hue: "#a06bb5" },
  { title: "Slow Bloom", artist: "Nadia Efe", hue: "#c98f4e" },
];

function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = artworks
    .map(
      (art) => `
      <div class="artwork-card">
        <div class="artwork-image" style="background: linear-gradient(160deg, ${art.hue}, #0f0f10);"></div>
        <div class="artwork-info">
          <h3>${art.title}</h3>
          <p>${art.artist}</p>
        </div>
      </div>`
    )
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
