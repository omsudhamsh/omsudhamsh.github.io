// ============================================================
// NAV: scroll shrink + progress bar
// ============================================================
const nav = document.getElementById('nav');
const progressBar = document.getElementById('progressBar');
const BLOG_STORAGE_KEY = 'portfolio-blog-posts-v1';

function escapeHtml(value){
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

function formatDate(value){
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value ?? '');
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function parseBlogMarkdown(markdown){
  const match = String(markdown ?? '').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const frontmatter = {};
  let body = String(markdown ?? '').trim();

  if (match){
    body = match[2].trim();
    match[1].split('\n').forEach(line => {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) return;
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      frontmatter[key] = value;
    });
  }

  return { frontmatter, body };
}

function normalizeBlogPost(post = {}){
  return {
    title: String(post.title ?? '').trim(),
    date: String(post.date ?? '').trim(),
    author: String(post.author ?? 'Om Sudhamsh').trim() || 'Om Sudhamsh',
    excerpt: String(post.excerpt ?? '').trim(),
    tags: Array.isArray(post.tags) ? post.tags : String(post.tags ?? '').split(',').map(tag => tag.trim()).filter(Boolean),
    slug: String(post.slug ?? '').trim(),
    readTime: String(post.readTime ?? '4 min read').trim() || '4 min read',
    body: String(post.body ?? '').trim()
  };
}

function loadStoredBlogPosts(){
  try {
    const raw = localStorage.getItem(BLOG_STORAGE_KEY);
    const posts = raw ? JSON.parse(raw) : [];
    return Array.isArray(posts) ? posts.map(normalizeBlogPost) : [];
  } catch (error) {
    console.warn('Stored blog posts could not be read.', error);
    return [];
  }
}

function saveStoredBlogPosts(posts){
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
}

async function loadPublishedBlogPosts(){
  const response = await fetch('./blog/posts.json');
  if (!response.ok) throw new Error(`Blog index request failed: ${response.status}`);

  const metas = await response.json();
  if (!Array.isArray(metas)) return [];

  const posts = await Promise.all(metas.map(async meta => {
    const markdownResponse = await fetch(`./blog/posts/${encodeURIComponent(meta.slug)}.md`);
    const markdown = markdownResponse.ok ? await markdownResponse.text() : '';
    const parsed = parseBlogMarkdown(markdown);
    return normalizeBlogPost({
      title: meta.title || parsed.frontmatter.title || '',
      date: meta.date || parsed.frontmatter.date || '',
      author: parsed.frontmatter.author || 'Om Sudhamsh',
      excerpt: meta.excerpt || parsed.frontmatter.excerpt || '',
      tags: meta.tags || parsed.frontmatter.tags || [],
      slug: meta.slug || '',
      readTime: meta.readTime || parsed.frontmatter.readTime || '4 min read',
      body: parsed.body || ''
    });
  }));

  saveStoredBlogPosts(posts);
  return posts;
}

async function loadBlogPosts(){
  const stored = loadStoredBlogPosts();
  try {
    const published = await loadPublishedBlogPosts();
    const storedBySlug = new Map(stored.filter(post => post.slug).map(post => [post.slug, post]));
    return published.map(post => {
      const local = storedBySlug.get(post.slug);
      if (!local) return post;
      return { ...post, ...local, body: local.body || post.body };
    }).concat(stored.filter(post => post.slug && !published.some(item => item.slug === post.slug)));
  } catch (error) {
    if (stored.length) return stored;
    throw error;
  }
}

function onScroll(){
  const scrolled = window.scrollY;
  nav.classList.toggle('scrolled', scrolled > 40);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

// ============================================================
// MOBILE MENU
// ============================================================
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (navToggle && mobileMenu){
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    const isOpen = mobileMenu.classList.contains('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold:0.15 });
revealEls.forEach(el => revealObserver.observe(el));

function observeRevealTargets(root){
  root.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('in-view')) revealObserver.observe(el);
  });
}

// ============================================================
// HERO PHOTO COLOR SPOTLIGHT
// ============================================================
const heroPhoto = document.querySelector('.hero-photo');

if (heroPhoto){
  heroPhoto.addEventListener('pointermove', (e) => {
    const rect = heroPhoto.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    heroPhoto.style.setProperty('--spot-x', `${x}%`);
    heroPhoto.style.setProperty('--spot-y', `${y}%`);
  });
}

// ============================================================
// TYPING EFFECT
// ============================================================
const typingEl = document.querySelector('.typing');
if (typingEl){
  const words = JSON.parse(typingEl.dataset.words);
  let wordIndex = 0, charIndex = 0, deleting = false;

  function type(){
    const current = words[wordIndex];
    if (!deleting){
      charIndex++;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length){
        deleting = true;
        setTimeout(type, 1400);
        return;
      }
    } else {
      charIndex--;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0){
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? 40 : 70);
  }
  type();
}

// ============================================================
// STAT COUNTERS
// ============================================================
const statEls = document.querySelectorAll('.stat h3');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const tick = () => {
        current = Math.min(target, current + step);
        el.textContent = current;
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
      statObserver.unobserve(el);
    }
  });
}, { threshold:0.5 });
statEls.forEach(el => statObserver.observe(el));

// ============================================================
// PROJECT FILTER
// ============================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    workCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
    });
  });
});

// ============================================================
// SKILLS TABS
// ============================================================
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`);
    if (panel) panel.classList.add('active');
  });
});

// ============================================================
// MAGNETIC BUTTONS
// ============================================================
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

// ============================================================
// BLOG PREVIEWS
// ============================================================
const blogGrid = document.getElementById('blogGrid');

async function renderBlogPreviews(){
  if (!blogGrid) return;

  try {
    const previews = (await loadBlogPosts()).slice(0, 3);

    blogGrid.innerHTML = previews.map(post => {
      const tags = Array.isArray(post.tags) ? post.tags : [];
      return `
        <a class="work-card blog-card reveal" href="./blog/?post=${encodeURIComponent(post.slug)}">
          <div class="work-num">${escapeHtml(formatDate(post.date))}</div>
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.excerpt)}</p>
          <div class="blog-meta">
            <span>${escapeHtml(formatDate(post.date))}</span>
            <span>${escapeHtml(post.author || 'Om Sudhamsh')}</span>
            <span>${escapeHtml(post.readTime || '3 min read')}</span>
          </div>
          <div class="tag-row">
            ${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}
          </div>
        </a>
      `;
    }).join('');

    observeRevealTargets(blogGrid);
  } catch (error) {
    blogGrid.classList.add('in-view');
    blogGrid.innerHTML = '<p class="section-line">Writing is loading right now.</p>';
    console.warn('Blog previews could not be loaded.', error);
  }
}

renderBlogPreviews();

window.addEventListener('storage', event => {
  if (event.key === BLOG_STORAGE_KEY) renderBlogPreviews();
});
window.addEventListener('blog:data-change', renderBlogPreviews);

// ============================================================
// FOOTER YEAR
// ============================================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================================
// EXTERNAL LINK SAFETY
// ============================================================
document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.rel = 'noopener noreferrer';
});
