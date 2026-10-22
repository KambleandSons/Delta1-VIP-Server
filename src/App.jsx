import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import JourneyPage from './pages/JourneyPage';
import LanguagesPage from './pages/LanguagesPage';
import ProPage from './pages/ProPage';
import CalculatorPage from './pages/CalculatorPage';
import FastStartPage from './pages/FastStartPage';
import WalletsPage from './pages/WalletsPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/journey/index.html" element={<Navigate to="/journey" replace />} />
          <Route path="/languages" element={<LanguagesPage />} />
          <Route path="/languages/index.html" element={<Navigate to="/languages" replace />} />
          <Route path="/pro" element={<ProPage />} />
          <Route path="/pro/index.html" element={<Navigate to="/pro" replace />} />
          <Route path="/tools/calculator" element={<CalculatorPage />} />
          <Route path="/tools/calculator/index.html" element={<Navigate to="/tools/calculator" replace />} />
          <Route path="/tools/faststart" element={<FastStartPage />} />
          <Route path="/tools/faststart/index.html" element={<Navigate to="/tools/faststart" replace />} />
          <Route path="/wallets" element={<WalletsPage />} />
          <Route path="/wallets/index.html" element={<Navigate to="/wallets" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
