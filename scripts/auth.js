document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // 1. Inject Redirect Prompt Modal (HTML & CSS)
    const modalHTML = `
        <div id="authModal" class="auth-modal-overlay" style="display:none;">
            <div class="auth-modal-box">
                <h2>Access Restricted</h2>
                <p>Please register or log in to access this feature and connect with gym peers.</p>
                <div class="auth-modal-actions">
                    <a href="login.html" class="btn">Go to Login / Register</a>
                    <button type="button" id="closeModalBtn" class="btn btn-secondary">Stay on Home</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const authModal = document.getElementById('authModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // 2. Handle Navigation Visibility
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!isLoggedIn && href !== 'index.html') {
            // Hide protected links from the nav bar when logged out
            link.parentElement.style.display = 'none';
        }
    });

    // 3. Update Header Auth Area
    const authContainer = document.querySelector('.auth-buttons');
    if (authContainer) {
        if (isLoggedIn) {
            authContainer.innerHTML = `<button type="button" id="logoutBtn" class="btn-logout">LOGOUT</button>`;
            document.getElementById('logoutBtn').addEventListener('click', () => {
                localStorage.setItem('isLoggedIn', 'false');
                window.location.href = 'index.html';
            });
        } else {
            authContainer.innerHTML = `<a href="login.html" class="btn-auth-header">LOGIN / REGISTER</a>`;
        }
    }

    // 4. Access Guard for Protected Pages
    const protectedPages = ['gym-groups.html', 'peer-match.html', 'connect.html', 'profile.html'];
    if (!isLoggedIn && protectedPages.includes(currentPage)) {
        authModal.style.display = 'flex';
    }
});