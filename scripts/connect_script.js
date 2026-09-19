document.addEventListener('DOMContentLoaded', () => {
    const conversationList = document.getElementById('conversationList');
    const activeChatTitle = document.getElementById('activeChatTitle');
    const activeChatType = document.getElementById('activeChatType');
    const chatHistory = document.getElementById('chatHistory');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');

    // Default Chat Database
    const conversations = {
        '1': {
            name: 'Alex Rivera',
            type: 'Peer Connection',
            messages: [
                { sender: 'received', text: 'Hey! Are you planning to hit leg day tomorrow at Metro Fitness?', time: '10:14 AM' },
                { sender: 'sent', text: 'Yeah! Heading in around 6:00 PM. Need a spotter for squats?', time: '10:16 AM' }
            ]
        },
        '101': {
            name: 'Early Bird Powerlifters',
            type: 'Group Chat',
            messages: [
                { sender: 'received', text: 'Alex: Who is opening the floor at 06:00 AM Friday?', time: '08:30 AM' },
                { sender: 'received', text: 'Jordan: I have the keys!', time: '08:35 AM' }
            ]
        },
        '102': {
            name: 'Weekend Trail & Track Runners',
            type: 'Group Chat',
            messages: [
                { sender: 'received', text: 'Sarah: Park trail run starts at 07:30 AM sharp!', time: 'Yesterday' }
            ]
        },
        '103': {
            name: 'HIIT & Conditioning Crew',
            type: 'Group Chat',
            messages: [
                { sender: 'received', text: 'Coach: Bring kettlebells for tomorrow session.', time: '07:15 AM' }
            ]
        }
    };

    let currentChatId = '1';

    // Check if redirected from Groups page with a target join session
    const targetSession = JSON.parse(localStorage.getItem('activeTargetChat'));
    if (targetSession) {
        currentChatId = targetSession.id;

        // Ensure group entry exists
        if (!conversations[currentChatId]) {
            conversations[currentChatId] = {
                name: targetSession.name,
                type: 'Group Chat',
                messages: []
            };
        }

        // Apply Chat Preference Option
        if (targetSession.mode === 'fresh') {
            conversations[currentChatId].messages = [
                { sender: 'received', text: `System: You joined ${targetSession.name}. Chat reset to fresh feed.`, time: 'Just now' }
            ];
        }

        // Clear target state to prevent resetting on page refreshes
        localStorage.removeItem('activeTargetChat');
    }

    // Render Conversation List Sidebar
    function renderSidebar() {
        conversationList.innerHTML = '';
        Object.keys(conversations).forEach(id => {
            const chat = conversations[id];
            const lastMsg = chat.messages[chat.messages.length - 1]?.text || 'No messages yet';
            const isActive = id === currentChatId ? 'active' : '';

            const li = document.createElement('li');
            li.className = `chat-user-item ${isActive}`;
            li.setAttribute('data-id', id);
            li.innerHTML = `
                <div class="user-details">
                    <strong>${chat.name}</strong>
                    <span class="preview-text">${lastMsg}</span>
                </div>
            `;
            li.addEventListener('click', () => {
                currentChatId = id;
                renderSidebar();
                renderChat(currentChatId);
            });
            conversationList.appendChild(li);
        });
    }

    // Render Messages Stream
    function renderChat(id) {
        const chatData = conversations[id];
        if (!chatData) return;

        activeChatTitle.textContent = chatData.name;
        activeChatType.textContent = chatData.type;

        chatHistory.innerHTML = '';
        chatData.messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${msg.sender}`;
            msgDiv.innerHTML = `
                <p>${msg.text}</p>
                <span class="time">${msg.time}</span>
            `;
            chatHistory.appendChild(msgDiv);
        });

        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    renderSidebar();
    renderChat(currentChatId);

    // Send Message Handler
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        conversations[currentChatId].messages.push({
            sender: 'sent',
            text: text,
            time: timeStr
        });

        chatInput.value = '';
        renderSidebar();
        renderChat(currentChatId);
    });
});