// ─── Config ───────────────────────────────────────────────
const API = window.location.origin + '/api';

// ─── Auth Guard: redirect to login if no token ────────────
const token = localStorage.getItem('ss_token');
const currentUser = JSON.parse(localStorage.getItem('ss_user') || 'null');

if (!token) {
    window.location.href = 'login.html';
}

// Helper: get auth headers
function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// ─── Show logged-in user name ─────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.full_name.split(' ')[0];
    }
});

// ─── Logout ───────────────────────────────────────────────
function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('ss_token');
        localStorage.removeItem('ss_user');
        window.location.href = 'login.html';
    }
}

// ─── Scholarship Data ─────────────────────────────────────
const scholarships = [
    { id: 1, title: "DOST Undergraduate Scholarship", organization: "Department of Science and Technology", amount: "Full Tuition + Monthly Allowance", deadline: "2026-05-31", requirements: ["GPA: 85+", "STEM Course", "Essay Required"], eligibility: { majors: ["Engineering", "Computer Science", "Science"], minGPA: 85, yearLevels: ["Grade 12", "1st Year College"], regions: "All" }, description: "Full scholarship for STEM students including tuition, books, and living allowance." },
    { id: 2, title: "CHED Scholarship for Priority Courses", organization: "Commission on Higher Education", amount: "₱60,000/year", deadline: "2026-04-30", requirements: ["GPA: 80+", "Priority Course", "Income Bracket: Below 500k"], eligibility: { majors: ["Engineering", "Education", "Medicine", "Agriculture"], minGPA: 80, yearLevels: ["1st Year College", "2nd Year College", "3rd Year College", "4th Year College"], income: ["Below 250k", "250k-500k"] }, description: "Merit-based scholarship for students in priority courses." },
    { id: 3, title: "SM Foundation College Scholarship", organization: "SM Foundation", amount: "₱20,000/semester", deadline: "2026-06-15", requirements: ["GPA: 85+", "Financial Need", "Interview"], eligibility: { majors: ["Any"], minGPA: 85, yearLevels: ["1st Year College", "2nd Year College", "3rd Year College", "4th Year College"], income: ["Below 250k", "250k-500k"] }, description: "Scholarship program for financially challenged but deserving students." },
    { id: 4, title: "Ayala Foundation Scholarship", organization: "Ayala Foundation", amount: "Full Tuition", deadline: "2026-05-20", requirements: ["GPA: 90+", "Leadership Experience", "Essay & Interview"], eligibility: { majors: ["Engineering", "Business", "Computer Science"], minGPA: 90, yearLevels: ["1st Year College", "2nd Year College"], regions: "NCR" }, description: "Full tuition scholarship for outstanding students with leadership potential." },
    { id: 5, title: "Megaworld Foundation Scholarship", organization: "Megaworld Foundation", amount: "₱40,000/year", deadline: "2026-07-10", requirements: ["GPA: 85+", "Community Service Experience"], eligibility: { majors: ["Any"], minGPA: 85, yearLevels: ["2nd Year College", "3rd Year College", "4th Year College"], income: ["Below 250k", "250k-500k"] }, description: "Scholarship for students with strong community involvement." },
    { id: 6, title: "Gokongwei Brothers Foundation Scholarship", organization: "Gokongwei Brothers Foundation", amount: "Full Tuition + Allowance", deadline: "2026-04-15", requirements: ["GPA: 88+", "Engineering Course", "Essay Required"], eligibility: { majors: ["Engineering", "Computer Science"], minGPA: 88, yearLevels: ["1st Year College", "2nd Year College", "3rd Year College"], regions: "All" }, description: "Comprehensive scholarship program for engineering students." },
    { id: 7, title: "Jollibee Group Foundation Scholarship", organization: "Jollibee Group Foundation", amount: "₱30,000/year", deadline: "2026-06-30", requirements: ["GPA: 83+", "Good Moral Character"], eligibility: { majors: ["Business", "Education", "Any"], minGPA: 83, yearLevels: ["1st Year College", "2nd Year College", "3rd Year College", "4th Year College"], income: ["Below 250k", "250k-500k"] }, description: "Scholarship for underprivileged but deserving students." },
    { id: 8, title: "CHED Regional Scholarship", organization: "CHED Regional Office", amount: "₱50,000/year", deadline: "2026-05-10", requirements: ["GPA: 85+", "Regional Residency"], eligibility: { majors: ["Any"], minGPA: 85, yearLevels: ["1st Year College", "2nd Year College", "3rd Year College"], regions: "All" }, description: "Regional scholarship program for qualified students." },
    { id: 9, title: "PNB Scholarship Program", organization: "Philippine National Bank", amount: "₱25,000/semester", deadline: "2026-07-01", requirements: ["GPA: 87+", "Business or Economics Course"], eligibility: { majors: ["Business", "Computer Science"], minGPA: 87, yearLevels: ["2nd Year College", "3rd Year College", "4th Year College"], income: ["Below 250k", "250k-500k", "500k-1M"] }, description: "Scholarship for students pursuing business-related courses." },
    { id: 10, title: "PLDT-Smart Foundation Scholarship", organization: "PLDT-Smart Foundation", amount: "₱35,000/year", deadline: "2026-06-20", requirements: ["GPA: 88+", "ICT-related Course", "Essay"], eligibility: { majors: ["Computer Science", "Engineering"], minGPA: 88, yearLevels: ["1st Year College", "2nd Year College", "3rd Year College"], regions: "All" }, description: "Scholarship for students pursuing ICT and technology courses." },
    { id: 11, title: "BPI Foundation Scholarship", organization: "BPI Foundation", amount: "₱45,000/year", deadline: "2026-05-25", requirements: ["GPA: 86+", "Financial Need", "Interview Required"], eligibility: { majors: ["Business", "Engineering", "Computer Science", "Any"], minGPA: 86, yearLevels: ["1st Year College", "2nd Year College", "3rd Year College", "4th Year College"], income: ["Below 250k", "250k-500k"] }, description: "Comprehensive scholarship program for deserving students." },
    { id: 12, title: "San Miguel Foundation Scholarship", organization: "San Miguel Corporation", amount: "₱55,000/year", deadline: "2026-07-15", requirements: ["GPA: 87+", "Leadership Qualities", "Community Involvement"], eligibility: { majors: ["Engineering", "Business", "Science", "Agriculture"], minGPA: 87, yearLevels: ["2nd Year College", "3rd Year College", "4th Year College"], income: ["Below 250k", "250k-500k"] }, description: "Scholarship for students demonstrating leadership and community service." },
    { id: 13, title: "Metrobank Foundation Scholarship", organization: "Metrobank Foundation", amount: "Full Tuition", deadline: "2026-04-20", requirements: ["GPA: 90+", "Outstanding Academic Achievement", "Interview"], eligibility: { majors: ["Any"], minGPA: 90, yearLevels: ["1st Year College", "2nd Year College"], regions: "All" }, description: "Full scholarship for academically outstanding students." },
    { id: 14, title: "Aboitiz Foundation Scholarship", organization: "Aboitiz Foundation", amount: "₱40,000/year", deadline: "2026-06-05", requirements: ["GPA: 85+", "STEM Course", "Good Moral Character"], eligibility: { majors: ["Engineering", "Computer Science", "Science"], minGPA: 85, yearLevels: ["1st Year College", "2nd Year College", "3rd Year College", "4th Year College"], regions: "Region 7" }, description: "Regional scholarship for STEM students in Visayas." },
    { id: 15, title: "CHED UNIFAST Scholarship", organization: "Commission on Higher Education", amount: "₱40,000/year", deadline: "2026-08-01", requirements: ["GPA: 80+", "Income Bracket: Below 500k"], eligibility: { majors: ["Any"], minGPA: 80, yearLevels: ["1st Year College", "2nd Year College", "3rd Year College", "4th Year College"], income: ["Below 250k", "250k-500k"] }, description: "Universal Access to Quality Tertiary Education scholarship program." },
    { id: 16, title: "Lopez Group Foundation Scholarship", organization: "Lopez Group Foundation", amount: "₱50,000/year", deadline: "2026-05-30", requirements: ["GPA: 88+", "Essay Required", "Interview"], eligibility: { majors: ["Engineering", "Computer Science", "Business", "Medicine"], minGPA: 88, yearLevels: ["2nd Year College", "3rd Year College", "4th Year College"], income: ["Below 250k", "250k-500k"] }, description: "Scholarship for high-achieving students in priority fields." },
    { id: 17, title: "Henry Sy Foundation Scholarship", organization: "Henry Sy Foundation", amount: "Full Tuition + Book Allowance", deadline: "2026-06-25", requirements: ["GPA: 92+", "Exceptional Academic Record", "Leadership"], eligibility: { majors: ["Any"], minGPA: 92, yearLevels: ["1st Year College", "2nd Year College"], regions: "All" }, description: "Prestigious full scholarship for top-performing students." },
    { id: 18, title: "Robinsons Land Foundation Scholarship", organization: "Robinsons Land Corporation", amount: "₱35,000/year", deadline: "2026-07-20", requirements: ["GPA: 84+", "Financial Need Certification"], eligibility: { majors: ["Business", "Engineering", "Any"], minGPA: 84, yearLevels: ["1st Year College", "2nd Year College", "3rd Year College", "4th Year College"], income: ["Below 250k", "250k-500k"] }, description: "Scholarship program for financially challenged students." },
    { id: 19, title: "Globe Telecom Scholarship", organization: "Globe Telecom", amount: "₱45,000/year", deadline: "2026-05-15", requirements: ["GPA: 87+", "STEM Course", "Technology Interest"], eligibility: { majors: ["Computer Science", "Engineering"], minGPA: 87, yearLevels: ["1st Year College", "2nd Year College", "3rd Year College"], regions: "All" }, description: "Scholarship for tech-focused students with strong academic records." },
    { id: 20, title: "MVP Foundation Scholarship", organization: "MVP Foundation", amount: "₱60,000/year", deadline: "2026-06-10", requirements: ["GPA: 89+", "Leadership Experience", "Community Service"], eligibility: { majors: ["Engineering", "Computer Science", "Business", "Any"], minGPA: 89, yearLevels: ["2nd Year College", "3rd Year College", "4th Year College"], income: ["Below 250k", "250k-500k"] }, description: "Comprehensive scholarship for well-rounded, high-achieving students." }
];

// ─── State (synced with DB) ───────────────────────────────
let savedIds = [];
let progressData = { planning: [], inProgress: [], submitted: [] };
let currentProfile = null;

// ─── Load data from DB on startup ────────────────────────
async function loadUserData() {
    try {
        // Load profile
        const profileRes = await fetch(`${API}/profile/get`, { headers: authHeaders() });
        const profileData = await profileRes.json();
        currentProfile = profileData.profile;

        if (currentProfile) {
            document.getElementById('fullName').value = currentProfile.full_name || '';
            document.getElementById('yearLevel').value = currentProfile.year_level || '';
            document.getElementById('gpa').value = currentProfile.gpa || '';
            document.getElementById('major').value = currentProfile.major || '';
            document.getElementById('region').value = currentProfile.region || '';
            document.getElementById('gender').value = currentProfile.gender || '';
            document.getElementById('income').value = currentProfile.income || '';
        }

        // Load saved
        const savedRes = await fetch(`${API}/scholarships/saved`, { headers: authHeaders() });
        const savedData = await savedRes.json();
        savedIds = savedData.saved || [];

        // Load progress
        const progRes = await fetch(`${API}/scholarships/progress`, { headers: authHeaders() });
        const progData = await progRes.json();
        progressData = progData.progress || { planning: [], inProgress: [], submitted: [] };

    } catch (err) {
        console.error('Failed to load user data:', err);
    }

    updateDashboard();
    renderBrowsePage();
    updateProfilePageUI();
}

// ─── Profile: check if set up ─────────────────────────────
function requireProfile() {
    if (!currentProfile) {
        document.getElementById('profileRequiredModal').classList.add('active');
        return false;
    }
    return true;
}
function closeProfileRequiredModal() { document.getElementById('profileRequiredModal').classList.remove('active'); }
function goToProfileSetup() { closeProfileRequiredModal(); showPage('profile', true); }

// ─── Match Calculation ────────────────────────────────────
function calculateMatch(scholarship, profile) {
    if (!profile) return 0;
    let score = 0, maxScore = 0;
    maxScore += 30;
    if (profile.gpa >= scholarship.eligibility.minGPA) score += 30;
    else if (profile.gpa >= scholarship.eligibility.minGPA - 5) score += 15;
    maxScore += 40;
    const pMajor = profile.major || profile.major;
    if (scholarship.eligibility.majors.includes("Any") || scholarship.eligibility.majors.includes(pMajor)) score += 40;
    maxScore += 20;
    const yearField = profile.year_level || profile.yearLevel;
    if (scholarship.eligibility.yearLevels.includes(yearField)) score += 20;
    maxScore += 10;
    if (scholarship.eligibility.regions === "All" || scholarship.eligibility.regions === profile.region) score += 10;
    return Math.round((score / maxScore) * 100);
}

// ─── Render Scholarship Card ──────────────────────────────
function renderScholarshipCard(scholarship, matchPercentage = null) {
    const isSaved = savedIds.includes(scholarship.id);
    const daysUntilDeadline = Math.ceil((new Date(scholarship.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return `<div class="scholarship-card" data-id="${scholarship.id}">
        <div><div class="scholarship-title">${scholarship.title}</div><div class="scholarship-org">${scholarship.organization}</div></div>
        <div class="scholarship-amount">${scholarship.amount}</div>
        <div class="scholarship-tags">${scholarship.requirements.map(r => `<span class="tag">${r}</span>`).join('')}</div>
        <div class="scholarship-deadline">⏰ Deadline: ${new Date(scholarship.deadline).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })} (${daysUntilDeadline} days left)</div>
        ${matchPercentage !== null ? `<div class="scholarship-match"><div class="match-bar"><div class="match-fill" style="width:${matchPercentage}%"></div></div><div class="match-text">${matchPercentage}% Match</div></div>` : ''}
        <p>${scholarship.description}</p>
        <div class="scholarship-actions">
            <button class="btn-icon ${isSaved ? 'saved' : ''}" onclick="toggleSaved(${scholarship.id})">${isSaved ? '❤️ Saved' : '🤍 Save'}</button>
            <button class="btn-icon" onclick="addToProgress(${scholarship.id},'planning')">📋 Add to Planning</button>
        </div>
    </div>`;
}

// ─── Page Navigation ──────────────────────────────────────
function showPage(pageId, scrollToTop = false) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === pageId) btn.classList.add('active');
    });
    if (pageId === 'browse') renderBrowsePage();
    else if (pageId === 'saved') renderSavedPage();
    else if (pageId === 'progress') renderProgressPage();
    else if (pageId === 'dashboard') updateDashboard();
    if (scrollToTop) window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Browse Page ──────────────────────────────────────────
function renderBrowsePage() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterMajor = document.getElementById('filterMajor').value;
    const filterAmount = document.getElementById('filterAmount').value;
    const sortBy = document.getElementById('sortBy').value;

    let filtered = scholarships.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(searchTerm) || s.organization.toLowerCase().includes(searchTerm) || s.description.toLowerCase().includes(searchTerm);
        const matchesMajor = !filterMajor || s.eligibility.majors.includes(filterMajor) || s.eligibility.majors.includes("Any");
        let matchesAmount = true;
        if (filterAmount) { const [min, max] = filterAmount.split('-').map(Number); const amt = s.amount.match(/[\d,]+/); if (amt) { const n = parseInt(amt[0].replace(/,/g, '')); matchesAmount = n >= min && (!max || n <= max); } }
        return matchesSearch && matchesMajor && matchesAmount;
    });

    filtered = filtered.map(s => ({ ...s, matchPercentage: calculateMatch(s, currentProfile) }));
    if (sortBy === 'match') filtered.sort((a, b) => b.matchPercentage - a.matchPercentage);
    else if (sortBy === 'amount') filtered.sort((a, b) => { const ga = parseInt((a.amount.match(/[\d,]+/) || ['0'])[0].replace(/,/g, '')); const gb = parseInt((b.amount.match(/[\d,]+/) || ['0'])[0].replace(/,/g, '')); return gb - ga; });
    else if (sortBy === 'deadline') filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    const grid = document.getElementById('scholarshipGrid');
    grid.innerHTML = filtered.length === 0
        ? `<div class="empty-state"><div class="empty-state-icon">🔍</div><h3>No scholarships found</h3><p>Try adjusting your filters</p></div>`
        : filtered.map(s => renderScholarshipCard(s, currentProfile ? s.matchPercentage : null)).join('');
}

// ─── Saved Page ───────────────────────────────────────────
function renderSavedPage() {
    const grid = document.getElementById('savedGrid');
    if (savedIds.length === 0) {
        grid.innerHTML = `<div class="empty-state"><div class="empty-state-icon">❤️</div><h3>No saved scholarships yet</h3><p>Browse scholarships and save your favorites!</p><button class="btn-primary" onclick="showPage('browse')" style="margin-top:20px;">Browse Scholarships</button></div>`;
    } else {
        const saved = scholarships.filter(s => savedIds.includes(s.id)).map(s => ({ ...s, matchPercentage: calculateMatch(s, currentProfile) }));
        grid.innerHTML = saved.map(s => renderScholarshipCard(s, currentProfile ? s.matchPercentage : null)).join('');
    }
}

// ─── Progress Page ────────────────────────────────────────
function renderProgressPage() {
    renderProgressList('planning', progressData.planning);
    renderProgressList('inProgress', progressData.inProgress);
    renderProgressList('submitted', progressData.submitted);
}

function renderProgressList(status, ids) {
    const container = document.getElementById(status + 'List');
    const items = scholarships.filter(s => ids.includes(s.id));
    const statusMap = { planning: 'Planning', inProgress: 'In Progress', submitted: 'Submitted' };
    const statusClass = { planning: 'status-planning', inProgress: 'status-in-progress', submitted: 'status-submitted' };
    const heading = container.previousElementSibling;
    heading.innerHTML = `${heading.textContent.split('(')[0].trim()} <span style="color:var(--text-light);">(${items.length})</span>`;
    if (items.length === 0) {
        container.innerHTML = `<div style="background:var(--bg-white);border:1px solid var(--border-light);border-radius:12px;padding:30px;text-align:center;"><p style="color:var(--text-medium);">No scholarships in this stage</p></div>`;
    } else {
        container.innerHTML = items.map(s => `
            <div class="progress-item">
                <div class="progress-header"><div><div class="scholarship-title">${s.title}</div><div class="scholarship-org">${s.organization}</div></div><span class="status-badge ${statusClass[status]}">${statusMap[status]}</span></div>
                <div class="scholarship-amount">${s.amount}</div>
                <div class="scholarship-deadline" style="margin-bottom:15px;">⏰ Deadline: ${new Date(s.deadline).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                    ${status === 'planning' ? `<button class="btn-icon" onclick="moveProgress(${s.id},'planning','inProgress')">➡️ Start Application</button>` : ''}
                    ${status === 'inProgress' ? `<button class="btn-icon" onclick="moveProgress(${s.id},'inProgress','submitted')">✅ Mark as Submitted</button>` : ''}
                    <button class="btn-icon" onclick="removeFromProgress(${s.id},'${status}')" style="background:rgba(231,76,60,0.1);border-color:rgba(231,76,60,0.3);color:var(--danger);">🗑️ Remove</button>
                </div>
            </div>`).join('');
    }
}

// ─── Toggle Saved (DB) ────────────────────────────────────
async function toggleSaved(id) {
    if (!requireProfile()) return;
    try {
        const res = await fetch(`${API}/scholarships/save`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ scholarship_id: id }) });
        const data = await res.json();
        if (data.saved) savedIds.push(id);
        else savedIds = savedIds.filter(s => s !== id);
        const activePage = document.querySelector('.page.active').id;
        if (activePage === 'browse') renderBrowsePage();
        else if (activePage === 'saved') renderSavedPage();
        updateDashboard();
    } catch (err) { console.error('Failed to toggle save:', err); }
}

// ─── Add to Progress (DB) ─────────────────────────────────
async function addToProgress(id, status) {
    if (!requireProfile()) return;
    const all = [...progressData.planning, ...progressData.inProgress, ...progressData.submitted];
    if (all.includes(id)) { alert('ℹ️ This scholarship is already in your progress tracker!'); return; }
    try {
        const res = await fetch(`${API}/scholarships/progress/add`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ scholarship_id: id, status }) });
        if (res.ok) { progressData[status].push(id); alert('✅ Added to your application progress!'); updateDashboard(); }
    } catch (err) { console.error('Failed to add to progress:', err); }
}

// ─── Move Progress (DB) ───────────────────────────────────
async function moveProgress(id, fromStatus, toStatus) {
    try {
        await fetch(`${API}/scholarships/progress/move`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ scholarship_id: id, status: toStatus }) });
        progressData[fromStatus] = progressData[fromStatus].filter(s => s !== id);
        progressData[toStatus].push(id);
        renderProgressPage();
        updateDashboard();
    } catch (err) { console.error('Failed to move progress:', err); }
}

// ─── Remove Progress (DB) ────────────────────────────────
async function removeFromProgress(id, status) {
    if (!confirm('Remove this scholarship from your progress?')) return;
    try {
        await fetch(`${API}/scholarships/progress/remove`, { method: 'DELETE', headers: authHeaders(), body: JSON.stringify({ scholarship_id: id }) });
        progressData[status] = progressData[status].filter(s => s !== id);
        renderProgressPage();
        updateDashboard();
    } catch (err) { console.error('Failed to remove from progress:', err); }
}

// ─── Update Dashboard ─────────────────────────────────────
function updateDashboard() {
    const matchCount = currentProfile ? scholarships.filter(s => calculateMatch(s, currentProfile) >= 70).length : 0;
    const thirtyDaysFromNow = new Date(); thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const deadlinesCount = scholarships.filter(s => { const d = new Date(s.deadline); return d >= new Date() && d <= thirtyDaysFromNow; }).length;
    document.getElementById('matchCount').textContent = matchCount;
    document.getElementById('savedCount').textContent = savedIds.length;
    document.getElementById('appliedCount').textContent = progressData.submitted.length;
    document.getElementById('deadlinesCount').textContent = deadlinesCount;
    document.getElementById('heroMatches').textContent = matchCount;
    document.getElementById('heroSaved').textContent = savedIds.length;
    document.getElementById('heroApplied').textContent = progressData.submitted.length;

    const urgentDeadlines = scholarships.filter(s => {
        const all = [...progressData.planning, ...progressData.inProgress, ...progressData.submitted];
        if (!all.includes(s.id)) return false;
        const days = Math.ceil((new Date(s.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        return days <= 7 && days > 0;
    }).length;
    document.getElementById('notificationBadge').textContent = urgentDeadlines;
}

// ─── Notifications ────────────────────────────────────────
function showNotifications() {
    const all = [...progressData.planning, ...progressData.inProgress, ...progressData.submitted];
    const upcoming = scholarships.filter(s => all.includes(s.id)).filter(s => { const days = Math.ceil((new Date(s.deadline) - new Date()) / (1000 * 60 * 60 * 24)); return days <= 7 && days > 0; });
    if (upcoming.length === 0) alert('🔔 No urgent deadlines!\n\nYou\'re all caught up.');
    else alert('🔔 Upcoming Deadlines:\n\n' + upcoming.map(s => `⚠️ ${s.title}\n   ${new Date(s.deadline).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })} (${Math.ceil((new Date(s.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left)`).join('\n\n'));
}

// ─── Update profile page UI based on whether profile exists ──
function updateProfilePageUI() {
    const hasProfile = !!currentProfile;
    document.getElementById('profilePageTitle').textContent = hasProfile ? 'Update Profile' : 'Setup Your Profile';
    document.getElementById('profileSubmitBtn').textContent = hasProfile ? '💾 Update Profile' : '💾 Save Profile & Find Matches';
    document.getElementById('dashboardProfileBtn').textContent = hasProfile ? 'Update My Profile →' : 'Create My Profile →';
}

// ─── Nav helpers ──────────────────────────────────────────
function goToProfileAndScroll() {
    showPage('profile');
    setTimeout(() => {
        document.getElementById('profileForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}
function goToHome() { showPage('dashboard', false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function showAboutModal() { document.getElementById('aboutModal').classList.add('active'); }
function closeAboutModal() { document.getElementById('aboutModal').classList.remove('active'); }
function showContactModal() { document.getElementById('contactModal').classList.add('active'); }
function closeContactModal() { document.getElementById('contactModal').classList.remove('active'); }

window.onclick = function (e) {
    if (e.target === document.getElementById('aboutModal')) closeAboutModal();
    if (e.target === document.getElementById('contactModal')) closeContactModal();
    if (e.target === document.getElementById('profileRequiredModal')) closeProfileRequiredModal();
}

// ─── Profile Form Submit (saves to DB) ───────────────────
window.addEventListener('load', function () {
    document.getElementById('searchInput').addEventListener('input', renderBrowsePage);
    document.getElementById('filterMajor').addEventListener('change', renderBrowsePage);
    document.getElementById('filterAmount').addEventListener('change', renderBrowsePage);
    document.getElementById('sortBy').addEventListener('change', renderBrowsePage);

    document.getElementById('profileForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const profile = {
            full_name: document.getElementById('fullName').value,
            year_level: document.getElementById('yearLevel').value,
            gpa: parseFloat(document.getElementById('gpa').value),
            major: document.getElementById('major').value,
            region: document.getElementById('region').value,
            gender: document.getElementById('gender').value,
            income: document.getElementById('income').value
        };
        try {
            const res = await fetch(`${API}/profile/save`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(profile) });
            if (res.ok) {
                currentProfile = profile;
                updateProfilePageUI();
                const btn = document.querySelector('.btn-submit');
                const orig = btn.textContent;
                btn.textContent = '✅ Profile Saved!'; btn.style.background = '#27AE60';
                setTimeout(() => { btn.textContent = orig; btn.style.background = ''; showPage('browse', true); updateDashboard(); }, 1500);
            }
        } catch (err) { alert('Failed to save profile. Is the server running?'); }
    });

    loadUserData();
});