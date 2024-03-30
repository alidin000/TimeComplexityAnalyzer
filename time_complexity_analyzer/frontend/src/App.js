// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CalculatorPage from './components/CalculatorPage';
import LearningPage from './components/LearningPage';
import Login from './components/Login';
import SignUp from './components/SignUp';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      executionTime: 0,
      result: '',
      isLoggedIn: false,
    };
  }

  handleCalculation = ({ nValue, machineType, language, algorithm }) => {
    // Perform calculation here and update execution time and result state
    // For demo purposes, simply setting execution time to a random value
    const randomExecutionTime = Math.floor(Math.random() * 1000);
    this.setState({ executionTime: randomExecutionTime });

    // For demo purposes, setting result to a dummy value
    this.setState({ result: 'Dummy Result' });
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Header isLoggedIn={this.state.isLoggedIn} />
          <Routes>
            <Route
              path="/calculator"
              element={
                <div className="calculator-page">
                  <CalculatorPage
                    handleCalculation={this.handleCalculation}
                    executionTime={this.state.executionTime}
                    result={this.state.result}
                  />
                </div>
              }
            />
            <Route path="/learning" element={<div className="learning"><LearningPage /></div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
