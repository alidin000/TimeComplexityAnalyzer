// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CalculatorPage from './components/CalculatorPage';
import LearningPage from './components/LearningPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import 'primeflex/primeflex.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <div className="App">
                <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                <Routes>
                    <Route
                        path="/"
                        element={<CalculatorPage />}
                    />
                    <Route path="/learning" element={<LearningPage />} />
                    <Route
                        path="/login"
                        element={<Login handleLogin={handleLogin} />}
                    />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
