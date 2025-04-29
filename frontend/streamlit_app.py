import streamlit as st
import os
import requests
from sidebar import render_sidebar
from chat import render_chat_ui

# Page configuration
st.set_page_config(
    page_title="Pydantic AI Assistant",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Very minimal CSS - just enough to fix the text visibility issue
minimal_css = """
<style>
    /* Make sure text in chat messages is visible */
    .stChatMessage div {
        color: #333333 !important;
    }
    
    /* Ensure code blocks are readable */
    .stChatMessage pre {
        background-color: #f0f0f0 !important;
    }
</style>
"""
st.markdown(minimal_css, unsafe_allow_html=True)

def init_session_state():
    """Initialize session state variables."""
    if "current_page" not in st.session_state:
        st.session_state.current_page = "chat"
    
    if "api_url" not in st.session_state:
        st.session_state.api_url = "http://localhost:8000"

def render_documentation_page():
    """Render the documentation browser page."""
    st.header("Pydantic AI Documentation")
    
    st.write("""
    This page allows you to browse through the Pydantic AI documentation directly.
    
    The documentation browser is currently under development. In the meantime, you can:
    1. Use the Chat feature to ask questions about Pydantic AI
    2. Visit the official documentation
    """)
    
    st.link_button("Visit Pydantic AI Documentation", "https://ai.pydantic.dev/")
    
    st.info("The documentation browser functionality will be available soon.")

def render_about_page():
    """Render the about page."""
    st.header("About Pydantic AI Documentation Assistant")
    
    st.write("""
    ## What is Pydantic AI?
    
    Pydantic AI is a powerful framework for building AI applications with type safety and validation.
    It extends the popular Pydantic library to provide tools for working with AI models, agents,
    and language processing capabilities.
    """)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Key Features")
        st.markdown("""
        - Instant, accurate responses
        - Code examples
        - Complete documentation access
        """)
    
    with col2:
        st.subheader("Technologies Used")
        st.markdown("""
        - Streamlit (Frontend)
        - FastAPI (Backend)
        - RAG Architecture
        """)

def main():
    """Main function to run the Streamlit app."""
    init_session_state()
    render_sidebar()
    
    # Render the appropriate page based on navigation
    if st.session_state.current_page == "chat":
        render_chat_ui()
    elif st.session_state.current_page == "docs":
        render_documentation_page()
    elif st.session_state.current_page == "about":
        render_about_page()

if __name__ == "__main__":
    main()