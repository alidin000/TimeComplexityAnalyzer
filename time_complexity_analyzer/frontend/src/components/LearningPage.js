import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Tabs, Tab, Box, Select, MenuItem } from "@mui/material";
import algorithmsData from '../data_files/algorithmsData.json';

const LearningPage = () => {
  const [selectedTab, setSelectedTab] = useState('Algorithms');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithmsData[0].name);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box display="flex" flexDirection="row" p={2}>
      <Box width="200px" mr={2}>
        <Typography variant="h6" gutterBottom>
          Algorithm Topics
        </Typography>
        <Card>
          <CardContent>
            <AlgorithmTopicsList onSelect={setSelectedAlgorithm} />
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
            <QuizzesContent algorithm={algorithmsData.find(algo => algo.name === selectedAlgorithm)} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

const AlgorithmTopicsList = ({ onSelect }) => {
  return (
    <Box display="flex" flexDirection="column">
      {algorithmsData.map((algo, index) => (
        <Button key={index} onClick={() => onSelect(algo.name)} sx={{ textAlign: 'left' }}>
          {algo.name}
        </Button>
      ))}
    </Box>
  );
};

const AlgorithmsContent = ({ algorithmName }) => {
  const [selectedSwitcher, setSelectedSwitcher] = useState('Description');
  const [language, setLanguage] = useState('python');
  const algorithm = algorithmsData.find(algo => algo.name === algorithmName);

  const renderContent = () => {
    switch (selectedSwitcher) {
      case 'Description':
        return <Typography>{algorithm.description}</Typography>;
      case 'Code':
        return (
          <Box>
            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="java">Java</MenuItem>
            </Select>
            <pre>{algorithm.code[language]}</pre>
          </Box>
        );
      case 'Visualization':
        return (
          <iframe
            src={algorithm.video}
            title="Algorithm Visualization"
            width="560"
            height="315"
            allowFullScreen
          ></iframe>
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

const QuizzesContent = ({ algorithm }) => {
  if (algorithm && algorithm.quiz && algorithm.quiz.length > 0) {
    return <QuizComponent quizData={algorithm.quiz} />;
  } else {
    return <Typography>No quiz available for this algorithm.</Typography>;
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
    return <Typography>No quiz or quiz options available.</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{quizData[currentQuestionIndex].question}</Typography>
        {quizData[currentQuestionIndex].options.map((option, index) => (
          <Button
            key={index}
            onClick={() => setSelectedOption(option)}
            variant={selectedOption === option ? 'contained' : 'outlined'}
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
