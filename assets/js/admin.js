const ADMIN_USER = "admin";
const ADMIN_PASS = "Admin@edit";

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginScreen = document.getElementById('loginScreen');
  const dashboard = document.getElementById('dashboard');
  
  // Migrate existing data from index.html hardcoded values
  migrateExistingValues();

  // Check session
  if (sessionStorage.getItem('admin-auth') === 'true') {
    loginScreen.style.display = 'none';
    dashboard.style.display = 'block';
    renderDashboard();
  }

  // Handle Login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('admin-auth', 'true');
      loginScreen.style.display = 'none';
      dashboard.style.display = 'block';
      renderDashboard();
    } else {
      alert("Invalid credentials");
    }
  });

  // Handle Project Form
  document.getElementById('projectForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const project = {
      id: Date.now(),
      title: document.getElementById('pTitle').value,
      tags: document.getElementById('pTags').value.split(',').map(t => t.trim()),
      description: document.getElementById('pDesc').value,
      link: document.getElementById('pLink').value,
      category: document.getElementById('pCategory').value
    };
    saveItem('projects', project);
    e.target.reset();
    renderDashboard();
  });

  // Handle Skill Form
  document.getElementById('skillForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const skill = {
      id: Date.now(),
      category: document.getElementById('sCategory').value,
      name: document.getElementById('sName').value
    };
    saveItem('skills', skill);
    e.target.reset();
    renderDashboard();
  });

  // Handle Gallery Form
  document.getElementById('galleryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const galleryItem = {
      id: Date.now(),
      title: document.getElementById('gTitle').value,
      url: document.getElementById('gUrl').value
    };
    saveItem('gallery', galleryItem);
    e.target.reset();
    renderDashboard();
  });
});

function migrateExistingValues() {
  if (localStorage.getItem('is_migrated') === 'true') return;

  const existingProjects = [
    {
      id: 1,
      title: "RAG Chatbot Application",
      tags: ["React", "LangChain", "Gemini", "FastAPI"],
      description: "Built conversational AI chatbot using RAG pipeline",
      link: "https://github.com/omsudhamsh/rag-chatbot",
      category: "ai"
    },
    {
      id: 2,
      title: "AskData – AI Data Platform",
      tags: ["React", "FastAPI", "Groq LLM", "SQLite"],
      description: "Converts natural language → SQL queries",
      link: "https://github.com/omsudhamsh/nl-sql",
      category: "ai"
    },
    {
      id: 3,
      title: "Prompt Generator",
      tags: ["React", "Tailwind", "shadcn/ui", "Gemini API"],
      description: "Generates structured prompts for datasets",
      link: "https://github.com/omsudhamsh/prompt-generator",
      category: "web"
    }
  ];

  const existingSkills = [
    { id: 4, category: "GenAI / LLMs", name: "Prompt Engineering" },
    { id: 5, category: "GenAI / LLMs", name: "LangChain" },
    { id: 6, category: "GenAI / LLMs", name: "RAG" },
    { id: 7, category: "ML & NLP", name: "NLP" },
    { id: 8, category: "Frontend", name: "React.js" },
    { id: 9, category: "Programming", name: "Python" }
  ];

  const existingGallery = [
    { id: 10, title: "HackLeague", url: "./assets/images/mlrd.jpg" },
    { id: 11, title: "AI for Good", url: "./assets/images/gal-5.png" },
    { id: 12, title: "AI Day", url: "./assets/images/gal-4.jpg" }
  ];

  // Save all existing data to local storage for administration
  localStorage.setItem('projects', JSON.stringify(existingProjects));
  localStorage.setItem('skills', JSON.stringify(existingSkills));
  localStorage.setItem('gallery', JSON.stringify(existingGallery));
  localStorage.setItem('is_migrated', 'true');
}

function saveItem(key, item) {
  let items = JSON.parse(localStorage.getItem(key) || '[]');
  items.push(item);
  localStorage.setItem(key, JSON.stringify(items));
}

function deleteItem(key, id) {
  let items = JSON.parse(localStorage.getItem(key) || '[]');
  // Convert id to number just in case
  items = items.filter(i => Number(i.id) !== Number(id));
  localStorage.setItem(key, JSON.stringify(items));
  renderDashboard();
}

// Make deleteItem globally accessible for onclick attributes
window.deleteItem = deleteItem;

function renderDashboard() {
  const projectList = document.getElementById('projectList');
  const skillList = document.getElementById('skillList');
  const galleryList = document.getElementById('galleryList');

  // Check if elements exist before rendering
  if (!projectList || !skillList || !galleryList) return;

  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const skills = JSON.parse(localStorage.getItem('skills') || '[]');
  const gallery = JSON.parse(localStorage.getItem('gallery') || '[]');

  projectList.innerHTML = projects.length ? projects.map(p => `
    <div class="dashboard-item">
      <div class="item-info">
        <span class="item-title">${p.title}</span>
        <span class="item-subtitle">${p.category.toUpperCase()} • ${p.tags.join(', ')}</span>
      </div>
      <i class="fas fa-trash delete-item" onclick="window.deleteItem('projects', ${p.id})"></i>
    </div>
  `).join('') : '<p class="item-subtitle">No projects added yet.</p>';

  skillList.innerHTML = skills.length ? skills.map(s => `
    <div class="dashboard-item">
      <div class="item-info">
        <span class="item-title">${s.name}</span>
        <span class="item-subtitle">${s.category}</span>
      </div>
      <i class="fas fa-trash delete-item" onclick="window.deleteItem('skills', ${s.id})"></i>
    </div>
  `).join('') : '<p class="item-subtitle">No skills added yet.</p>';

  galleryList.innerHTML = gallery.length ? gallery.map(g => `
    <div class="dashboard-item">
      <div class="item-info">
        <span class="item-title">${g.title}</span>
        <span class="item-subtitle">${g.url}</span>
      </div>
      <i class="fas fa-trash delete-item" onclick="window.deleteItem('gallery', ${g.id})"></i>
    </div>
  `).join('') : '<p class="item-subtitle">No gallery items added yet.</p>';
}

function logout() {
  sessionStorage.removeItem('admin-auth');
  window.location.reload();
}
