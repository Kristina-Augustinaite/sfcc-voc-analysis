import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { AppProvider } from './context/AppContext';

// Pages
import Dashboard from './pages/Dashboard';
import Reviews from './pages/Reviews';
import ThemeAnalysis from './pages/ThemeAnalysis';
import Settings from './pages/Settings';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ReviewDetail from './components/ReviewDetail';

// Global styles
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.main`
  flex: 1;
`;

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContainer>
          <Header />
          <MainContent>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/reviews/:id" element={<ReviewDetail />} />
              <Route path="/themes" element={<ThemeAnalysis />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </MainContent>
          <Footer />
        </AppContainer>
      </Router>
    </AppProvider>
  );
}

export default App; 