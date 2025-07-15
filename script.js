document.addEventListener("DOMContentLoaded", () => {
  // --- Welcome Popup ---
  const popup = document.getElementById("welcomePopup");
  const mainContent = document.getElementById("mainContent");
  const exploreBtn = document.getElementById("exploreBtn");
  const greetingElement = document.getElementById("type-greeting");
  const headingElement = document.getElementById("type-heading");
  const taglineElement = document.getElementById("type-tagline");

  if (!sessionStorage.getItem("seenPopup")) {
    if (popup) popup.style.display = "flex";
    if (mainContent) mainContent.style.display = "none";
  } else {
    if (popup) popup.style.display = "none";
    if (mainContent) mainContent.style.display = "block";
    startTyping();
  }

  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
      popup.style.display = "none";
      mainContent.style.display = "block";
      sessionStorage.setItem("seenPopup", "true");
      startTyping();
    });
  }

  const roles = [
    ">>> #Creative Coder",
    ">>> #Python Enthusiast",
    ">>> #Web Developer in Progress",
    ">>> #Aspiring Data Scientist",
    ">>> #Learner at IITM BS Program"
  ];

  let roleIndex = 0;

  function typeText(element, text, speed = 50, callback) {
    if (!element) return;
    element.textContent = "";
    let i = 0;
    const typer = setInterval(() => {
      element.textContent += text.charAt(i++);
      if (i >= text.length) {
        clearInterval(typer);
        if (callback) callback();
      }
    }, speed);
  }

  function startTyping() {
    const hour = new Date().getHours();
    let greet = "Hi there 👋";
    if (hour >= 0 && hour < 12) greet = "Good Morning ☀️";
    else if (hour >= 12 && hour < 17) greet = "Good Afternoon 🌞";
    else if (hour >= 17 && hour <= 24) greet = "Good Evening 🌆";
    else greet = "Good Evening 🌆";
    let hi = "Hi 👋";

    typeText(greetingElement, greet, 60, () => {
      typeText(headingElement, " I'm Nikhil Kumar Shah", 50, () => {
        rotateRoles();
      });
    });
  }


  function rotateRoles() {
    if (!taglineElement) return;
    typeText(taglineElement, roles[roleIndex], 40, () => {
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(rotateRoles, 1800);
    });
  }

  // --- Navbar Highlight ---
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar a").forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });

  // --- Skills Tab Switching ---
  window.openTab = function (evt, tabName) {
    document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active-tab"));
    document.querySelectorAll(".tab-btn").forEach(button => button.classList.remove("active"));
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) selectedTab.classList.add("active-tab");
    evt.currentTarget.classList.add("active");
  };

  // --- Project Filtering ---
  document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter.toLowerCase();
      document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      document.querySelectorAll(".project-card").forEach(card => {
        const categories = card.dataset.category?.toLowerCase().split(" ") || [];
        const show = filter === "all" || categories.includes(filter);
        card.style.display = show ? "flex" : "none";
      });
    });
  });

  // --- Project Modal Handling ---
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
      const title = card.dataset.title || "";
      const description = card.dataset.description || "";
      const github = card.dataset.github || "#";
      const live = card.dataset.live || "#";

      let images = [];
      try {
        images = JSON.parse(card.dataset.images || "[]");
      } catch (e) {
        console.error("Image data format error:", e);
      }

      openNewModal(title, description, images, github, live);
    });
  });

  window.addEventListener("click", e => {
    const modal = document.getElementById("newProjectModal");
    if (e.target === modal) modal.style.display = "none";
  });
});

// --- Modal Open/Close Functions ---
function openNewModal(title, description, imageArray, github, live) {
  const modal = document.getElementById("newProjectModal");
  const titleEl = document.getElementById("newModalTitle");
  const descEl = document.getElementById("newModalDesc");
  const imagesEl = document.getElementById("newModalImages");
  const githubBtn = document.getElementById("newModalGithub");
  const liveBtn = document.getElementById("newModalLive");

  if (!modal || !titleEl || !descEl || !imagesEl || !githubBtn || !liveBtn) return;

  titleEl.textContent = title;
  descEl.textContent = description;
  imagesEl.innerHTML = "";

  imageArray.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${title} screenshot`;
    img.className = "modal-img";
    imagesEl.appendChild(img);
  });

  githubBtn.href = github;
  liveBtn.href = live;
  modal.style.display = "flex";
}
// Open modal by id
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    // Optional: trap focus inside modal for accessibility
    modal.querySelector('.modal-content').focus();
    document.body.style.overflow = "hidden"; // Prevent background scroll
  }
}

// Close modal by id
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ""; // Restore scrolling
  }
}

// Handle click outside modal-content
document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
  overlay.addEventListener('click', function (e) {
    // Only close if click is on the overlay, not modal-content or children
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = "";
    }
  });
});

// Close modal on ESC key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    document.querySelectorAll('.modal-overlay.active').forEach(function (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = "";
    });
  }
});

function closeNewModal() {
  const modal = document.getElementById("newProjectModal");
  if (modal) modal.style.display = "none";
}
function openNewModal(title, description, imageArray, github, live) {
  const modal = document.getElementById("newProjectModal");
  const titleEl = document.getElementById("newModalTitle");
  const descEl = document.getElementById("newModalDesc");
  const imagesEl = document.getElementById("newModalImages");
  const githubBtn = document.getElementById("newModalGithub");
  const liveBtn = document.getElementById("newModalLive");

  titleEl.textContent = title;
  descEl.textContent = description;
  imagesEl.innerHTML = "";

  imageArray.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${title} screenshot`;
    img.className = "modal-img-thumb";
    img.addEventListener("click", () => openImagePopup(src));
    imagesEl.appendChild(img);
  });

  githubBtn.href = github;
  liveBtn.href = live;

  modal.style.display = "flex";
}
function openImagePopup(src) {
  const popup = document.getElementById("imagePopup");
  const img = document.getElementById("popupImage");
  img.src = src;
  popup.style.display = "flex";
}

function closeImagePopup() {
  document.getElementById("imagePopup").style.display = "none";
}
function closeImagePopup(event) {
  if (event) event.preventDefault(); // prevent anchor-style behavior
  document.getElementById("imagePopup").style.display = "none";
}
// Open image popup
function openImagePopup(src) {
  const popup = document.getElementById("imagePopup");
  const img = document.getElementById("popupImg");
  img.src = src;
  popup.style.display = "flex";
}
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.navbar-toggle');
  const menu = document.querySelector('.navbar-menu');

  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
  });
});

// Close image popup when clicking outside image
document.getElementById("imagePopup").addEventListener("click", function (e) {
  const img = document.getElementById("popupImg");
  if (!img.contains(e.target)) {
    this.style.display = "none";
  }
});
new Typed('.typed-text', {
  strings: ["AI Researcher", "ML Developer", "Data Explorer", "Creative Coder"],
  typeSpeed: 50,
  backSpeed: 25,
  loop: true
});
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", function (evt) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active-tab"));
    this.classList.add("active");
    document.getElementById(this.textContent.trim().toLowerCase().replace(/ /g, '-')).classList.add("active-tab");
  });
});
