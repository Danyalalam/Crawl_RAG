import streamlit as st
import requests
import time
from typing import Callable, Optional

def initialize_chat_state():
    """Initialize chat-related session state variables."""
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    if "conversation_id" not in st.session_state:
        st.session_state.conversation_id = None

def get_conversation_id() -> Optional[str]:
    """Get the current conversation ID."""
    return st.session_state.conversation_id

def set_conversation_id(conversation_id: str):
    """Set the conversation ID."""
    st.session_state.conversation_id = conversation_id

def add_message(role: str, content: str):
    """Add a message to the chat history."""
    st.session_state.messages.append({"role": role, "content": content})

def clear_chat():
    """Clear the chat history and reset conversation ID."""
    st.session_state.messages = []
    st.session_state.conversation_id = None

def ask_question(query: str, api_url: str, conversation_id: Optional[str] = None):
    """Send a question to the API and get a response."""
    try:
        payload = {"query": query}
        if conversation_id:
            payload["conversation_id"] = conversation_id

        response = requests.post(f"{api_url}/ask", json=payload, timeout=60)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Error asking question: {str(e)}")
        return {
            "response": f"Error: {str(e)}",
            "conversation_id": conversation_id or "error"
        }

# Update the render_chat_ui function

def render_chat_ui():
    """Render the chat interface."""
    initialize_chat_state()
    
    # Display chat header
    st.header("Chat with Pydantic AI Assistant")
    
    # Create a card-like container for introduction
    st.markdown("""
    <div style="background-color: #f8f9fa; padding: 1rem; border-radius: 10px; border-left: 4px solid #25c2a0; margin-bottom: 1rem;">
        <h4 style="color: #25c2a0; margin-top: 0;">Welcome to Pydantic AI Assistant</h4>
        <p style="color: #333333;">
        Ask any question about Pydantic AI framework, and get instant, accurate answers powered by our AI assistant.
        Try questions about installation, usage examples, API references, and more!
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Get API URL from session state
    api_url = st.session_state.get("api_url", "http://localhost:8000")
    
    # Create a container for the chat messages with a light background
    chat_container = st.container()
    with chat_container:
        # Display chat messages from history
        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"], unsafe_allow_html=False)
    
    # Chat input
    if prompt := st.chat_input("Ask about Pydantic AI..."):
        # Add user message to chat history
        add_message("user", prompt)
        
        # Display user message in chat message container
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Display assistant response in chat message container
        with st.chat_message("assistant"):
            message_placeholder = st.empty()
            message_placeholder.markdown("Thinking...")
            
            # Call API to get response
            response = ask_question(prompt, api_url, get_conversation_id())
            
            # Save the conversation ID from the response
            if "conversation_id" in response and response["conversation_id"]:
                set_conversation_id(response["conversation_id"])
                
            # Display the response
            full_response = response.get("response", "Sorry, I couldn't generate a response.")
            message_placeholder.markdown(full_response)
            
            # Add assistant response to chat history
            add_message("assistant", full_response)