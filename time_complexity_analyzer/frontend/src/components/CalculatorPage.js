import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, Button, Select, MenuItem, Typography, FormControl, InputLabel, Box } from "@mui/material";
import CodeEditorArea from "./CodeEditorArea";
import Output from "./CodeOut";
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
  inverse_ackermann: "O(α(n))",
  iterated_logarithmic: "O(log* n)",
  polylogarithmic: "O((log n)^k)",
  fractional_power: "O(n^c)",
  quasilinear: "O(n log^k n)",
  quasi_polynomial: "O(exp((log n)^k))",
  subexponential: "O(exp(n^c))",
  polynomial_linear_exponent: "O(2^(O(n)))",
  double_exponential: "O(2^(2^n))",
};

const limitations = {
  Java: [
    "Function must be defined as: public type functionName(int[] arr)",
    "No static methods allowed",
    "No annotations",
    "Only one function should be present",
    "No third-party libraries",
    "No empty lines or comments",
    "Code will be run with the numbers between 0 and 10^3"
  ],
  Python: [
    "Function must accept a list as an argument",
    "Correct indentation is required",
    "No decorators",
    "Only one function should be present",
    "No third-party libraries",
    "No empty lines or comments",
    "Code will be run with the numbers between 0 and 10^3"
  ],
  Cpp: [
    "Function must be defined as: type functionName(std::vector<int>& arr)",
    "No public or private keywords",
    "Only one function should be present",
    "No third-party libraries",
    "No empty lines or comments",
    "Code will be run with the numbers between 0 and 10^3"
  ]
};

function CalculatorPage({ isAuthenticated, currentUser }) {
  const [code, setCode] = useState(``);
  const [language, setLanguage] = useState("Python");
  const [outputText, setOutputText] = useState("// Output will be displayed here");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
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
    Cpp: `int sumArray(std::vector<int>& arr) {
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
    setError("");
    setUserModifiedCode(false);
  }, [language]);

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    if (!userModifiedCode || code === "") {
      setCode(defaultCodes[selectedLanguage]);
    }
    setError("");
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setUserModifiedCode(true);
  };

  const handleAnalyseClick = () => {
    if (!user || !code || !language) {
      setError("Can't calculate it. Please check your code and try again.");
      return;
    }

    const payload = {
      username: user,
      code: code,
      language: language,
      time_complexity: "O(n)"
    };

    AxiosInstance.post("/api/analyse-code/", payload)
      .then((response) => {
        setResults(formatResults(response.data, code));
        setOutputText(formatOutput(response.data, code));
        setError("");
      })
      .catch((error) => {
        setError("Can't calculate it. Please check your code and try again.");
      });
  };

  const formatResults = (data, code) => {
    const codeLines = code.split("\n");
    const results = codeLines.map((line, index) => {
      const lineInfo = data.lines ? data.lines[language === 'Python' ? index : index + 1] : null;
      if (lineInfo) {
        const complexity = lineInfo.best_fit ? lineInfo.best_fit.model : "N/A";
        const avgExecTimes = lineInfo.average_exec_times || {};
        return {
          line: line.trim(),
          complexity,
          notation: time_complexity_notation[complexity] || "",
          avgExecTimes
        };
      }
      return { line: line.trim(), function: "", complexity: "", avgExecTimes: {} };
    });

    const functionComplexity = data.function && data.function.best_fit ? data.function.best_fit.model : "N/A";
    const functionAvgExecTimes = data.function ? data.function.average_exec_times : {};
    results.functionComplexity = functionComplexity;
    results.functionComplexityWord = functionComplexity;
    results.functionNotation = time_complexity_notation[functionComplexity] || "";
    results.functionAvgExecTimes = functionAvgExecTimes;

    return results;
  };

  const formatOutput = (data, code) => {
    const codeLines = code.split("\n");
    const linesOutput = codeLines.map((line, index) => {
      const lineInfo = data.lines ? data.lines[language === 'Python' ? index : index + 1] : null;
      if (lineInfo) {
        const avgExecTimes = lineInfo.average_exec_times 
          ? Object.entries(lineInfo.average_exec_times).map(([size, time]) => `${size}: ${time.toFixed(2)} ns`).join(", ") 
          : "";
        return `${line} -> ${time_complexity_notation[lineInfo.best_fit ? lineInfo.best_fit.model : ""] || ""} {${lineInfo.best_fit ? lineInfo.best_fit.model : "N/A"}} (Avg times: ${avgExecTimes})`;
      }
      return line;
    });

    const overallAvgExecTimes = data.function && data.function.average_exec_times 
      ? Object.entries(data.function.average_exec_times).map(([size, time]) => `${size}: ${time.toFixed(2)} ns`).join(", ")
      : "";
    const overallComplexity = data.function
      ? `\nOverall Function Time Complexity: ${time_complexity_notation[data.function.best_fit ? data.function.best_fit.model : ""] || ""} {${data.function.best_fit ? data.function.best_fit.model : "N/A"}} (Avg times: ${overallAvgExecTimes})`
      : "";
    linesOutput.push(overallComplexity);
    return linesOutput.join("\n");
  };

  return (
    <Container sx={{ maxWidth: "1800px" }}>
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
      <div className="flex flex-row mt-3" style={{ display: "flex", width: "100%" }}>
        <Card className="flex-grow-1" sx={{ flex: 1, marginRight: "1rem" }}>
          <CardContent>
            <CodeEditorArea language={language} code={code} onCodeChange={handleCodeChange} />
            <Button variant="contained" color="primary" className="mt-4" onClick={handleAnalyseClick}>
              Analyse
            </Button>
          </CardContent>
        </Card>
        <Card className="flex-grow-2" sx={{ flex: 3 }}>
          <CardContent>
            <Output outputText={outputText} results={results} error={error} />
          </CardContent>
        </Card>
      </div>
      <InfoSection language={language} limitations={limitations[language]} />
    </Container>
  );
}

export default CalculatorPage;
