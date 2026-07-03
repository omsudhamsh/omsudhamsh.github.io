(function () {
  const STORAGE_KEY = 'portfolio-content-v1';

  const defaultData = {
    hero: {
      eyebrow: 'AI & FULL-STACK DEVELOPER',
      words: ['AI Models.', 'RAG Pipelines.', 'Full-Stack Web Apps.', 'Chatbots.'],
      line: 'Bridging LLMs and real interfaces - from Hyderabad, India.',
      photo: './assets/images/Photo.png',
      resume: 'assets/resume/OmSudhamshPadma..pdf'
    },
    about: {
      eyebrow: 'NOW',
      title: 'Deep in RAG pipelines.',
      line: 'Optimizing retrieval-augmented generation for production-grade LLM systems.',
      milestone: {
        mark: '01',
        title: 'Runner-Up',
        org: "Convergence '25 Hackathon",
        link: 'https://drive.google.com/file/d/1USVXZoMY3oKVAWsekMqUnU9U9Lh3l4QC/view?usp=sharing'
      },
      info: [
        { icon: 'fas fa-envelope', text: 'omsudhamsh@gmail.com' },
        { icon: 'fas fa-location-dot', text: 'Hyderabad, India' },
        { icon: 'fas fa-graduation-cap', text: 'B.Tech CSE - AI & ML' }
      ]
    },
    stats: [
      { value: 95, label: '% accuracy focus in RAG' },
      { value: 25, label: '+ AI hackathons' },
      { value: 15, label: '+ full-stack AI tools' }
    ],
    skills: [
      { id: 'genai', label: 'GenAI / LLMs', items: ['Prompt Engineering', 'LangChain', 'RAG', 'Conversational AI'] },
      { id: 'ml', label: 'ML & NLP', items: ['NLP', 'Sentiment Analysis', 'Intent Detection', 'Deep Learning'] },
      { id: 'lang', label: 'Languages', items: ['Python', 'JavaScript (ES6+)', 'TypeScript', 'SQL', 'Java'] },
      { id: 'front', label: 'Frontend', items: ['React.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Next.js'] },
      { id: 'back', label: 'Backend & AI', items: ['FastAPI', 'REST APIs', 'Hugging Face', 'Gemini API', 'Groq API'] },
      { id: 'data', label: 'Data & Tools', items: ['Pandas', 'NumPy', 'Supabase', 'Git', 'GitHub'] }
    ],
    projects: [
      {
        title: 'RAG Chatbot Application',
        category: 'ai',
        description: 'Context-aware conversational AI built on a semantic retrieval pipeline.',
        tags: ['React', 'LangChain', 'Gemini', 'FastAPI'],
        links: [{ label: 'GitHub', url: 'https://github.com/omsudhamsh/rag-chatbot', icon: 'fab fa-github' }]
      },
      {
        title: 'AskData - AI Data Platform',
        category: 'ai',
        description: 'Natural language to SQL, with real-time query execution and a clean UI.',
        tags: ['React', 'FastAPI', 'Groq LLM', 'SQLite'],
        links: [
          { label: 'GitHub', url: 'https://github.com/omsudhamsh/nl-sql', icon: 'fab fa-github' },
          { label: 'Live', url: 'https://nl-sql-teal.vercel.app/', icon: 'fas fa-arrow-up-right-from-square' }
        ]
      },
      {
        title: 'Prompt Generator',
        category: 'web',
        description: 'Structured prompt builder for datasets, with a 0-100 quality scoring system.',
        tags: ['React', 'Tailwind', 'shadcn/ui', 'Gemini API'],
        links: [
          { label: 'GitHub', url: 'https://github.com/omsudhamsh/prompt-generator', icon: 'fab fa-github' },
          { label: 'Live', url: 'https://omsudhamsh.github.io/prompt-generator/', icon: 'fas fa-arrow-up-right-from-square' }
        ]
      }
    ],
    gallery: [
      { title: 'HackLeague - Google (MU)', image: './assets/images/mlrd.jpg', alt: 'HackLeague' },
      { title: 'AI for Good - NIAT', image: './assets/images/gal-5.png', alt: 'AI for Good' },
      { title: 'AI Day', image: './assets/images/gal-4.jpg', alt: 'AI Day' },
      { title: 'React & Microsoft', image: './assets/images/React-Msft.jpeg', alt: 'React and Microsoft' },
      { title: 'Runner Up', image: './assets/images/gal-1.jpg', alt: 'Runner Up' },
      { title: 'Open Source Day', image: './assets/images/gal-3.JPG', alt: 'Open Source Day' },
      { title: 'Aleph Zero, J-Hub', image: './assets/images/gal-2.jpg', alt: 'Aleph Zero, J-Hub' }
    ],
    draftr: {
      eyebrow: 'COMMUNITY',
      title: 'Draftr',
      line: 'A community I run for AI, tech, and career growth.',
      heading: 'Follow the Draftr WhatsApp Channel',
      body: 'Free events, resources, and many more Hyderabad tech updates for AI, builders, and career growth.',
      url: 'https://whatsapp.com/channel/0029Vb7dohRLI8YdaiqwVa3A',
      cta: 'Follow Channel',
      updates: []
    },
    certs: [
      { title: 'IBM Cloud Essentials', url: 'https://www.credly.com/badges/a742ceb4-af56-4481-bd5f-ba2af1025002/linked_in_profile' },
      { title: 'Cisco Networking Academy', url: 'https://www.credly.com/badges/76a8419e-dde3-4106-a26f-337cbc7f26bb/public_url' },
      { title: 'Python for Data Science', url: 'https://drive.google.com/file/d/1BszxzwzXTK7QlGaPF-aJwVdkHswE-1zk/view' },
      { title: 'MS Intro to ML', url: 'https://learn.microsoft.com/en-us/users/omsudhamsh-2001/achievements/bcze8jpd?ref=https%3A%2F%2Fwww.credly.com%2F' },
      { title: 'Deep Learning (TensorFlow)', url: 'https://courses.cognitiveclass.ai/certificates/6e80b58f92e2427f86bf5e7304bcfe27' },
      { title: 'Salesforce Agentforce', url: 'https://trailhead.salesforce.com/en/credentials/certification-detail-print/?searchString=XwtLkzmbFJV8eXMAKE/iC3X5wNHy9cmrrpP21TsIc92urlWE+TSvPZWSc/DmI/j9' },
      { title: 'Google GenAI', url: 'https://drive.google.com/file/d/1T_k-MBZr4C7DsPPYrVD4gfY5RVfIoShF/view?usp=sharing', highlight: true }
    ],
    experience: [
      { title: 'Creative Lead', org: 'NextGen Nexus' },
      { title: 'Student Volunteer', org: 'Microsoft AI Innovators Hub', url: 'https://www.linkedin.com/in/omsudhamsh/overlay/Position/2655080503/treasury/?profileId=ACoAAEUVtQQBmUsYwnAJxMd0IjQDOPqvIH4BmTo' },
      { title: 'Graphic Designer', org: 'E-Cell CMRCET' }
    ],
    education: {
      title: 'B.Tech CSE (AI & ML)',
      org: 'CMR College of Engineering & Technology · GPA 8.36'
    },
    socials: [
      { label: 'GitHub', url: 'https://github.com/omsudhamsh', icon: 'fab fa-github' },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/omsudhamsh', icon: 'fab fa-linkedin' },
      { label: 'Twitter / X', url: 'https://x.com/om_sudhamsh', icon: 'fab fa-twitter' },
      { label: 'Google Skills', url: 'https://www.skills.google/public_profiles/4b1a8fbb-e8d1-4f9d-a95a-469f78caa376', icon: 'fab fa-google' },
      { label: 'CodeChef', url: 'https://www.codechef.com/users/omsudhamsh', icon: 'fas fa-code' },
      { label: 'Codeforces', url: 'https://codeforces.com/profile/omsudhamsh', icon: 'fas fa-terminal' },
      { label: 'LeetCode', url: 'https://leetcode.com/u/omsudhamsh/', icon: 'fas fa-laptop-code' },
      { label: 'Draftr Channel', url: 'https://whatsapp.com/channel/0029Vb7dohRLI8YdaiqwVa3A', icon: 'fab fa-whatsapp' }
    ],
    contact: {
      email: 'omsudhamsh@gmail.com',
      note: 'Built with intent.'
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : clone(defaultData);
    } catch (error) {
      console.warn('Portfolio data could not be loaded.', error);
      return clone(defaultData);
    }
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('portfolio:data-change', { detail: data }));
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[char]));
  }

  function iconHtml(icon) {
    return icon ? `<i class="${escapeHtml(icon)}"></i>` : '';
  }

  function renderPortfolio(data = getData()) {
    const heroEyebrow = document.querySelector('#hero .eyebrow');
    const typing = document.querySelector('.typing');
    const heroLine = document.querySelector('.hero-line');
    const resumeLink = document.querySelector('.btn-row .btn-line');
    const heroPhotos = document.querySelectorAll('.hero-photo img');

    if (heroEyebrow) heroEyebrow.textContent = data.hero.eyebrow;
    if (typing) typing.dataset.words = JSON.stringify(data.hero.words);
    if (heroLine) heroLine.textContent = data.hero.line;
    if (resumeLink) resumeLink.href = data.hero.resume;
    heroPhotos.forEach(img => { img.src = data.hero.photo; });

    const about = document.querySelector('#about');
    if (about) {
      about.querySelector('.eyebrow').textContent = data.about.eyebrow;
      about.querySelector('.section-title').textContent = data.about.title;
      about.querySelector('.section-line').textContent = data.about.line;
      about.querySelector('.milestone-mark').textContent = data.about.milestone.mark;
      about.querySelector('.milestone-title').textContent = data.about.milestone.title;
      about.querySelector('.milestone-org').textContent = data.about.milestone.org;
      about.querySelector('.verify').href = data.about.milestone.link;
      about.querySelector('.info-row').innerHTML = data.about.info.map(item => `
        <div class="info-chip">${iconHtml(item.icon)}<span>${escapeHtml(item.text)}</span></div>
      `).join('');
    }

    const statsRow = document.querySelector('.stats-row');
    if (statsRow) {
      statsRow.innerHTML = data.stats.map(stat => `
        <div class="stat"><h3 data-target="${Number(stat.value) || 0}">0</h3><p>${escapeHtml(stat.label)}</p></div>
      `).join('');
    }

    const workGrid = document.querySelector('#workGrid');
    if (workGrid) {
      workGrid.innerHTML = data.projects.map((project, index) => `
        <article class="work-card reveal in-view" data-category="${escapeHtml(project.category)}">
          <div class="work-num">${String(index + 1).padStart(2, '0')}</div>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.description)}</p>
          <div class="tag-row">${project.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
          ${(project.links || []).map(link => `
            <a href="${escapeHtml(link.url)}" target="_blank" class="work-link">${escapeHtml(link.label)} ${iconHtml(link.icon)}</a>
          `).join('')}
        </article>
      `).join('');
    }

    const tabNav = document.querySelector('#tabNav');
    const skillTabs = document.querySelector('.skill-tabs');
    if (tabNav && skillTabs) {
      tabNav.innerHTML = data.skills.map((group, index) => `
        <button class="tab-btn ${index === 0 ? 'active' : ''}" data-tab="${escapeHtml(group.id)}">${escapeHtml(group.label)}</button>
      `).join('');
      skillTabs.querySelectorAll('.tab-panel').forEach(panel => panel.remove());
      data.skills.forEach((group, index) => {
        const panel = document.createElement('div');
        panel.className = `tab-panel ${index === 0 ? 'active' : ''}`;
        panel.dataset.panel = group.id;
        panel.innerHTML = group.items.map(item => `<span>${escapeHtml(item)}</span>`).join('');
        skillTabs.appendChild(panel);
      });
    }

    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
      galleryGrid.innerHTML = data.gallery.map(item => `
        <figure class="gal-item"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || item.title)}"><figcaption>${escapeHtml(item.title)}</figcaption></figure>
      `).join('');
    }

    const draftr = document.querySelector('#draftr');
    if (draftr) {
      draftr.querySelector('.eyebrow').textContent = data.draftr.eyebrow;
      draftr.querySelector('.section-title').textContent = data.draftr.title;
      draftr.querySelector('.section-line').textContent = data.draftr.line;
      draftr.querySelector('.draftr-copy h3').textContent = data.draftr.heading;
      draftr.querySelector('.draftr-copy p').textContent = data.draftr.body;
      const draftrLink = draftr.querySelector('.draftr-callout .btn');
      draftrLink.href = data.draftr.url;
      draftrLink.innerHTML = `${escapeHtml(data.draftr.cta)} <i class="fas fa-arrow-up-right-from-square"></i>`;
    }

    const certGrid = document.querySelector('.cert-grid');
    if (certGrid) {
      certGrid.innerHTML = data.certs.map(cert => `
        <a href="${escapeHtml(cert.url)}" target="_blank" class="cert-chip ${cert.highlight ? 'highlight' : ''}"><i class="fas fa-certificate"></i>${escapeHtml(cert.title)}</a>
      `).join('');
    }

    const timeline = document.querySelector('.timeline');
    if (timeline) {
      timeline.innerHTML = '<h4>Experience</h4>' + data.experience.map(item => `
        <div class="t-item"><p class="t-title">${escapeHtml(item.title)}</p><p class="t-org">${escapeHtml(item.org)}${item.url ? ` <a href="${escapeHtml(item.url)}" target="_blank">Verify ↗</a>` : ''}</p></div>
      `).join('');
    }

    const edu = document.querySelector('.edu');
    if (edu) {
      edu.innerHTML = `
        <h4>Education</h4>
        <p class="edu-title">${escapeHtml(data.education.title)}</p>
        <p class="edu-org">${escapeHtml(data.education.org)}</p>
      `;
    }

    const contactEmail = document.querySelector('.contact-email');
    const socialRow = document.querySelector('.social-row');
    const footNote = document.querySelector('.foot-note');
    if (contactEmail) {
      contactEmail.href = `mailto:${data.contact.email}`;
      contactEmail.textContent = data.contact.email;
    }
    if (socialRow) {
      socialRow.innerHTML = data.socials.map(link => `
        <a href="${escapeHtml(link.url)}" target="_blank">${iconHtml(link.icon)} ${escapeHtml(link.label)}</a>
      `).join('');
    }
    if (footNote) footNote.innerHTML = `© <span id="year"></span> Om Sudhamsh. ${escapeHtml(data.contact.note)}`;
  }

  window.PortfolioCMS = {
    STORAGE_KEY,
    defaultData,
    getData,
    saveData,
    renderPortfolio,
    reset: () => saveData(clone(defaultData))
  };

  renderPortfolio();
})();
