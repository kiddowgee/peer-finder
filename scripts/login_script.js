document.addEventListener('DOMContentLoaded', () => {
    // Tab Elements
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabRegisterBtn = document.getElementById('tabRegisterBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Multi-Step Elements
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const dots = document.querySelectorAll('.step-dot');

    // Tab Navigation
    tabLoginBtn.addEventListener('click', () => {
        tabLoginBtn.classList.add('active');
        tabRegisterBtn.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    tabRegisterBtn.addEventListener('click', () => {
        tabRegisterBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    });

    // Step Navigation Handlers
    document.getElementById('nextToStep2').addEventListener('click', () => {
        if (validateStep(step1)) {
            step1.style.display = 'none';
            step2.style.display = 'block';
            updateDots(1);
        }
    });

    document.getElementById('backToStep1').addEventListener('click', () => {
        step2.style.display = 'none';
        step1.style.display = 'block';
        updateDots(0);
    });

    document.getElementById('nextToStep3').addEventListener('click', () => {
        if (validateStep(step2)) {
            step2.style.display = 'none';
            step3.style.display = 'block';
            updateDots(2);
        }
    });

    document.getElementById('backToStep2').addEventListener('click', () => {
        step3.style.display = 'none';
        step2.style.display = 'block';
        updateDots(1);
    });

    function updateDots(activeIdx) {
        dots.forEach((dot, idx) => {
            if (idx === activeIdx) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    function validateStep(container) {
        const requiredInputs = container.querySelectorAll('[required]');
        for (let input of requiredInputs) {
            if (!input.checkValidity()) {
                input.reportValidity();
                return false;
            }
        }
        return true;
    }

    // Login Form Submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'peer-match.html'; // Direct straight to main feed
    });

    // Registration Form Submit (The Instant-Mirror Principle)
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect inputs & map ghost placeholders for skipped optional fields
        const rawDays = document.getElementById('regDays').value.trim();
        const rawBio = document.getElementById('regBio').value.trim();

        const profileData = {
            fullName: document.getElementById('regFullName').value.trim(),
            age: document.getElementById('regAge').value,
            email: document.getElementById('regEmail').value.trim(),
            homeGym: document.getElementById('regGym').value.trim(),
            location: document.getElementById('regLocation').value.trim(),
            preferredTime: document.getElementById('regTimeSlot').value,
            preferredDays: rawDays !== '' ? rawDays : 'Flexible Days', // Ghost Placeholder
            focusGoal: document.getElementById('regGoal').value,
            experience: document.getElementById('regExperience').value,
            bio: rawBio !== '' ? rawBio : 'Open to any workout vibe!', // Ghost Placeholder
            avatarSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', // Standard avatar
            is_profile_edited: false
        };

        // Store Session & Data Architecture
        localStorage.setItem('userData', JSON.stringify(profileData));
        localStorage.setItem('isLoggedIn', 'true');

        // Direct straight to main matching feed (No redundant review steps)
        window.location.href = 'peer-match.html';
    });
});