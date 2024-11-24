import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Tabs, Tab, Box, Select, MenuItem, Link } from "@mui/material";
import algorithmsData from '../data_files/algorithmsData.json';

const LearningPage = () => {
  const [selectedTab, setSelectedTab] = useState('Algorithms');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithmsData[0].name);
  const [quizState, setQuizState] = useState({
    currentQuestionIndex: 0,
    selectedOption: null,
    correctAnswers: 0,
    showResults: false,
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAlgorithmSelect = (algorithmName) => {
    setSelectedAlgorithm(algorithmName);
    setQuizState({
      currentQuestionIndex: 0,
      selectedOption: null,
      correctAnswers: 0,
      showResults: false,
    });
  };

  return (
    <Box display="flex" flexDirection="row" p={2}>
      <Box width="200px" mr={2}>
        <Typography variant="h6" gutterBottom>
          Algorithm Topics
        </Typography>
        <Card>
          <CardContent>
            <AlgorithmTopicsList onSelect={handleAlgorithmSelect} />
          </CardContent>
        </Card>
      </Box>
      <Box flex={1}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Algorithms" value="Algorithms" />
          <Tab label="Quizzes" value="Quizzes" />
        </Tabs>
        <Box mt={2}>
          {selectedTab === 'Algorithms' ? (
            <AlgorithmsContent algorithmName={selectedAlgorithm} />
          ) : (
            <QuizzesContent
              algorithm={algorithmsData.find(algo => algo.name === selectedAlgorithm)}
              quizState={quizState}
              setQuizState={setQuizState}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

const AlgorithmTopicsList = ({ onSelect }) => {
  return (
    <Box display="flex" flexDirection="column" maxHeight="400px" overflow="auto">
      {algorithmsData.map((algo, index) => (
        <Button key={index} onClick={() => onSelect(algo.name)} sx={{ textAlign: 'left' }}>
          {algo.name}
        </Button>
      ))}
    </Box>
  );
};

const extractUrl = (description) => {
  const urlMatch = description.match(/\(https?:\/\/[^\s]+\)/);
  return urlMatch ? urlMatch[0].slice(1, -1) : null;
};

const AlgorithmsContent = ({ algorithmName }) => {
  const [selectedSwitcher, setSelectedSwitcher] = useState('Description');
  const [language, setLanguage] = useState('python');
  const algorithm = algorithmsData.find(algo => algo.name === algorithmName);
  const url = extractUrl(algorithm.description);

  const renderContent = () => {
    switch (selectedSwitcher) {
      case 'Description':
        return (
          <Typography>
            {algorithm.description.replace(/\[.*\]\(https?:\/\/[^\s]+\)/, '')}
            {url && (
              <Link href={url} target="_blank" rel="noopener">
                Learn more
              </Link>
            )}
          </Typography>
        );
      case 'Code':
        return (
          <Box>
            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="c++">C++</MenuItem>
              <MenuItem value="java">Java</MenuItem>
            </Select>
            <pre>{algorithm.code[language]}</pre>
          </Box>
        );
      case 'Visualization':
        return (
          <Box dangerouslySetInnerHTML={{ __html: algorithm.video }} />
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" mb={2}>
          <Button onClick={() => setSelectedSwitcher('Description')} variant={selectedSwitcher === 'Description' ? 'contained' : 'outlined'}>
            Description
          </Button>
          <Button onClick={() => setSelectedSwitcher('Code')} variant={selectedSwitcher === 'Code' ? 'contained' : 'outlined'}>
            Code
          </Button>
          <Button onClick={() => setSelectedSwitcher('Visualization')} variant={selectedSwitcher === 'Visualization' ? 'contained' : 'outlined'}>
            Visualization
          </Button>
        </Box>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

const QuizzesContent = ({ algorithm, quizState, setQuizState }) => {
  if (algorithm && algorithm.quiz && algorithm.quiz.length > 0) {
    return <QuizComponent quizData={algorithm.quiz} quizState={quizState} setQuizState={setQuizState} />;
  } else {
    return <Typography>No quiz available for this algorithm.</Typography>;
  }
};

const QuizComponent = ({ quizData, quizState, setQuizState }) => {
  const { currentQuestionIndex, selectedOption, correctAnswers, showResults } = quizState;

  const handleAnswer = () => {
    const isCorrect = selectedOption === quizData[currentQuestionIndex].answer;

    const updatedCorrectAnswers = isCorrect ? quizState.correctAnswers + 1 : quizState.correctAnswers;

    if (quizState.currentQuestionIndex + 1 < quizData.length) {
      setQuizState((prevState) => ({
        ...prevState,
        correctAnswers: updatedCorrectAnswers,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        selectedOption: null,
      }));
    } else {
      setQuizState((prevState) => ({
        ...prevState,
        correctAnswers: updatedCorrectAnswers,
        showResults: true,
      }));
    }
  };

  const handleRestart = () => {
    setQuizState({
      currentQuestionIndex: 0,
      selectedOption: null,
      correctAnswers: 0,
      showResults: false,
    });
  };

  if (showResults) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Quiz Results</Typography>
          <Typography>You scored {correctAnswers} out of {quizData.length}</Typography>
          <Button onClick={handleRestart} variant="contained" color="primary">
            Restart Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{quizData[currentQuestionIndex].question}</Typography>
        {quizData[currentQuestionIndex].options.map((option, index) => (
          <Button
            key={index}
            onClick={() => setQuizState((prevState) => ({ ...prevState, selectedOption: option }))}
            variant={quizState.selectedOption === option ? 'contained' : 'outlined'}
            fullWidth
            sx={{ my: 1 }}
          >
            {option}
          </Button>
        ))}
        <Button onClick={handleAnswer} disabled={!selectedOption} variant="contained" color="primary">
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};

export default LearningPage;
