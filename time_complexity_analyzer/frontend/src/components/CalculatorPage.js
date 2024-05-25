import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, Button, Select, MenuItem, Typography, FormControl, InputLabel, Box } from "@mui/material";
import CodeEditorArea from "./CodeEditorArea";
import Output from "./Output";
import AxiosInstance from "./Axios";
import InfoSection from "./InfoSection";

const time_complexity_notation = {
  constant: "O(1)",
  linear: "O(n)",
  quadratic: "O(n^2)",
  logarithmic: "O(log n)",
  exponential: "O(2^n)",
  cubic: "O(n^3)",
  log_linear: "O(n log n)",
  factorial: "O(n!)",
  polynomial: "O(n^k)",
};

const limitations = {
  Java: [
    "Function must be defined as: public type functionName(int[] arr)",
    "No static methods allowed",
    "No annotations",
    "Only one function should be present",
    "No third-party libraries",
    "No empty lines or comments"
  ],
  Python: [
    "Function must accept a list as an argument",
    "Correct indentation is required",
    "No decorators",
    "Only one function should be present",
    "No third-party libraries",
    "No empty lines or comments"
  ],
  Cpp: [
    "Function must be defined as: type functionName(std::vector<int>& arr)",
    "No public or private keywords",
    "Only one function should be present",
    "No third-party libraries",
    "No empty lines or comments"
  ]
};


function CalculatorPage({ isAuthenticated, currentUser }) {
  const [code, setCode] = useState(``);
  const [language, setLanguage] = useState("Python");
  const [outputText, setOutputText] = useState("// Output will be displayed here");
  const [results, setResults] = useState([]);
  const [userModifiedCode, setUserModifiedCode] = useState(false);
  const user = isAuthenticated ? currentUser : "Unknown";

  const defaultCodes = {
    Java: `public boolean isSorted(int[] arr) {
      for (int i = 0; i < arr.length - 1; i++) {
          if (arr[i] > arr[i + 1]) {
              return false;
          }
      }
      return true;
  }`,
    Python: `def find_max(arr):
      if not arr:
          return None
      max_value = arr[0]
      for num in arr:
          if num > max_value:
              max_value = num
      return max_value`,
    Cpp: `  
  int sumArray(std::vector<int>& arr) {
      int sum = 0;
      for (int num : arr) {
          sum += num;
      }
      return sum;
  }`,
  };

  useEffect(() => {
    setCode(defaultCodes[language]);
    setOutputText("// Output will be displayed here");
    setResults([]);
  }, [language]);

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    if (!userModifiedCode || code === "") {
      setCode(defaultCodes[selectedLanguage]);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setUserModifiedCode(true);
  };

  const handleAnalyseClick = () => {
    if (!user || !code || !language) {
      console.error("Missing required fields");
      return;
    }

    const payload = {
      username: user,
      code: code,
      language: language,
      time_complexity: "O(n)",
      space_complexity: "O(1)",
    };

    console.log(payload);

    AxiosInstance.post("/api/analyse-code/", payload)
      .then((response) => {
        console.log("printing the output now");
        console.log(response.data);
        setResults(formatResults(response.data, code));
        setOutputText(formatOutput(response.data, code));
      })
      .catch((error) => {
        console.error("Error:", error.response ? error.response.data : error);
      });
  };

  const formatResults = (data, code) => {
    const codeLines = code.split("\n");
    const results = codeLines.map((line, index) => {
      const lineInfo = data.lines[index + 1];
      if (lineInfo) {
        const complexity = lineInfo.model;
        return {
          line: line.trim(),
          complexity,
          notation: time_complexity_notation[complexity] || "",
        };
      }
      return { line: line.trim(), function: "", complexity: "" };
    });

    const functionComplexity = data.function ? data.function.model : "N/A";
    results.functionComplexity = functionComplexity;
    results.functionComplexityWord = functionComplexity;
    results.functionNotation = time_complexity_notation[functionComplexity] || "";

    return results;
  };

  const formatOutput = (data, code) => {
    const codeLines = code.split("\n");
    const linesOutput = codeLines.map((line, index) => {
      const lineInfo = data.lines[index + 1];
      if (lineInfo) {
        return `${line} -> ${time_complexity_notation[lineInfo.model] || ""} {${lineInfo.model}}`;
      }
      return line;
    });

    const overallComplexity = data.function
      ? `\nOverall Function Time Complexity: ${time_complexity_notation[data.function.model] || ""} {${data.function.model}}`
      : "";
    linesOutput.push(overallComplexity);
    return linesOutput.join("\n");
  };

  return (
    <Container>
      <Card className="mt-4">
        <CardContent>
          <Box display="flex" justifyContent="center">
            <FormControl variant="outlined" sx={{ width: 200 }}>
              <InputLabel id="language-select-label">Language</InputLabel>
              <Select
                labelId="language-select-label"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                label="Language"
              >
                <MenuItem value="Java">Java</MenuItem>
                <MenuItem value="Python">Python</MenuItem>
                <MenuItem value="Cpp">C++</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
      <div className="flex flex-row mt-3">
        <Card className="flex-grow-1">
          <CardContent>
            <CodeEditorArea language={language} code={code} onCodeChange={handleCodeChange} />
            <Button variant="contained" color="primary" className="mt-4" onClick={handleAnalyseClick}>
              Analyse
            </Button>
          </CardContent>
        </Card>
        <Card className="flex-grow-1 ml-4">
          <CardContent>
            <Output outputText={outputText} results={results} />
          </CardContent>
        </Card>
      </div>
      <InfoSection language={language} limitations={limitations[language]} />
    </Container>
  );
}

export default CalculatorPage;
