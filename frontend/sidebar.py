import streamlit as st
from chat import clear_chat

def render_sidebar():
    """Render the sidebar with navigation and controls."""
    with st.sidebar:
        # App title and logo
        col1, col2 = st.columns([1, 3])
        with col1:
            st.image("https://raw.githubusercontent.com/pydantic/pydantic/main/docs/favicon.png", width=50)
        with col2:
            st.title("Pydantic AI")
        
        st.markdown("---")
        
        # Navigation
        st.subheader("Navigation")
        
        if st.button("💬 Chat", use_container_width=True):
            st.session_state.current_page = "chat"
            st.rerun()
            
        if st.button("📚 Documentation", use_container_width=True):
            st.session_state.current_page = "docs"
            st.rerun()
            
        if st.button("ℹ️ About", use_container_width=True):
            st.session_state.current_page = "about"
            st.rerun()
        
        st.markdown("---")
        
        # API Settings
        st.subheader("Settings")
        
        api_url = st.text_input(
            "Backend API URL", 
            value=st.session_state.get("api_url", "http://localhost:8000")
        )
        if "api_url" not in st.session_state or api_url != st.session_state.api_url:
            st.session_state.api_url = api_url
        
        # Check API connection
        if st.button("Test Connection", use_container_width=True):
            try:
                import requests
                response = requests.get(f"{api_url}/health", timeout=5)
                if response.status_code == 200:
                    st.success("Connected to API successfully!")
                else:
                    st.error(f"Failed to connect: Status code {response.status_code}")
            except Exception as e:
                st.error(f"Failed to connect: {str(e)}")
        
        # Chat controls
        st.markdown("---")
        st.subheader("Chat Controls")
        
        if st.button("Clear Conversation", type="primary", use_container_width=True):
            clear_chat()
            st.rerun()
        
        # Mode selection
        st.markdown("---")
        theme_mode = st.selectbox(
            "Theme",
            options=["Light", "Dark", "System"],
            index=0
        )
        
        # Footer
        st.markdown("---")
        st.caption("© 2025 Pydantic AI Documentation Assistant")