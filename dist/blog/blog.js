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
  const response = await fetch('./posts.json');
  if (!response.ok) throw new Error(`Posts request failed: ${response.status}`);

  const metas = await response.json();
  if (!Array.isArray(metas)) return [];

  const posts = await Promise.all(metas.map(async meta => {
    const markdownResponse = await fetch(`./posts/${encodeURIComponent(meta.slug)}.md`);
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
  if (stored.length) return stored;
  return loadPublishedBlogPosts();
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

const blogGrid = document.getElementById('blogGrid');
const postShell = document.getElementById('postShell');
const postTitle = document.getElementById('postTitle');
const postMeta = document.getElementById('postMeta');
const postTags = document.getElementById('postTags');
const postBody = document.getElementById('postBody');

function parseFrontmatter(markdown){
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, body: markdown };

  const frontmatter = match[1].split('\n').reduce((acc, line) => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) return acc;
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    acc[key] = value;
    return acc;
  }, {});

  return { data: frontmatter, body: match[2].trim() };
}

function parseTags(rawTags){
  if (!rawTags) return [];
  return String(rawTags)
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
}

function renderPostList(posts){
  if (!blogGrid) return;

  blogGrid.innerHTML = posts.map(post => {
    const tags = Array.isArray(post.tags) ? post.tags : [];
    return `
      <a class="work-card blog-card reveal" href="?post=${encodeURIComponent(post.slug)}">
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
}

async function loadPosts(){
  const response = await fetch('./posts.json');
  if (!response.ok) throw new Error(`Posts request failed: ${response.status}`);
  const posts = await response.json();
  return Array.isArray(posts) ? posts : [];
}

async function loadPost(slug, posts){
  if (!postShell || !postTitle || !postMeta || !postTags || !postBody) return;

  const meta = posts.find(post => post.slug === slug);
  if (!meta) return;

  let body = meta.body;
  let data = {};
  if (!body) {
    const response = await fetch(`./posts/${encodeURIComponent(slug)}.md`);
    if (!response.ok) throw new Error(`Markdown request failed: ${response.status}`);
    const markdown = await response.text();
    const parsed = parseFrontmatter(markdown);
    data = parsed.data;
    body = parsed.body;
  }

  const title = data.title || meta.title;
  const date = data.date || meta.date;
  const excerpt = data.excerpt || meta.excerpt;
  const author = data.author || meta.author || 'Om Sudhamsh';
  const tags = parseTags(data.tags).length ? parseTags(data.tags) : (Array.isArray(meta.tags) ? meta.tags : []);

  document.title = `${title} — Writing`;
  postShell.hidden = false;
  postTitle.textContent = title;
  postMeta.innerHTML = [formatDate(date), author, meta.readTime || '3 min read', excerpt]
    .filter(Boolean)
    .map(item => `<span>${escapeHtml(item)}</span>`)
    .join('');
  postTags.innerHTML = tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
  postBody.innerHTML = marked.parse(body || '');

  postShell.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function initBlog(){
  try {
    const posts = (await loadBlogPosts()).sort((left, right) => new Date(right.date) - new Date(left.date));
    renderPostList(posts);

    const searchParams = new URLSearchParams(window.location.search);
    const slug = searchParams.get('post');
    if (slug){
      await loadPost(slug, posts);
    }
  } catch (error) {
    if (blogGrid) {
      blogGrid.innerHTML = '<p class="section-line reveal in-view">Writing is loading right now.</p>';
    }
    console.warn('Blog page could not be initialized.', error);
  }
}

initBlog();

window.addEventListener('storage', event => {
  if (event.key === BLOG_STORAGE_KEY) initBlog();
});
window.addEventListener('blog:data-change', initBlog);

document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.rel = 'noopener noreferrer';
});