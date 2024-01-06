import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import User from './components/User';
import './App.css';
import HKULogo from './components/HKU_Logo.png';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-background" />
          <div className="header-text">
            <h1>Amazon Web Service for Web Application Development</h1>
          </div>
        </header>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/user" element={<User />} />
          </Routes>
        </div>
        <footer className="App-footer">
          <img src={HKULogo} alt="HKU Logo" className="footer-logo" />
          <div>
            <h5>Created by EEE department</h5>
            <h5>Instructor: Dr. Albert T. L. Lee & Dr. G.K.H. Pang</h5>
            <h5>Student: Jiang Feiyu</h5>
            <h5>University of Hong Kong</h5>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;