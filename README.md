# HBL MicroFinance Bank RAG-Powered Chatbot

An AI-driven customer support chatbot for HBL MicroFinance Bank that provides accurate information about bank products and services using RAG (Retrieval-Augmented Generation) technology.

## Architecture

The system follows a modern web architecture with a clear separation between frontend and backend components:

### Backend Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  FastAPI API    │◄────┤  Agent System   │◄────┤  Supabase RAG   │
│  REST Endpoints │     │  Pydantic AI    │     │  Vector Store   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                                               ▲
        │                                               │
        │                                               │
        ▼                                               │
┌─────────────────┐                            ┌─────────────────┐
│                 │                            │                 │
│  SSE Streaming  │                            │  Web Crawling   │
│  Response Flow  │                            │  & Indexing     │
│                 │                            │                 │
└─────────────────┘                            └─────────────────┘
```

### Frontend Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React App      │◄────┤  Chatbot UI     │◄────┤  UI Components  │
│  Container      │     │  Components     │     │  & Styling      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                        ▲                      ▲
        │                        │                      │
        ▼                        ▼                      │
┌─────────────────┐     ┌─────────────────┐            │
│                 │     │                 │            │
│  API Services   │     │  State Management│            │
│  & Streaming    │     │  (React Hooks)  │            │
│                 │     │                 │            │
└─────────────────┘     └─────────────────┘            │
```

## Tech Stack

### Backend

- **API Framework**: FastAPI
- **Language Model**: Google Gemini 2.0 Flash
- **RAG Implementation**: Custom implementation using Pydantic AI
- **Vector Database**: Supabase with pgvector
- **Agent Framework**: Pydantic AI for agent definition and tool usage
- **Streaming Protocol**: Server-Sent Events (SSE)
- **Async Runtime**: Python asyncio for non-blocking operations
- **Document Processing**: Custom document crawling and processing pipeline
- **Dependency Management**: Python virtual environments with uv

### Frontend

- **Framework**: React with TypeScript
- **Styling**: Styled Components with a custom theme
- **State Management**: React Hooks (useState, useContext, useCallback)
- **API Communication**: Fetch API with streaming response handling
- **Content Rendering**: React Markdown with rehype plugins
- **Animation**: Framer Motion for UI transitions
- **Icons**: React Icons library
- **Build Tool**: Vite
- **Code Quality**: TypeScript strict mode, ESLint

## Features

### Intelligent Banking Assistant

- **Domain-Specific Knowledge**: Specialized in HBL MicroFinance Bank products and services
- **Contextual Answers**: Provides relevant information based on user queries
- **Information Boundary**: Focuses only on banking-related questions
- **Source Attribution**: References information sources when appropriate

### Enhanced RAG Capabilities

- **Vector Search**: Uses semantic search to find relevant documents
- **Tool-Based Retrieval**: Agent can use multiple tools to gather information
- **Multi-Document Reasoning**: Combines information from multiple sources
- **Fallback Mechanisms**: Gracefully handles queries outside its knowledge base

### Real-Time Streaming Interface

- **Token-by-Token Streaming**: Shows responses as they're being generated
- **Typing Indicator**: Visual feedback during response generation
- **Interrupt Capability**: Allows canceling ongoing responses

### User Interface

- **Responsive Design**: Adapts to desktop and mobile devices
- **Markdown Support**: Renders rich text formatting, code blocks, and links
- **Syntax Highlighting**: Formats code examples with proper highlighting
- **Intuitive Controls**: Simple interface with clear interaction patterns
- **Expandable Chat Panel**: Togglable UI that doesn't interrupt the main website experience

### Conversation Features

- **Chat History**: Maintains conversation context during a session
- **Message Timestamps**: Shows when messages were sent and received
- **Clear Conversation**: Option to reset the conversation history

## Project Structure

The project is organized into two main directories:

- **`/backend`**: Contains the FastAPI service, agent implementation, and RAG system
- **`/hbl-chatbot`**: Contains the React frontend application

---

