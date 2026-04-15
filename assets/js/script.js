document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const pages = document.querySelectorAll('[data-page]');
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');

  // Custom Cursor Logic
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Check if cursor is out of bounds or invisible
    if (x <= 0 || y <= 0 || x >= window.innerWidth || y >= window.innerHeight) {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    } else {
      cursor.style.opacity = '1';
      follower.style.opacity = '0.5';
    }

    // Smooth movement with requestAnimationFrame for performance
    requestAnimationFrame(() => {
      cursor.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
      follower.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
    });
  });

  // Handle cursor leaving the window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '0.5';
  });

  // Adding hover effects to all interactive elements
  const interactives = document.querySelectorAll('a, button, .project-card, .gallery-item, .cert-card, .edu-card');
  
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      follower.style.opacity = '1';
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      follower.style.opacity = '0.5';
    });
  });

  // Click effect
  document.addEventListener('mousedown', () => cursor.classList.add('cursor-clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('cursor-clicking'));

  // Theme Switching Logic
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      
      // Update UI
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update Body Class
      document.body.className = ''; // Reset
      if (theme !== 'default') {
        document.body.classList.add(`${theme}-theme`);
      }
      
      // Save Preference
      localStorage.setItem('portfolio-theme', theme);
    });
  });

  // Restore Theme Preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme && savedTheme !== 'default') {
    const activeBtn = document.querySelector(`.theme-btn[data-theme="${savedTheme}"]`);
    if (activeBtn) activeBtn.click();
  }

  // Typing Effect Logic
  const typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    const words = JSON.parse(typingElement.dataset.words);
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 150;

    function type() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 100;
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 150;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }
    
    type();
  }

  // Project Filtering Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Update UI
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter Cards
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Scroll Progress Logic
  const scrollProgress = document.querySelector('.scroll-progress');
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) scrollProgress.style.width = scrolled + "%";
  });

  // Skills Animation (Progress Bars & Counter)
  const skillsSection = document.querySelector('#skills');
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateSkills = () => {
    if (animated) return;

    // Animate Counters
    statNumbers.forEach(num => {
      const target = +num.dataset.target;
      let count = 0;
      const speed = target / 50;
      
      const updateCount = () => {
        if (count < target) {
          count += speed;
          num.innerText = Math.ceil(count) + (target > 50 ? '%' : '+');
          setTimeout(updateCount, 20);
        } else {
          num.innerText = target + (target > 50 ? '%' : '+');
        }
      };
      updateCount();
    });

    animated = true;
  };

  // Trigger animation when skills section is visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) animateSkills();
  }, { threshold: 0.3 });

  if (skillsSection) observer.observe(skillsSection);

  // Dynamic Content Loading Logic
  function loadDynamicContent() {
    // Projects
    const projectsGrid = document.querySelector('#projects .grid');
    if (projectsGrid) {
      // Clear or prevent double-loading if necessary (optional)
      // projectsGrid.innerHTML = '';
      
      const dynamicProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      dynamicProjects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.category = p.category;
        card.innerHTML = `
          <h3 class="project-title">${p.title}</h3>
          <div class="project-tags">
            ${p.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
          </div>
          <div class="project-desc"><ul><li>${p.description}</li></ul></div>
          <div class="project-links">
            ${p.link ? `<a href="${p.link}" class="project-link" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
          </div>
        `;
        projectsGrid.appendChild(card);
      });
    }

    // Skills
    const dynamicSkills = JSON.parse(localStorage.getItem('skills') || '[]');
    const skillsContainer = document.querySelector('#skills');
    
    if (skillsContainer) {
      dynamicSkills.forEach(s => {
        let group = Array.from(skillsContainer.querySelectorAll('.skill-group')).find(g => g.querySelector('h3').textContent.trim() === s.category);
        if (!group) {
          group = document.createElement('div');
          group.className = 'skill-group';
          group.innerHTML = `<h3>${s.category}</h3><div class="badges-container"></div>`;
          skillsContainer.appendChild(group);
        }
        const container = group.querySelector('.badges-container');
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = s.name;
        container.appendChild(badge);
      });
    }

    // Gallery
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
      const dynamicGallery = JSON.parse(localStorage.getItem('gallery') || '[]');
      dynamicGallery.forEach(g => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
          <img src="${g.url}" alt="${g.title}" class="gallery-img">
          <div class="gallery-overlay">
            <h3 class="gallery-title">${g.title}</h3>
          </div>
        `;
        galleryGrid.appendChild(item);
      });
    }

    // Re-attach hover effects for ALL elements including dynamic ones
    const allInteractives = document.querySelectorAll('a, button, .project-card, .gallery-item, .cert-card, .edu-card, .badge');
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    allInteractives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (cursor) cursor.classList.add('cursor-hover');
        if (follower) follower.style.opacity = '1';
      });
      el.addEventListener('mouseleave', () => {
        if (cursor) cursor.classList.remove('cursor-hover');
        if (follower) follower.style.opacity = '0.5';
      });
    });
  }

  loadDynamicContent();

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetPage = link.textContent.trim().toLowerCase();

      navLinks.forEach(nav => nav.classList.remove('active'));
      link.classList.add('active');

      pages.forEach(page => {
        if (page.dataset.page === targetPage) {
          page.classList.add('active');
        } else {
          page.classList.remove('active');
        }
      });
    });
  });
});

'use strict';

// element toggle function
function elementToggleFunc(elem) {
  elem.classList.toggle("active");
}

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
function testimonialsModalFunc() {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();
  });
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () {
  elementToggleFunc(this);
});

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = ["about", "resume", "projects", "gallery", "blog", "socials"];

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const buttonText = this.innerHTML.toLowerCase();
    
    // Special handling for Blog / NL button
    if (buttonText.includes("blog")) {
      // First activate the blog section
      for (let i = 0; i < pages.length; i++) {
        if (pages[i] === "blog") {
          document.querySelector(`[data-page="${pages[i]}"]`).classList.add("active");
          navigationLinks[i].classList.add("active");
          window.scrollTo(0, 0);
        } else {
          document.querySelector(`[data-page="${pages[i]}"]`).classList.remove("active");
          navigationLinks[i].classList.remove("active");
        }
      }
      
      // Then navigate to the latest blog post
      const latestBlogPost = document.querySelector('.blog-post-item > a');
      if (latestBlogPost) {
        window.open(latestBlogPost.href, '_blank');
      }
    } else {
      // Handle other navigation buttons normally
      for (let i = 0; i < pages.length; i++) {
        if (buttonText.includes(pages[i])) {
          document.querySelector(`[data-page="${pages[i]}"]`).classList.add("active");
          navigationLinks[i].classList.add("active");
          window.scrollTo(0, 0);
        } else {
          document.querySelector(`[data-page="${pages[i]}"]`).classList.remove("active");
          navigationLinks[i].classList.remove("active");
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const inputs = document.querySelectorAll("[data-form-input]");
  const submitBtn = document.querySelector("[data-form-btn]");

  // Enable the button when all fields are filled
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      submitBtn.disabled = ![...inputs].every(input => input.value.trim() !== "");
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default page reload

    // Get input values
    const fullName = form.fullname.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!fullName || !email || !message) {
      alert("Please fill out all fields.");
      return;
    }

    // Disable button to prevent multiple submissions
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending...</span>`;

    // Send email via EmailJS
    emailjs.send("service_pbqy81z", "template_jhu9dgt", {
      from_name: fullName,
      from_email: email,
      message: message,
    }, "GY1fgrTq_n7o4yQG7")
    .then(response => {
      alert("Message sent successfully!");
      form.reset(); // Clear form
      submitBtn.innerHTML = `<span>Send Message</span>`;
    })
    .catch(error => {
      console.error("EmailJS Error:", error);
      alert("Failed to send message. Please try again later.");
      submitBtn.disabled = false; // Re-enable button
      submitBtn.innerHTML = `<span>Send Message</span>`;
    });
  });
});

// Initialize projects and gallery sections
function initializeProjects() {
  const projectsGrid = document.querySelector('.projects-grid');
  if (projectsGrid) {
    // Add your project cards here
  }
}

function initializeGallery() {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (galleryGrid) {
    // Add your gallery items here
  }
}

// Initialize sections when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeProjects();
  initializeGallery();
});
