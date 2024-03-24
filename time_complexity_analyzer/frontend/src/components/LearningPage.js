// LearningPage.jsx
import React from "react";

const LearningPage = () => {
  return (
    <div className="learning-page">
      <h2 className="topics-heading">Topics</h2>
      <div className="topics-section">
        <LearningTopics />
      </div>
      <div className="topics-section">
        <AlgorithmsTopics />
      </div>
      <div className="topics-section">
        <QuizzesTopics />
      </div>
    </div>
  );
};

const LearningTopics = () => {
  return (
    <div className="learning-topics">
      <h3>LEARNING</h3>
      <ul>
        <li>
          <a href="/learning/intro-to-react">Introduction to React</a>
        </li>
        <li>
          <a href="/learning/react-hooks">React Hooks</a>
        </li>
        <li>
          <a href="/learning/react-routing">React Routing</a>
        </li>
        {/* Add more subtopics */}
      </ul>
    </div>
  );
};

const AlgorithmsTopics = () => {
  return (
    <div className="algorithms-topics">
      <h3>ALGORITHMS</h3>
      <ul>
        <li>
          <a href="/algorithms/bubble-sort">Bubble Sort</a>
        </li>
        <li>
          <a href="/algorithms/breadth-first-search">Breadth First Search</a>
        </li>
        <li>
          <a href="/algorithms/depth-first-search">Depth First Search</a>
        </li>
        <li>
          <a href="/algorithms/binary-search">Binary Search</a>
        </li>
        {/* Add more subtopics */}
      </ul>
    </div>
  );
};

const QuizzesTopics = () => {
  return (
    <div className="quizzes-topics">
      <h3>QUIZZES</h3>
      <ul>
        <li>
          <a href="/quizzes/react-quiz">React Quiz</a>
        </li>
        <li>
          <a href="/quizzes/algorithms-quiz">Algorithms Quiz</a>
        </li>
        {/* Add more subtopics */}
      </ul>
    </div>
  );
};

export default LearningPage;
