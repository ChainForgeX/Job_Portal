const API_BASE = localStorage.getItem('jobPortalApi') || 'http://localhost:5005/api';
const state = { token: localStorage.getItem('jobPortalToken'), role: localStorage.getItem('jobPortalRole'), jobs: [], selectedJob: null, authMode: 'login' };
const $ = (selector) => document.querySelector(selector);

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.error || 'Something went wrong');
  return data;
}

function showNotice(message, isError = false) { const notice = $('#notice'); notice.textContent = message; notice.hidden = false; notice.className = `notice${isError ? ' error' : ''}`; }
function formatSalary(salary) { return salary ? `$${Number(salary).toLocaleString()}` : 'Compensation shared during process'; }
function companyName(job) { return job.company?.companyname || 'Independent team'; }

async function loadJobs() {
  $('#job-list').innerHTML = '<div class="skeleton"></div><div class="skeleton"></div>';
  try {
    const params = new URLSearchParams();
    if ($('#keyword').value) params.set('keyword', $('#keyword').value);
    if ($('#location').value) params.set('location', $('#location').value);
    if ($('#job-type').value) params.set('jobType', $('#job-type').value);
    const endpoint = params.toString() ? `/jobs/my-jobs?${params}` : '/jobs';
    state.jobs = await request(endpoint);
    $('#job-count').textContent = `${state.jobs.length} open ${state.jobs.length === 1 ? 'role' : 'roles'} right now`;
    renderJobs();
  } catch (error) { $('#job-list').innerHTML = ''; $('#job-count').textContent = 'Listings are taking a pause'; showNotice(error.message, true); }
}

function renderJobs() {
  if (!state.jobs.length) { $('#job-list').innerHTML = '<div class="dashboard-empty"><span class="empty-number">00</span><p>No roles match that search yet.</p></div>'; return; }
  $('#job-list').innerHTML = state.jobs.map((job) => `<article class="job-card"><span class="company-label">${companyName(job)}</span><h3>${job.title}</h3><div class="job-meta">${job.location || 'Remote'} · ${formatSalary(job.salary)}</div><p class="job-description">${job.description || 'A new opportunity to do thoughtful work with a focused team.'}</p><div class="job-footer"><span class="tag">${job.jobType || 'Open role'}</span><button class="apply-button" data-job-id="${job._id}">${state.role === 'candidate' ? 'Apply now ↗' : 'View role ↗'}</button></div></article>`).join('');
  document.querySelectorAll('[data-job-id]').forEach((button) => button.addEventListener('click', () => openApplication(button.dataset.jobId)));
}

function openAuth(mode = 'login') { state.authMode = mode; $('#auth-modal').hidden = false; updateAuthMode(); }
function updateAuthMode() { const register = state.authMode === 'register'; $('#auth-title').textContent = register ? 'Create your account' : 'Sign in'; $('#auth-subtitle').textContent = register ? 'Start finding work that fits.' : 'Pick up where you left off.'; $('#auth-submit').textContent = register ? 'Create account' : 'Sign in'; $('#name-field').hidden = !register; $('#role-field').hidden = !register; $('.switch-auth').textContent = register ? 'Already have an account? Sign in' : 'Need an account? Create one'; }
async function submitAuth(event) { event.preventDefault(); const form = new FormData(event.target); const body = Object.fromEntries(form.entries()); try { if (state.authMode === 'register') { await request('/auth/register', { method: 'POST', body: JSON.stringify(body) }); state.authMode = 'login'; updateAuthMode(); showNotice('Account created. Sign in to continue.'); return; } const data = await request('/auth/login', { method: 'POST', body: JSON.stringify(body) }); state.token = data.token; state.role = data.role; localStorage.setItem('jobPortalToken', data.token); localStorage.setItem('jobPortalRole', data.role); $('#auth-modal').hidden = true; updateAccount(); renderJobs(); } catch (error) { showNotice(error.message, true); } }

function openApplication(jobId) { if (!state.token) { openAuth(); return; } if (state.role !== 'candidate') { showNotice('Only candidate accounts can apply to roles.', true); return; } state.selectedJob = state.jobs.find((job) => job._id === jobId); $('#apply-job-title').textContent = `${state.selectedJob.title} at ${companyName(state.selectedJob)}`; $('#apply-modal').hidden = false; }
async function submitApplication(event) { event.preventDefault(); const form = new FormData(event.target); try { await request(`/applications/apply/${state.selectedJob._id}`, { method: 'POST', body: form }); $('#apply-modal').hidden = true; event.target.reset(); showNotice('Application submitted. Good luck with the next conversation.'); } catch (error) { showNotice(error.message, true); } }

function updateAccount() { $('#account-actions').innerHTML = state.token ? `<button class="button button-ghost" data-action="logout">Log out</button><a class="button button-dark" href="dashboard.html">${state.role === 'employer' ? 'Employer view' : 'My applications'}</a>` : '<button class="button button-ghost" data-action="open-auth">Sign in</button><button class="button button-dark" data-action="open-auth-register">Get started</button>'; }

document.addEventListener('click', (event) => { const action = event.target.dataset.action; if (action === 'open-auth') openAuth(); if (action === 'open-auth-register') openAuth('register'); if (action === 'close-auth') $('#auth-modal').hidden = true; if (action === 'close-apply') $('#apply-modal').hidden = true; if (action === 'toggle-auth') { state.authMode = state.authMode === 'login' ? 'register' : 'login'; updateAuthMode(); } if (action === 'search' || action === 'refresh') loadJobs(); if (action === 'logout') { state.token = null; state.role = null; localStorage.removeItem('jobPortalToken'); localStorage.removeItem('jobPortalRole'); updateAccount(); renderJobs(); } });
$('#auth-form').addEventListener('submit', submitAuth); $('#apply-form').addEventListener('submit', submitApplication); $('#keyword').addEventListener('keydown', (event) => { if (event.key === 'Enter') loadJobs(); });
updateAccount(); loadJobs();