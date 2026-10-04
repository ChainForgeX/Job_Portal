const defaultApiBase = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5005/api'
    : 'https://job-portal-1-qucg.onrender.com/api';
const API_BASE = localStorage.getItem('jobPortalApi') || defaultApiBase;
const token = localStorage.getItem('jobPortalToken');
const role = localStorage.getItem('jobPortalRole');
const content = document.querySelector('#dashboard-content');
const notice = document.querySelector('#dashboard-notice');

async function request(path) {
    const response = await fetch(`${API_BASE}${path}`, {
        headers: {Authorization: `Bearer ${token}`}
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.error || 'Unable to load dashboard');
    return data;
}

function showNotice(message) {
    notice.textContent = message;
    notice.hidden = false;
}

function renderStats(stats, labels) {
    return `<div class="stats">${labels.map(([key, label]) => `<div class="stat"><strong>${stats[key] || 0}</strong><span>${label}</span></div>`).join('')}</div>`;
}

async function loadDashboard() {
    if (!token || !role) {
        content.innerHTML = '<div class="dashboard-empty"><span class="empty-number">01</span><p>Sign in first to see your dashboard.</p><a class="button button-accent" href="index.html">Go to sign in</a></div>';
        document.querySelector('#logout-button').textContent = 'Sign in';
        document.querySelector('#logout-button').onclick = () => { window.location.href = 'index.html'; };
        return;
    }
    try {
        const stats = await request(role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate');
        const labels = role === 'employer'
            ? [['totalJobs', 'Roles'], ['openJobs', 'Open'], ['totalApplications', 'Applications'], ['accepted', 'Accepted'], ['interview', 'Interviews'], ['rejected', 'Rejected']]
            : [['totalApplications', 'Applications'], ['applied', 'Applied'], ['reviewed', 'Reviewed'], ['interview', 'Interviews'], ['accepted', 'Accepted'], ['rejected', 'Rejected']];
        content.innerHTML = `<div class="dashboard-role"><p class="eyebrow">${role === 'employer' ? 'EMPLOYER OVERVIEW' : 'CANDIDATE OVERVIEW'}</p>${renderStats(stats, labels)}</div>`;
        if (role === 'candidate') await renderApplications();
        if (role === 'employer') await renderEmployerApplications();
    } catch (error) {
        showNotice(error.message);
    }
}

async function renderApplications() {
    const applications = await request('/applications/my-applications');
    content.innerHTML += `<div class="application-list"><p class="eyebrow">RECENT APPLICATIONS</p>${applications.map((item) => `<div class="application-row"><strong>${item.job?.title || 'Role'}</strong><span>${item.job?.company?.companyname || 'Company'} · ${item.status}</span></div>`).join('') || '<p class="muted">Your applications will appear here.</p>'}</div>`;
}

async function renderEmployerApplications() {
    const applications = await request('/applications/employer');
    content.innerHTML += `<div class="application-list"><p class="eyebrow">CANDIDATE PIPELINE</p>${applications.map((item) => `<div class="application-row"><strong>${item.candidate?.name || 'Candidate'} · ${item.job?.title || 'Role'}</strong><span>${item.status} · ${item.candidate?.email || ''}</span></div>`).join('') || '<p class="muted">Applications will appear here as candidates apply.</p>'}</div>`;
}

document.querySelector('#logout-button').addEventListener('click', () => {
    localStorage.removeItem('jobPortalToken');
    localStorage.removeItem('jobPortalRole');
    window.location.href = 'index.html';
});

loadDashboard();
