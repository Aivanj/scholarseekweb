const API = window.location.origin + '/api';

// ─── Tab Switching ────────────────────────────────────────
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');

    if (tab === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
    }

    // Clear messages on switch
    clearMessages();
}

// ─── Toggle Password Visibility ───────────────────────────
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    field.type = field.type === 'password' ? 'text' : 'password';
}

// ─── Handle Login ─────────────────────────────────────────
async function handleLogin(e) {
    e.preventDefault();
    clearMessages();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');

    setLoading(btn, true);

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            showError('loginError', data.error || 'Login failed. Please try again.');
        } else {
            // Save token and user info
            localStorage.setItem('ss_token', data.token);
            localStorage.setItem('ss_user', JSON.stringify(data.user));

            // Redirect to main app
            window.location.href = 'index.html';
        }
    } catch (err) {
        showError('loginError', 'Cannot connect to server. Make sure the server is running.');
    } finally {
        setLoading(btn, false);
    }
}

// ─── Handle Sign Up ───────────────────────────────────────
async function handleSignup(e) {
    e.preventDefault();
    clearMessages();

    const full_name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    const btn = document.getElementById('signupBtn');

    // Client-side validation
    if (password !== confirm) {
        showError('signupError', 'Passwords do not match.');
        return;
    }
    if (password.length < 6) {
        showError('signupError', 'Password must be at least 6 characters.');
        return;
    }

    setLoading(btn, true);

    try {
        const res = await fetch(`${API}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name, email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            showError('signupError', data.error || 'Sign up failed. Please try again.');
        } else {
            // Save token and redirect
            localStorage.setItem('ss_token', data.token);
            localStorage.setItem('ss_user', JSON.stringify(data.user));
            window.location.href = 'index.html';
        }
    } catch (err) {
        showError('signupError', 'Cannot connect to server. Make sure the server is running.');
    } finally {
        setLoading(btn, false);
    }
}

// ─── Helpers ──────────────────────────────────────────────
function showError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = '⚠️ ' + msg;
    el.style.display = 'block';
}

function showSuccess(id, msg) {
    const el = document.getElementById(id);
    el.textContent = '✅ ' + msg;
    el.style.display = 'block';
}

function clearMessages() {
    ['loginError', 'signupError', 'signupSuccess'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.textContent = ''; el.style.display = 'none'; }
    });
}

function setLoading(btn, loading) {
    btn.disabled = loading;
    btn.querySelector('.btn-text').style.display = loading ? 'none' : 'inline';
    btn.querySelector('.btn-loader').style.display = loading ? 'inline' : 'none';
}

// ─── Auto-redirect if already logged in ───────────────────
window.addEventListener('load', () => {
    if (localStorage.getItem('ss_token')) {
        window.location.href = 'index.html';
    }
});