document.addEventListener('DOMContentLoaded', () => {
    const workoutType = document.getElementById('workoutType');
    const experienceLevel = document.getElementById('experienceLevel');
    const timeWindow = document.getElementById('timeWindow');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const peerCards = document.querySelectorAll('.peer-card');

    // 1. Live Filter Logic
    function filterPeers() {
        const typeVal = workoutType.value;
        const levelVal = experienceLevel.value;
        const timeVal = timeWindow.value;

        peerCards.forEach(card => {
            const cardFocus = card.getAttribute('data-focus');
            const cardLevel = card.getAttribute('data-level');
            const cardTime = card.getAttribute('data-time');

            const matchType = (typeVal === 'all' || cardFocus === typeVal);
            const matchLevel = (levelVal === 'any' || cardLevel === levelVal);
            const matchTime = (timeVal === 'any' || cardTime === timeVal);

            if (matchType && matchLevel && matchTime) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    workoutType.addEventListener('change', filterPeers);
    experienceLevel.addEventListener('change', filterPeers);
    timeWindow.addEventListener('change', filterPeers);

    resetFiltersBtn.addEventListener('click', () => {
        workoutType.value = 'all';
        experienceLevel.value = 'any';
        timeWindow.value = 'any';
        filterPeers();
    });

    // 2. Connect / Buddy Request Handler
    document.querySelectorAll('.connect-peer-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.peer-card');
            const peerId = card.getAttribute('data-id');
            const peerName = card.getAttribute('data-name');

            // Store active target session to open chat on Connect page
            const targetChatSession = {
                id: peerId,
                name: peerName,
                type: 'Peer Connection',
                mode: 'retrieve'
            };

            localStorage.setItem('activeTargetChat', JSON.stringify(targetChatSession));

            // Redirect to Connect Page
            window.location.href = 'connect.html';
        });
    });
});