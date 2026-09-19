document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.querySelector('.profile-form');
    const saveBtn = document.getElementById('saveBtn');
    const discardBtn = document.getElementById('discardBtn');
    const editBtn = document.getElementById('editBtn');

    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const changePhotoLabel = document.querySelector('label[for="imageUpload"]');

    // 1. Fetch User Data from Registration Baseline
    let userData = JSON.parse(localStorage.getItem('userData')) || {
        fullName: 'Tshire Retha',
        age: 24,
        homeGym: 'Metro Fitness Center',
        location: 'Gauteng, ZA',
        preferredTime: 'Evenings (17:00 - 20:00)',
        preferredDays: 'Mon, Tue, Thu, Fri',
        focusGoal: 'Hypertrophy / Bodybuilding',
        experience: 'intermediate',
        bio: 'Looking for a consistent partner for evening heavy lifting sessions.',
        avatarSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        is_profile_edited: false
    };

    // Populate Fields on Load
    function renderProfile() {
        // Form Fields
        document.getElementById('fullName').value = userData.fullName;
        document.getElementById('age').value = userData.age;
        document.getElementById('homeGym').value = userData.homeGym;
        document.getElementById('location').value = userData.location;
        document.getElementById('focusGoal').value = userData.focusGoal;
        document.getElementById('preferredTime').value = userData.preferredTime;
        document.getElementById('preferredDays').value = userData.preferredDays;
        document.getElementById('bio').value = userData.bio;
        if (document.getElementById('experience')) {
            document.getElementById('experience').value = userData.experience;
        }

        // Public Card Mirroring
        document.getElementById('cardPreferredName').textContent = userData.fullName;
        document.getElementById('cardGoal').textContent = userData.focusGoal;
        document.getElementById('cardLocation').textContent = userData.location;
        document.getElementById('cardGym').textContent = userData.homeGym;
        document.getElementById('cardTime').textContent = userData.preferredTime;
        document.getElementById('cardDays').textContent = userData.preferredDays;
        imagePreview.src = userData.avatarSrc;
    }

    renderProfile();

    // Photo Handler
    let originalAvatarSrc = userData.avatarSrc;
    changePhotoLabel.style.pointerEvents = 'none';
    changePhotoLabel.style.opacity = '0.5';

    imageUpload.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Form Controls
    function setFormDisabled(isDisabled) {
        const inputs = profileForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => input.disabled = isDisabled);

        imageUpload.disabled = isDisabled;
        if (isDisabled) {
            changePhotoLabel.style.pointerEvents = 'none';
            changePhotoLabel.style.opacity = '0.5';
        } else {
            changePhotoLabel.style.pointerEvents = 'auto';
            changePhotoLabel.style.opacity = '1';
        }
    }

    function toggleButtons(isEditing) {
        saveBtn.style.display = isEditing ? 'inline-block' : 'none';
        discardBtn.style.display = isEditing ? 'inline-block' : 'none';
        editBtn.style.display = isEditing ? 'none' : 'inline-block';
    }

    // Save Action (Toggle is_profile_edited = true)
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        userData = {
            fullName: document.getElementById('fullName').value.trim(),
            age: document.getElementById('age').value,
            homeGym: document.getElementById('homeGym').value.trim(),
            location: document.getElementById('location').value.trim(),
            preferredTime: document.getElementById('preferredTime').value,
            preferredDays: document.getElementById('preferredDays').value.trim(),
            focusGoal: document.getElementById('focusGoal').value,
            experience: document.getElementById('experience') ? document.getElementById('experience').value : userData.experience,
            bio: document.getElementById('bio').value.trim(),
            avatarSrc: imagePreview.src,
            is_profile_edited: true // Toggle Flag
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        originalAvatarSrc = userData.avatarSrc;

        renderProfile();
        setFormDisabled(true);
        toggleButtons(false);
    });

    discardBtn.addEventListener('click', function () {
        profileForm.reset();
        imagePreview.src = originalAvatarSrc;
        renderProfile();
        setFormDisabled(true);
        toggleButtons(false);
    });

    editBtn.addEventListener('click', function () {
        setFormDisabled(false);
        toggleButtons(true);
    });
});