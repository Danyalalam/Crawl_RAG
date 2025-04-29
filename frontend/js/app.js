document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize API URL
    initApiUrl();
    
    // Initialize clear conversation button
    initClearConversation();
    
    // Initialize test connection button
    initTestConnection();
    
    // Initialize mobile menu toggle
    initMobileMenu();
});

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
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

function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    const pages = document.querySelectorAll('.page');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageName = button.dataset.page;
            
            // Deactivate all buttons and pages
            navButtons.forEach(btn => btn.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Activate clicked button and corresponding page
            button.classList.add('active');
            document.getElementById(`${pageName}-page`).classList.add('active');
        });
    });
}

function initApiUrl() {
    const apiUrlInput = document.getElementById('api-url');
    
    // Check if user has a saved API URL
    const savedApiUrl = localStorage.getItem('apiUrl');
    if (savedApiUrl) {
        apiUrlInput.value = savedApiUrl;
        api.setBaseUrl(savedApiUrl);
    }
    
    // Listen for API URL changes
    apiUrlInput.addEventListener('change', () => {
        const url = apiUrlInput.value.trim();
        localStorage.setItem('apiUrl', url);
        api.setBaseUrl(url);
        
        // Test connection automatically when URL changes
        testConnection();
    });
}

function initClearConversation() {
    const clearButton = document.getElementById('clear-chat');
    clearButton.addEventListener('click', () => {
        chatManager.clear();
    });
}

async function testConnection() {
    const testButton = document.getElementById('test-connection');
    
    testButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
    testButton.disabled = true;
    
    try {
        const response = await api.healthCheck();
        if (response.status === 'ok') {
            showToast('Connected to API successfully!', 'success');
        } else {
            showToast('API connection failed: ' + response.message, 'error');
        }
    } catch (error) {
        showToast('API connection failed: ' + error.message, 'error');
    } finally {
        testButton.innerHTML = '<i class="fas fa-network-wired"></i> Test Connection';
        testButton.disabled = false;
    }
}

function initTestConnection() {
    const testButton = document.getElementById('test-connection');
    testButton.addEventListener('click', testConnection);
}

function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        mobileToggle.innerHTML = sidebar.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
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
    toast.innerHTML = message;
    
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

// Add CSS for toast
const toastStyles = `
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.toast {
    padding: 12px 16px;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    animation: toast-enter 0.3s ease;
    min-width: 250px;
}

.toast-success {
    background-color: var(--primary);
}

.toast-error {
    background-color: #e74c3c;
}

.toast-info {
    background-color: var(--secondary);
}

.toast-fade-out {
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 0.3s, transform 0.3s;
}

@keyframes toast-enter {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
`;

// Add toast styles to document
document.head.insertAdjacentHTML('beforeend', `<style>${toastStyles}</style>`);

// Add to d:\Crawl_RAG\frontend\js\app.js after document ready

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
    const observer = new MutationObserver(mutations => {
        updateCodeBlockLanguages();
    });
    
    observer.observe(chatContainer, { 
        childList: true,
        subtree: true
    });
}

// Add toggle for streaming mode
const streamingToggle = document.getElementById('streaming-toggle');
if (streamingToggle) {
    streamingToggle.addEventListener('change', function() {
        const isEnabled = chatManager.toggleStreamingMode();
        this.checked = isEnabled;
    });
}