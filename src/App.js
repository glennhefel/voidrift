import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import MediaDetail from './pages/Media';
import Top100Page from './pages/Top100';
import AddMediaForm from './pages/addmedia';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/media/:id" element={<MediaDetail />} />
            <Route path="/top100" element={<Top100Page />} />
            <Route path="/addmedia" element={<AddMediaForm />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;