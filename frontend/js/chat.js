class ChatManager {
    constructor() {
        this.messages = [];
        this.conversationId = null;
        this.isLoading = false;
        this.streamingMode = true; // Set to true to use streaming by default
        
        // DOM Elements
        this.chatContainer = document.getElementById('chat-container');
        this.chatForm = document.getElementById('chat-form');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    initEventListeners() {
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });
    }
    
    clear() {
        this.messages = [];
        this.conversationId = null;
        this.chatContainer.innerHTML = '';
    }
    
    addMessage(role, content) {
        const message = { role, content };
        this.messages.push(message);
        this.renderMessage(message);
    }
    
    formatMessage(content) {
        if (!content) return '';
        
        // Process code blocks first so we don't mess with their internal formatting
        const codeBlockRegex = /```([\s\S]*?)```/g;
        const codeBlocks = [];
        
        // Replace code blocks with placeholders
        content = content.replace(codeBlockRegex, (match, code) => {
            const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
            
            // Extract language if specified
            const langMatch = code.match(/^([a-zA-Z0-9_]+)\n/);
            let language = '';
            let processedCode = code;
            
            if (langMatch) {
                language = langMatch[1];
                processedCode = code.substring(langMatch[0].length);
            }
            
            codeBlocks.push({
                language: language,
                code: processedCode.trim()
            });
            
            return placeholder;
        });
        
        // Escape HTML in the non-code content
        let html = this.escapeHTML(content);
        
        // Format inline code (escaping is still needed for these)
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Format bold text
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Format italic text
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Format bullet points
        html = html.replace(/^- (.*?)$/gm, '<li>$1</li>').replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');
        
        // Remove doubled-up lists
        html = html.replace(/<\/ul><ul>/g, '');
        
        // Format paragraphs (but not inside lists)
        const paragraphs = [];
        html.split('\n\n').forEach(p => {
            if (p.trim()) {
                // Skip wrapping <ul> elements in <p>
                if (p.startsWith('<ul>') && p.endsWith('</ul>')) {
                    paragraphs.push(p);
                } else {
                    paragraphs.push(`<p>${p}</p>`);
                }
            }
        });
        html = paragraphs.join('');
        
        // Restore code blocks with proper formatting
        codeBlocks.forEach((block, index) => {
            const placeholder = `__CODE_BLOCK_${index}__`;
            const languageClass = block.language ? `language-${block.language}` : '';
            
            // Create properly formatted code block with language class for Prism
            const codeHtml = `<pre><code class="${languageClass}">${block.code}</code></pre>`;
            
            html = html.replace(placeholder, codeHtml);
        });
        
        return html;
    }
    
    renderMessage(message) {
        const { role, content } = message;
        
        const messageEl = document.createElement('div');
        messageEl.classList.add('message', role);
        
        const avatarEl = document.createElement('div');
        avatarEl.classList.add('avatar');
        avatarEl.textContent = role === 'user' ? 'U' : 'AI';
        
        const contentEl = document.createElement('div');
        contentEl.classList.add('message-content');
        
        // Process markdown and code blocks
        const formattedContent = this.formatMessage(content);
        contentEl.innerHTML = formattedContent;
        
        this.applyCodeFormatting(contentEl, role);
        
        if (role === 'user') {
            messageEl.appendChild(contentEl);
            messageEl.appendChild(avatarEl);
        } else {
            messageEl.appendChild(avatarEl);
            messageEl.appendChild(contentEl);
        }
        
        this.chatContainer.appendChild(messageEl);
        
        // Scroll to bottom
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
    
    // Update this method in your ChatManager class to create better code blocks

    applyCodeFormatting(contentEl, role) {
        // Add specific styling for code blocks
        const codeBlocks = contentEl.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            // Add a stylish "copy" button with text
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-code-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.title = 'Copy code';
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(block.textContent).then(() => {
                    copyBtn.classList.add('copied');
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                });
            });
            
            // Add line numbers for multiline code
            const codeLines = block.textContent.split('\n');
            if (codeLines.length > 1) {
                block.innerHTML = codeLines.map(line => 
                    `<span class="line">${line}</span>`
                ).join('\n');
            }
            
            // Insert the copy button into the pre element
            const preEl = block.parentElement;
            preEl.style.position = 'relative';
            if (!preEl.querySelector('.copy-code-btn')) {
                preEl.insertBefore(copyBtn, preEl.firstChild);
            }
        });
        
        // Apply syntax highlighting to code blocks
        if (role === 'assistant') {
            setTimeout(() => {
                Prism.highlightAllUnder(contentEl);
                this.updateCodeBlockLanguages(contentEl);
                
                // Add animated entrance to code blocks
                contentEl.querySelectorAll('pre').forEach((block, index) => {
                    block.style.animationDelay = `${index * 0.1}s`;
                });
            }, 0);
        }
    }
    
    updateCodeBlockLanguages(container) {
        // Add language labels to code blocks
        container.querySelectorAll('pre code[class*="language-"]').forEach(block => {
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
    
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        
        if (!message || this.isLoading) return;
        
        // Clear input
        this.chatInput.value = '';
        
        // Add user message to chat
        this.addMessage('user', message);
        
        // Start loading state
        this.isLoading = true;
        this.setLoadingState(true);
        
        if (this.streamingMode) {
            await this.sendStreamingMessage(message);
        } else {
            await this.sendRegularMessage(message);
        }
        
        // End loading state
        this.isLoading = false;
        this.setLoadingState(false);
    }
    
    // Update the sendStreamingMessage method to remove is_last handling

    async sendStreamingMessage(message) {
        try {
            // Create a placeholder for assistant response
            const assistantMessageElement = this.createAssistantMessagePlaceholder();
            
            // Start streaming
            const { stream, conversationId } = await api.streamQuestion(message, this.conversationId);
            
            // Update conversation ID if received
            if (conversationId) {
                this.conversationId = conversationId;
            }
            
            // Process the stream
            const reader = stream.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                // Decode chunk
                const chunk = decoder.decode(value, { stream: true });
                
                // Process Server-Sent Events
                const messages = chunk.split('\n\n').filter(msg => msg.trim());
                
                for (const message of messages) {
                    if (!message.startsWith('data: ')) continue;
                    
                    try {
                        const data = JSON.parse(message.substring(6));
                        
                        if (data.error) {
                            console.error("Stream error:", data.error);
                            assistantMessageElement.innerHTML = `<p class="error">Error: ${data.error}</p>`;
                            continue;
                        }
                        
                        if (data.done) {
                            console.log("Stream completed");
                            continue;
                        }
                        
                        if (data.text) {
                            // Append new text to full response
                            fullResponse += data.text;
                            
                            // Update UI with formatted content
                            this.updateAssistantMessageContent(assistantMessageElement, fullResponse);
                        }
                    } catch (e) {
                        console.error('Error parsing SSE message:', e);
                    }
                }
            }
            
            // Save the complete message to history
            if (fullResponse) {
                this.messages.push({ role: 'assistant', content: fullResponse });
            }
            
        } catch (error) {
            console.error('Error with streaming message:', error);
            this.addMessage('assistant', `Error: ${error.message}`);
        }
    }
    
    async sendRegularMessage(message) {
        try {
            // Create a placeholder for assistant response
            const loadingId = this.addLoadingMessage();
            
            // Send message to API
            const response = await api.askQuestion(message, this.conversationId);
            
            // Save conversation ID
            if (response.conversation_id) {
                this.conversationId = response.conversation_id;
            }
            
            // Remove loading message
            this.removeLoadingMessage(loadingId);
            
            // Add assistant response
            this.addMessage('assistant', response.response || 'Sorry, I couldn\'t generate a response.');
        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage('assistant', `Error: ${error.message}`);
        }
    }
    
    createAssistantMessagePlaceholder() {
        const messageEl = document.createElement('div');
        messageEl.classList.add('message', 'assistant');
        
        const avatarEl = document.createElement('div');
        avatarEl.classList.add('avatar');
        avatarEl.textContent = 'AI';
        
        const contentEl = document.createElement('div');
        contentEl.classList.add('message-content');
        contentEl.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
        
        messageEl.appendChild(avatarEl);
        messageEl.appendChild(contentEl);
        
        this.chatContainer.appendChild(messageEl);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        
        return contentEl;
    }
    
    updateAssistantMessageContent(contentElement, text) {
        // Format the content with markdown and code formatting
        const formattedContent = this.formatMessage(text);
        
        // Update the element content
        contentElement.innerHTML = formattedContent;
        
        // Apply code formatting and highlighting
        this.applyCodeFormatting(contentElement, 'assistant');
        
        // Scroll to bottom
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
    
    addLoadingMessage() {
        const loadingId = Date.now().toString();
        
        const messageEl = document.createElement('div');
        messageEl.classList.add('message', 'assistant');
        messageEl.dataset.id = loadingId;
        
        const avatarEl = document.createElement('div');
        avatarEl.classList.add('avatar');
        avatarEl.textContent = 'AI';
        
        const contentEl = document.createElement('div');
        contentEl.classList.add('message-content');
        
        const typingEl = document.createElement('div');
        typingEl.classList.add('typing');
        typingEl.innerHTML = '<span></span><span></span><span></span>';
        
        contentEl.appendChild(typingEl);
        
        messageEl.appendChild(avatarEl);
        messageEl.appendChild(contentEl);
        
        this.chatContainer.appendChild(messageEl);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        
        return loadingId;
    }
    
    removeLoadingMessage(id) {
        const loadingMessage = document.querySelector(`.message[data-id="${id}"]`);
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }
    
    setLoadingState(isLoading) {
        this.sendButton.disabled = isLoading;
        this.chatInput.disabled = isLoading;
    }
    
    toggleStreamingMode() {
        this.streamingMode = !this.streamingMode;
        console.log(`Streaming mode ${this.streamingMode ? 'enabled' : 'disabled'}`);
        return this.streamingMode;
    }
}

// Initialize chat manager
const chatManager = new ChatManager();