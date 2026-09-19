document.addEventListener('DOMContentLoaded', () => {
    // Search & Filter Elements
    const searchInput = document.getElementById('groupSearchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const groupGrid = document.getElementById('groupGrid');

    // Create Group Modal Elements
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const createGroupModal = document.getElementById('createGroupModal');
    const createGroupForm = document.getElementById('createGroupForm');

    // Join Group Modal Elements
    const joinModal = document.getElementById('joinModal');
    const joinModalTitle = document.getElementById('joinModalTitle');
    const joinModalForm = document.getElementById('joinModalForm');
    const closeJoinModalBtn = document.getElementById('closeJoinModalBtn');

    let pendingGroupData = null;

    // -------------------------------------------------------------
    // 1. Create Group Modal Handlers
    // -------------------------------------------------------------
    if (openModalBtn && createGroupModal) {
        openModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            createGroupModal.style.display = 'flex';
        });
    }

    if (closeModalBtn && createGroupModal) {
        closeModalBtn.addEventListener('click', () => {
            createGroupModal.style.display = 'none';
        });
    }

    // Close Create Modal on Overlay Click
    if (createGroupModal) {
        createGroupModal.addEventListener('click', (e) => {
            if (e.target === createGroupModal) {
                createGroupModal.style.display = 'none';
            }
        });
    }

    // Render Custom Group Card HTML
    function renderCardHTML(group) {
        const badgeText = group.category.charAt(0).toUpperCase() + group.category.slice(1);
        return `
            <article class="card group-card" data-id="${group.id}" data-name="${group.name}" data-category="${group.category}">
                <div class="group-header">
                    <h3>${group.name}</h3>
                    <span class="group-badge">${badgeText}</span>
                </div>
                <div class="group-details">
                    <p><strong>Gym:</strong> ${group.gym}</p>
                    <p><strong>Schedule:</strong> ${group.schedule}</p>
                    <p><strong>Members:</strong> <span class="member-count">${group.members}</span> active members</p>
                    <p class="group-desc">${group.desc}</p>
                </div>
                <button type="button" class="btn join-btn">Join Group</button>
            </article>
        `;
    }

    // Load saved groups from LocalStorage on page load
    let customGroups = JSON.parse(localStorage.getItem('customGymGroups')) || [];
    customGroups.forEach(group => {
        groupGrid.insertAdjacentHTML('afterbegin', renderCardHTML(group));
    });

    // Create Group Form Submission
    if (createGroupForm) {
        createGroupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newGroup = {
                id: Date.now().toString(),
                name: document.getElementById('newGroupName').value.trim(),
                gym: document.getElementById('newGroupGym').value.trim(),
                category: document.getElementById('newGroupCategory').value,
                schedule: document.getElementById('newGroupSchedule').value.trim(),
                desc: document.getElementById('newGroupDesc').value.trim() || 'No description provided.',
                members: 1
            };

            // Save to LocalStorage
            customGroups.push(newGroup);
            localStorage.setItem('customGymGroups', JSON.stringify(customGroups));

            // Inject into grid
            groupGrid.insertAdjacentHTML('afterbegin', renderCardHTML(newGroup));

            // Reset form & close modal
            createGroupForm.reset();
            createGroupModal.style.display = 'none';

            // Re-bind join events for newly created group
            bindJoinButtons();
        });
    }

    // -------------------------------------------------------------
    // 2. Join Group Modal Handlers
    // -------------------------------------------------------------
    function bindJoinButtons() {
        document.querySelectorAll('.join-btn').forEach(btn => {
            // Remove existing listener to prevent duplicate bindings
            btn.onclick = null;

            btn.onclick = function (e) {
                e.preventDefault();
                const card = this.closest('.group-card');
                pendingGroupData = {
                    id: card.getAttribute('data-id') || Date.now().toString(),
                    name: card.getAttribute('data-name') || card.querySelector('h3').textContent,
                    type: 'Group'
                };

                if (joinModalTitle) {
                    joinModalTitle.textContent = `Join "${pendingGroupData.name}"`;
                }
                if (joinModal) {
                    joinModal.style.display = 'flex';
                }
            };
        });
    }

    bindJoinButtons();

    if (closeJoinModalBtn && joinModal) {
        closeJoinModalBtn.addEventListener('click', () => {
            joinModal.style.display = 'none';
            pendingGroupData = null;
        });
    }

    if (joinModalForm) {
        joinModalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!pendingGroupData) return;

            const selectedMode = document.querySelector('input[name="chatMode"]:checked').value;

            // Save target group chat data for Connect page
            const targetChatSession = {
                id: pendingGroupData.id,
                name: pendingGroupData.name,
                type: 'Group',
                mode: selectedMode
            };

            localStorage.setItem('activeTargetChat', JSON.stringify(targetChatSession));

            // Redirect to Connect
            window.location.href = 'connect.html';
        });
    }

    // -------------------------------------------------------------
    // 3. Search & Category Filters
    // -------------------------------------------------------------
    function filterGroups() {
        const query = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;

        document.querySelectorAll('.group-card').forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const cardCategory = card.getAttribute('data-category');

            const matchesQuery = cardText.includes(query);
            const matchesCategory = selectedCategory === 'all' || cardCategory === selectedCategory;

            card.style.display = (matchesQuery && matchesCategory) ? 'flex' : 'none';
        });
    }

    if (searchInput) searchInput.addEventListener('input', filterGroups);
    if (categoryFilter) categoryFilter.addEventListener('change', filterGroups);
});