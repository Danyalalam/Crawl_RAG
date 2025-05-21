document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Initialize settings panel
    initSettings();
    
    // Initialize API URL
    initApiUrl();
    
    // Initialize clear conversation button
    initClearConversation();
    
    // Initialize code blocks
    initCodeBlocks();
    
    // Initialize streaming toggle
    initStreamingToggle();
    
    // Initialize chat input handling
    initChatInput();
});

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }
    
    // Listen for theme toggle changes
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });
}

function initSettings() {
    const settingsToggle = document.querySelector('.settings-toggle');
    if (!settingsToggle) return;
    
    settingsToggle.addEventListener('click', () => {
        document.querySelector('.floating-settings').classList.toggle('active');
    });
}

function initApiUrl() {
    const apiUrlInput = document.getElementById('api-url');
    if (!apiUrlInput) return;
    
    // Check if user has a saved API URL
    const savedApiUrl = localStorage.getItem('apiUrl');
    if (savedApiUrl && typeof api !== 'undefined') {
        apiUrlInput.value = savedApiUrl;
        api.setBaseUrl(savedApiUrl);
    }
    
    // Listen for API URL changes
    apiUrlInput.addEventListener('change', () => {
        const url = apiUrlInput.value.trim();
        localStorage.setItem('apiUrl', url);
        
        if (typeof api !== 'undefined') {
            api.setBaseUrl(url);
            showToast(`API URL updated to: ${url}`, 'info');
        }
    });
}

function initClearConversation() {
    const clearButton = document.getElementById('clear-chat');
    if (!clearButton || typeof chatManager === 'undefined') return;
    
    clearButton.addEventListener('click', () => {
        chatManager.clear();
        showToast('Chat cleared', 'info');
    });
}

function initCodeBlocks() {
    // Handle code block language labels
    function updateCodeBlockLanguages() {
        document.querySelectorAll('pre code[class*="language-"]').forEach(block => {
            const languageClass = Array.from(block.classList)
                .find(cls => cls.startsWith('language-'));
            
            if (languageClass) {
                const language = languageClass.replace('language-', '');
                if (language) {
                    const preBlock = block.parentElement;
                    preBlock.setAttribute('data-language', language);
                    preBlock.classList.add(`language-${language}`);
                }
            }
        });
    }

    // Add observer to update code blocks when content changes
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
        const observer = new MutationObserver(() => {
            updateCodeBlockLanguages();
        });
        
        observer.observe(chatContainer, { 
            childList: true,
            subtree: true
        });
    }
}

function initStreamingToggle() {
    const streamingToggle = document.getElementById('streaming-toggle');
    if (!streamingToggle || typeof chatManager === 'undefined') return;
    
    // Make sure toggle shows correct initial state
    streamingToggle.checked = chatManager.streamingMode;
    
    streamingToggle.addEventListener('change', function() {
        const isEnabled = chatManager.toggleStreamingMode();
        this.checked = isEnabled;
        
        // Show toast to confirm mode change
        showToast(`Streaming mode ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
    });
}

function initChatInput() {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    
    if (chatForm && typeof chatManager !== 'undefined') {
        // Ensure form submission is handled correctly
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            chatManager.sendMessage();
        });
    }
    
    if (chatInput) {
        // Ensure the input is clickable and focusable
        chatInput.addEventListener('click', function(e) {
            e.stopPropagation();
            this.focus();
        });
        
        // Try to focus input after a short delay
        setTimeout(() => {
            chatInput.focus();
        }, 500);
    }
    
    // Show a toast message to confirm the chat is ready
    showToast('Chat is ready! You can type your questions now.', 'info');
}

function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.classList.add('toast-container');
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.classList.add('toast', `toast-${type}`);
    
    // Add icon to toast
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}