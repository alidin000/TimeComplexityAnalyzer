// LearningPage.jsx

import React, { useState } from "react";

const LearningPage = () => {
  const [selectedTab, setSelectedTab] = useState('Algorithms'); // Default selected tab

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="learning-page">
      <div className="left-panel">
        <h2 className="subtopics-heading">Algorithm Topics</h2>
        <div className="card">
        <AlgorithmTopicsList />
        </div>
      </div>
      <div className="right-panel">
        <div className="tab-switcher">
          <TabButton onClick={() => handleTabChange('Algorithms')} active={selectedTab === 'Algorithms'}>Algorithms</TabButton>
          <TabButton onClick={() => handleTabChange('Quizzes')} active={selectedTab === 'Quizzes'}>Quizzes</TabButton>
        </div>
        <div className="topics-section">
          {selectedTab === 'Algorithms' ? <AlgorithmsContent /> : <QuizzesContent />}
        </div>
      </div>
    </div>
  );
};

const AlgorithmTopicsList = () => {
  // Define your list of algorithm topics here
  const algorithmTopics = [
    "Bubble Sort",
    "Breadth First Search",
    "Depth First Search",
    "Binary Search",
    // Add more algorithm topics as needed
  ];

  return (
    <div className="algorithm-topics-list">
      {algorithmTopics.map((topic, index) => (
        <a key={index} href={`/algorithms/${topic.toLowerCase().replace(/\s+/g, '-')}`}>{topic}</a>
      ))}
    </div>
  );
};

const AlgorithmsContent = () => {
  const [selectedSwitcher, setSelectedSwitcher] = useState('Description');

  const handleSwitcherChange = (switcher) => {
    setSelectedSwitcher(switcher);
  };

  return (
    <div className="algorithms-content">
      <div className="switchers">
        <SwitcherButton onClick={() => handleSwitcherChange('Description')} active={selectedSwitcher === 'Description'}>Description</SwitcherButton>
        <SwitcherButton onClick={() => handleSwitcherChange('Code')} active={selectedSwitcher === 'Code'}>Code</SwitcherButton>
        <SwitcherButton onClick={() => handleSwitcherChange('Visualization')} active={selectedSwitcher === 'Visualization'}>Visualization</SwitcherButton>
      </div>
      <div className="output">
        {/* Output area for each switcher */}
        {selectedSwitcher === 'Description' && <p>Description Content</p>}
        {selectedSwitcher === 'Code' && <p>Code Content</p>}
        {selectedSwitcher === 'Visualization' && <p>Visualization Content</p>}
      </div>
    </div>
  );
};

const QuizzesContent = () => {
  return (
    <div className="quizzes-content">
      {/* Quizzes content */}
      <p>Quizzes Content</p>
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
