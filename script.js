// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // --- Welcome Popup Logic ---
  // Get references to popup modal, main content, greeting/heading/tagline elements
  const popup = document.getElementById("welcomePopup");
  const mainContent = document.getElementById("mainContent");
  const exploreBtn = document.getElementById("exploreBtn");
  const greetingElement = document.getElementById("type-greeting");
  const headingElement = document.getElementById("type-heading");
  const taglineElement = document.getElementById("type-tagline");

  // Show popup if not already seen in this session, else show main content and start typing effect
  if (!sessionStorage.getItem("seenPopup")) {
    if (popup) popup.style.display = "flex";
    if (mainContent) mainContent.style.display = "none";
  } else {
    if (popup) popup.style.display = "none";
    if (mainContent) mainContent.style.display = "block";
    startTyping(); // begin the typing animation on page load
  }

  // 'Explore' button closes popup, shows main content, starts typing, and sets session flag
  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
      popup.style.display = "none";
      mainContent.style.display = "block";
      sessionStorage.setItem("seenPopup", "true");
      startTyping();
    });
  }

  // Array of rotating "roles" shown under the heading as dynamic tagline
  const roles = [
    ">>> #Creative Coder",
    ">>> #Python Enthusiast",
    ">>> #Web Developer in Progress",
    ">>> #Aspiring Data Scientist",
    ">>> #Learner at IITM BS Program"
  ];
  let roleIndex = 0;

  // Utility: type one character at a time for typing animation
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

  // Starts the greeting/heading/tagline typing sequence
  function startTyping() {
    const hour = new Date().getHours();
    let greet = "Hi there 👋";
    if (hour >= 0 && hour < 12) greet = "Good Morning ☀️";
    else if (hour >= 12 && hour < 17) greet = "Good Afternoon 🌞";
    else if (hour >= 17 && hour <= 24) greet = "Good Evening 🌆";
    else greet = "Good Evening 🌆";

    typeText(greetingElement, greet, 60, () => {
      typeText(headingElement, " I'm Nikhil Kumar Shah", 50, () => {
        rotateRoles();
      });
    });
  }

  // Rotates the tagline (the role labels) with a typing animation
  function rotateRoles() {
    if (!taglineElement) return;
    typeText(taglineElement, roles[roleIndex], 40, () => {
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(rotateRoles, 1800);
    });
  }

  // --- Navbar: Highlight the current active page ---
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar a").forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });

  // --- Skills Page: Tab Switching Logic ---
  // Uses global function for tab navigation (compatible with inline HTML 'onclick')
  window.openTab = function (evt, tabName) {
    document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active-tab"));
    document.querySelectorAll(".tab-btn").forEach(button => button.classList.remove("active"));
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) selectedTab.classList.add("active-tab");
    evt.currentTarget.classList.add("active");
  };

  // --- Project Filter Buttons Logic ---
  // Filters project cards by category (web-dev, python, etc)
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

  // --- Project Card Modal Logic ---
  // Clicking a card opens modal with project info/screenshots
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

  // Close the project modal if user clicks the background (outside modal-content)
  window.addEventListener("click", e => {
    const modal = document.getElementById("newProjectModal");
    if (e.target === modal) closeNewModal();
  });

  // --- Hamburger Nav Toggle (for mobile) ---
  const toggle = document.querySelector('.navbar-toggle');
  const menu = document.querySelector('.navbar-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
  }

  // Wait for the document to be fully loaded
  document.addEventListener("DOMContentLoaded", () => {
    // --- Skills Page: Tab Switching Logic ---
    // Uses global function for tab navigation (compatible with inline HTML 'onclick')
    window.openTab = function (evt, tabName) {
      document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active-tab"));
      document.querySelectorAll(".tab-btn").forEach(button => button.classList.remove("active"));
      const selectedTab = document.getElementById(tabName);
      if (selectedTab) selectedTab.classList.add("active-tab");
      evt.currentTarget.classList.add("active");
    };
  });
});


// ===================== MODAL FUNCTIONS =====================

// Opens project detail modal with title, description, images, and links
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

  // Add images with click-to-enlarge handler
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
  // Show modal by toggling the active class (CSS handles centering)
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  const content = modal.querySelector('.new-modal-content');
  if (content) { content.setAttribute('tabindex', '-1'); content.focus(); }
}

// Closes the "new project" modal
function closeNewModal() {
  const modal = document.getElementById("newProjectModal");
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    const imagesEl = document.getElementById('newModalImages');
    if (imagesEl) imagesEl.innerHTML = '';
  }
}

// Close project modal on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    const modal = document.getElementById('newProjectModal');
    if (modal && modal.classList.contains('active')) closeNewModal();
  }
});

// ========== General Modal Open/Close for Certifications, etc ==========
// Opens modal by id and traps focus for accessibility
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    // Trap focus on modal for accessibility
    modal.querySelector('.modal-content').focus();
    document.body.style.overflow = "hidden";
  }
}

// Closes modal by id and restores scroll
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = "";
  }
}

// Close modal when clicking outside the modal-content area
document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) { // only close when clicking the overlay
      overlay.classList.remove('active');
      document.body.style.overflow = "";
    }
  });
});

// Closes any open modal on ESC key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    document.querySelectorAll('.modal-overlay.active').forEach(function (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = "";
    });
  }
});

// ===================== IMAGE VIEWER/POPUP FUNCTIONS =====================

// Opens popup overlay for large image view
function openImagePopup(src) {
  const popup = document.getElementById("imagePopup");
  // Support for both 'popupImg' and 'popupImage' ids for backward-compatibility
  const img = document.getElementById("popupImg") || document.getElementById("popupImage");
  if (img) img.src = src;
  if (popup) popup.style.display = "flex";
}

// Close popup viewer from anywhere outside the image or on event
function closeImagePopup(event) {
  if (event) event.preventDefault();
  document.getElementById("imagePopup").style.display = "none";
}

// Clicking the popup outside the image also closes it
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("imagePopup");
  if (popup) {
    popup.addEventListener("click", function (e) {
      const img = document.getElementById("popupImg") || document.getElementById("popupImage");
      if (!img.contains(e.target)) {
        popup.style.display = "none";
      }
    });
  }
});


