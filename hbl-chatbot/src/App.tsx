import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { checkHealth } from './services/api';
import Header from './components/HBLSite/Header';
import Hero from './components/HBLSite/Hero';
import Products from './components/HBLSite/Products';
import Footer from './components/HBLSite/Footer';
import ChatBot from './components/ChatBot/ChatBot';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
`;

const ApiAlert = styled.div`
  position: fixed;
  top: 70px;
  right: 20px;
  padding: 12px 20px;
  background-color: #dc3545;
  color: white;
  border-radius: 6px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    font-size: 20px;
  }
`;

const App: React.FC = () => {
  const [apiConnected, setApiConnected] = useState<boolean>(true);
  
  // Check API connection on load
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const isHealthy = await checkHealth();
        setApiConnected(isHealthy);
      } catch (error) {
        setApiConnected(false);
      }
    };
    
    checkApiHealth();
    
    // Set up periodic health checks
    const intervalId = setInterval(checkApiHealth, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <AppContainer>
      <Header />
      
      {!apiConnected && (
        <ApiAlert>
          <i className="fas fa-exclamation-triangle"></i>
          The chat service is currently unavailable. Please try again later.
        </ApiAlert>
      )}
      
      <MainContent>
        <Hero />
        <Products />
        {/* Add more sections as needed */}
      </MainContent>
      
      <Footer />
      
      {/* ChatBot (will show regardless of API connection) */}
      <ChatBot />
    </AppContainer>
  );
};

export default App;