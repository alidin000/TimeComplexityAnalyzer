import React, { useState } from "react";
import algorithmsData from './algorithmsData.json';


const LearningPage = () => {
  const [selectedTab, setSelectedTab] = useState('Algorithms');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithmsData[0].name);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="learning-page" style={{ display: 'flex', flexDirection: 'row' }}>
      <div className="left-panel" style={{ width: '200px', marginRight: '20px' }}>
        <h2 className="subtopics-heading">Algorithm Topics</h2>
        <div className="card">
          <AlgorithmTopicsList onSelect={setSelectedAlgorithm} />
        </div>
      </div>
      <div className="right-panel" style={{ flex: 1 }}>
        <div className="tab-switcher">
          <TabButton onClick={() => handleTabChange('Algorithms')} active={selectedTab === 'Algorithms'}>Algorithms</TabButton>
          <TabButton onClick={() => handleTabChange('Quizzes')} active={selectedTab === 'Quizzes'}>Quizzes</TabButton>
        </div>
        <div className="topics-section">
          {selectedTab === 'Algorithms' ? <AlgorithmsContent algorithmName={selectedAlgorithm} /> : <QuizzesContent algorithm={algorithmsData.find(algo => algo.name === selectedAlgorithm)} />}
        </div>
      </div>
    </div>
  );
};

const AlgorithmTopicsList = ({ onSelect }) => {
  return (
    <div className="algorithm-topics-list" style={{ display: 'flex', flexDirection: 'column' }}>
      {algorithmsData.map((algo, index) => (
        <button key={index} onClick={() => onSelect(algo.name)} style={{ padding: '10px', margin: '5px 0', textAlign: 'left', width: '100%' }}>{algo.name}</button>
      ))}
    </div>
  );
};

const AlgorithmsContent = ({ algorithmName }) => {
  const [selectedSwitcher, setSelectedSwitcher] = useState('Description');
  const [language, setLanguage] = useState('python');
  const algorithm = algorithmsData.find(algo => algo.name === algorithmName);

  const renderContent = () => {
    switch (selectedSwitcher) {
      case 'Description':
        return <p>{algorithm.description}</p>;
      case 'Code':
        return (
          <div>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
            </select>
            <pre>{algorithm.code[language]}</pre>
          </div>
        );
      case 'Visualization':
        return <iframe src={algorithm.video} title="Algorithm Visualization" width="560" height="315" allowFullScreen></iframe>;
      default:
        return null;
    }
  };

  return (
    <div className="algorithms-content">
      <div className="switchers">
        <SwitcherButton onClick={() => setSelectedSwitcher('Description')} active={selectedSwitcher === 'Description'}>Description</SwitcherButton>
        <SwitcherButton onClick={() => setSelectedSwitcher('Code')} active={selectedSwitcher === 'Code'}>Code</SwitcherButton>
        <SwitcherButton onClick={() => setSelectedSwitcher('Visualization')} active={selectedSwitcher === 'Visualization'}>Visualization</SwitcherButton>
      </div>
      <div className="output">
        {renderContent()}
      </div>
    </div>
  );
};

const QuizzesContent = ({ algorithm }) => {
  if (algorithm && algorithm.quiz && algorithm.quiz.length > 0) {
    return <QuizComponent quizData={algorithm.quiz} />;
  } else {
    return <p>No quiz available for this algorithm.</p>;
  }
};

const QuizComponent = ({ quizData }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const handleAnswer = () => {
    if (selectedOption === quizData[currentQuestionIndex].answer) {
      setCorrectAnswers(correctAnswers + 1);
    }
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < quizData.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setSelectedOption(null); 
    } else {
      alert(`Quiz completed. You scored ${correctAnswers} out of ${quizData.length}`);
      setCurrentQuestionIndex(0); 
      setCorrectAnswers(0); 
      setSelectedOption(null);
    }
  };

  if (!quizData || quizData.length === 0 || !quizData[currentQuestionIndex].options) {
    return <p>No quiz or quiz options available.</p>;
  }

  return (
    <div>
      <h3>{quizData[currentQuestionIndex].question}</h3>
      {quizData[currentQuestionIndex].options.map((option, index) => (
        <button key={index} onClick={() => setSelectedOption(option)} className={selectedOption === option ? 'selected' : ''}>{option}</button>
      ))}
      <button onClick={handleAnswer} disabled={!selectedOption}>Submit</button>
    </div>
  );
};


const TabButton = ({ onClick, active, children }) => {
  return (
    <button className={`tab-button ${active ? 'active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
};

const SwitcherButton = ({ onClick, active, children }) => {
  return (
    <button className={`switcher-button ${active ? 'active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default LearningPage;