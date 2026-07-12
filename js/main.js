function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = artworks
    .map(
      (art) => `
      <div class="artwork-card">
        <div class="artwork-image" style="background-image: url('${art.image}');"></div>
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
