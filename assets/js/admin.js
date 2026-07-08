const ADMIN_EMAIL = 'ommsstudentnetwork@gmail.com';
const CLERK_PUBLISHABLE_KEY = 'pk_test_bWF4aW11bS13YXJ0aG9nLTg0LmNsZXJrLmFjY291bnRzLmRldiQ';
let clerkInstance = null;

const $ = selector => document.querySelector(selector);

function escapeAdmin(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

function setStatus(message, isError = false) {
  const status = $('#jsonStatus');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('error', isError);
}

function getEditorData() {
  return JSON.parse($('#jsonEditor').value);
}

function writeEditor(data) {
  $('#jsonEditor').value = JSON.stringify(data, null, 2);
  setStatus('Ready');
  renderDeleteLists(data);
}

function saveEditor() {
  try {
    const data = getEditorData();
    PortfolioCMS.saveData(data);
    writeEditor(data);
    setStatus('Saved');
    return data;
  } catch (error) {
    setStatus(`Invalid JSON: ${error.message}`, true);
    return null;
  }
}

function downloadJson(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'portfolio.json';
  link.click();
  URL.revokeObjectURL(url);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function listItem(label, meta, action, index, groupIndex = '') {
  return `
    <div class="admin-list-item">
      <div class="admin-list-copy">
        <span>${escapeAdmin(label)}</span>
        ${meta ? `<small>${escapeAdmin(meta)}</small>` : ''}
      </div>
      <button class="delete-entry" type="button" data-action="${escapeAdmin(action)}" data-index="${index}" data-group-index="${groupIndex}" aria-label="Delete ${escapeAdmin(label)}">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
}

function renderDeleteLists(data = PortfolioCMS.getData()) {
  const projectsList = $('#projectsList');
  if (!projectsList) return;

  projectsList.innerHTML = data.projects.length
    ? data.projects.map((item, index) => listItem(item.title, item.category, 'projects', index)).join('')
    : '<p class="empty-list">No projects yet.</p>';

  $('#skillsList').innerHTML = data.skills.length
    ? data.skills.map((group, groupIndex) => `
      <div class="admin-list-group">
        <strong>${escapeAdmin(group.label)}</strong>
        ${group.items.map((item, index) => listItem(item, group.label, 'skills', index, groupIndex)).join('')}
      </div>
    `).join('')
    : '<p class="empty-list">No skills yet.</p>';

  $('#galleryList').innerHTML = data.gallery.length
    ? data.gallery.map((item, index) => listItem(item.title, item.image, 'gallery', index)).join('')
    : '<p class="empty-list">No gallery items yet.</p>';

  $('#certsList').innerHTML = data.certs.length
    ? data.certs.map((item, index) => listItem(item.title, item.highlight ? 'Highlighted' : '', 'certs', index)).join('')
    : '<p class="empty-list">No certificates yet.</p>';

  $('#socialsList').innerHTML = data.socials.length
    ? data.socials.map((item, index) => listItem(item.label, item.url, 'socials', index)).join('')
    : '<p class="empty-list">No social links yet.</p>';

  $('#experienceList').innerHTML = data.experience.length
    ? data.experience.map((item, index) => listItem(item.title, item.org, 'experience', index)).join('')
    : '<p class="empty-list">No experience entries yet.</p>';
}

function deleteEntry(action, index, groupIndex) {
  const data = getEditorData();

  if (action === 'skills') {
    const group = data.skills[Number(groupIndex)];
    if (!group) return;
    group.items.splice(Number(index), 1);
    if (group.items.length === 0) data.skills.splice(Number(groupIndex), 1);
  } else if (Array.isArray(data[action])) {
    data[action].splice(Number(index), 1);
  }

  writeEditor(data);
  saveEditor();
}

function addProject(event) {
  event.preventDefault();
  const data = getEditorData();
  const links = [];
  const github = $('#projectGithub').value.trim();
  const live = $('#projectLive').value.trim();

  if (github) links.push({ label: 'GitHub', url: github, icon: 'fab fa-github' });
  if (live) links.push({ label: 'Live', url: live, icon: 'fas fa-arrow-up-right-from-square' });

  data.projects.push({
    title: $('#projectTitle').value.trim(),
    category: $('#projectCategory').value,
    description: $('#projectDesc').value.trim(),
    tags: $('#projectTags').value.split(',').map(tag => tag.trim()).filter(Boolean),
    links
  });

  writeEditor(data);
  saveEditor();
  event.target.reset();
}

function addSkill(event) {
  event.preventDefault();
  const data = getEditorData();
  const groupLabel = $('#skillGroup').value.trim();
  const skillName = $('#skillName').value.trim();
  let group = data.skills.find(item => item.label.toLowerCase() === groupLabel.toLowerCase());

  if (!group) {
    group = {
      id: groupLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      label: groupLabel,
      items: []
    };
    data.skills.push(group);
  }

  if (!group.items.includes(skillName)) group.items.push(skillName);
  writeEditor(data);
  saveEditor();
  event.target.reset();
}

function addGallery(event) {
  event.preventDefault();
  const data = getEditorData();
  data.gallery.push({
    title: $('#galleryTitle').value.trim(),
    image: $('#galleryImage').value.trim(),
    alt: $('#galleryTitle').value.trim()
  });
  writeEditor(data);
  saveEditor();
  event.target.reset();
}

function addCert(event) {
  event.preventDefault();
  const data = getEditorData();
  data.certs.push({
    title: $('#certTitle').value.trim(),
    url: $('#certUrl').value.trim(),
    highlight: $('#certHighlight').checked
  });
  writeEditor(data);
  saveEditor();
  event.target.reset();
}

function updateDraftr(event) {
  event.preventDefault();
  const data = getEditorData();
  const heading = $('#draftrHeading').value.trim();
  const body = $('#draftrBody').value.trim();
  const url = $('#draftrUrl').value.trim();

  if (heading) data.draftr.heading = heading;
  if (body) data.draftr.body = body;
  if (url) data.draftr.url = url;

  writeEditor(data);
  saveEditor();
  event.target.reset();
}

function addSocial(event) {
  event.preventDefault();
  const data = getEditorData();
  data.socials.push({
    label: $('#socialLabel').value.trim(),
    url: $('#socialUrl').value.trim(),
    icon: $('#socialIcon').value.trim() || 'fas fa-link'
  });
  writeEditor(data);
  saveEditor();
  event.target.reset();
}

async function updateMedia(event) {
  event.preventDefault();
  const data = getEditorData();
  const photo = $('#photoUrl').value.trim();
  const resume = $('#resumeUrl').value.trim();
  const photoFile = $('#photoFile').files[0];
  const resumeFile = $('#resumeFile').files[0];

  if (photo) data.hero.photo = photo;
  if (resume) data.hero.resume = resume;
  if (photoFile) data.hero.photo = await readFileAsDataUrl(photoFile);
  if (resumeFile) data.hero.resume = await readFileAsDataUrl(resumeFile);

  writeEditor(data);
  saveEditor();
}

function bindDashboard() {
  writeEditor(PortfolioCMS.getData());
  $('#photoUrl').value = PortfolioCMS.getData().hero.photo;
  $('#resumeUrl').value = PortfolioCMS.getData().hero.resume;
  $('#draftrHeading').value = PortfolioCMS.getData().draftr.heading;
  $('#draftrBody').value = PortfolioCMS.getData().draftr.body;
  $('#draftrUrl').value = PortfolioCMS.getData().draftr.url;

  $('#saveJson').addEventListener('click', saveEditor);
  $('#previewSite').addEventListener('click', () => window.open('./index.html', '_blank', 'noopener'));
  $('#exportJson').addEventListener('click', () => downloadJson(getEditorData()));
  $('#resetData').addEventListener('click', () => {
    if (!confirm('Reset all local admin edits to the site defaults?')) return;
    PortfolioCMS.reset();
    writeEditor(PortfolioCMS.getData());
  });

  $('#importJson').addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        PortfolioCMS.saveData(data);
        writeEditor(data);
        setStatus('Imported');
      } catch (error) {
        setStatus(`Import failed: ${error.message}`, true);
      }
    };
    reader.readAsText(file);
  });

  $('#mediaForm').addEventListener('submit', updateMedia);
  $('#projectForm').addEventListener('submit', addProject);
  $('#skillForm').addEventListener('submit', addSkill);
  $('#galleryForm').addEventListener('submit', addGallery);
  $('#certForm').addEventListener('submit', addCert);
  $('#draftrForm').addEventListener('submit', updateDraftr);
  $('#socialForm').addEventListener('submit', addSocial);
  $('.admin-dashboard').addEventListener('click', event => {
    const button = event.target.closest('.delete-entry');
    if (!button) return;
    deleteEntry(button.dataset.action, button.dataset.index, button.dataset.groupIndex);
  });
}

function showDashboard() {
  $('#authScreen').hidden = true;
  $('#dashboard').hidden = false;
  bindDashboard();
}

function showAuthMessage(message) {
  $('#authMessage').textContent = message;
}

async function logoutAdmin() {
  if (!clerkInstance) return;
  await clerkInstance.signOut();
  window.location.href = './admin.html';
}

function getSignedInEmail(clerk) {
  return clerk.user?.primaryEmailAddress?.emailAddress || clerk.user?.emailAddresses?.[0]?.emailAddress || '';
}

async function loadScript(src, attrs = {}) {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.crossOrigin = 'anonymous';
    Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value));
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

async function loadClerk() {
  if (!CLERK_PUBLISHABLE_KEY || CLERK_PUBLISHABLE_KEY.includes('PASTE_YOUR')) {
    $('#clerkConfigNotice').hidden = false;
    showAuthMessage('Clerk is not configured yet.');
    return null;
  }

  const clerkDomain = atob(CLERK_PUBLISHABLE_KEY.split('_')[2]).slice(0, -1);
  await loadScript(`https://${clerkDomain}/npm/@clerk/ui@1/dist/ui.browser.js`);
  await loadScript(`https://${clerkDomain}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`, {
    'data-clerk-publishable-key': CLERK_PUBLISHABLE_KEY
  });
  await Clerk.load({ ui: { ClerkUI: window.__internal_ClerkUICtor } });
  return Clerk;
}

async function initAdmin() {
  try {
    const clerk = await loadClerk();
    if (!clerk) return;
    clerkInstance = clerk;

    const logoutBtn = $('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.hidden = !clerk.isSignedIn;
      logoutBtn.addEventListener('click', logoutAdmin);
    }

    if (clerk.isSignedIn) {
      const email = getSignedInEmail(clerk).toLowerCase();
      if (email === ADMIN_EMAIL) {
        clerk.mountUserButton($('#clerkUser'));
        showDashboard();
        return;
      }
      showAuthMessage(`Signed in as ${email || 'unknown email'}, but only ${ADMIN_EMAIL} can edit this site.`);
      clerk.mountUserButton($('#clerkUser'));
      return;
    }

    clerk.mountSignIn($('#signInMount'), {
      afterSignInUrl: './admin.html',
      afterSignUpUrl: './admin.html'
    });
  } catch (error) {
    $('#clerkConfigNotice').hidden = false;
    showAuthMessage(error.message);
  }
}

document.addEventListener('DOMContentLoaded', initAdmin);
