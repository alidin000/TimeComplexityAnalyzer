import React, { useState, useEffect } from "react";
import CodeEditorArea from "./CodeEditorArea";
import Output from "./Output";
import AxiosInstance from './Axios';

function CalculatorPage({ isAuthenticated, currentUser }) {
  const [code, setCode] = useState(``);
  const [language, setLanguage] = useState('Python');
  const [outputText, setOutputText] = useState("// Output will be displayed here");
  const [userModifiedCode, setUserModifiedCode] = useState(false);
  const user = isAuthenticated ? currentUser : "Unknown";

  const defaultCodes = {
    'Java': `public static boolean isPalindrome(String text) {\n\tint length = text.length();\n\tfor (int i = 0; i < length / 2; i++) {\n\t\tif (text.charAt(i) != text.charAt(length - 1 - i)) {\n\t\t\treturn false;\n\t}\n\t}\n\treturn true;\n}`,
    'Python': `def circle_area(radius):\n\t\"\"\"This function calculates the area of a circle.\"\"\"\n\tpi = 3.14159\n\treturn pi * radius * radius`,
    'C++': `int factorial(int num) {\n\tif (num < 0) {\n\t\treturn -1;\n\t} else if (num == 0) {\n\t\treturn 1;\n\t} else {\n\t\treturn num * factorial(num - 1);\n\t}\n}`
  };

  useEffect(() => {
    setCode(defaultCodes[language]);
  }, [language]);

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    if (!userModifiedCode || code === '') {
      setCode(defaultCodes[selectedLanguage]);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setUserModifiedCode(true);
  };

  const handleAnalyseClick = () => {
    if (!user || !code || !language) {
      console.error('Missing required fields');
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

    AxiosInstance.post('/api/analyse-code/', payload)
      .then(response => {
        console.log(response.data.output);
        setOutputText(response.data.output);
      })
      .catch(error => {
        console.error('Error:', error.response ? error.response.data : error);
      });
  };

  return (
    <div className="">
      <div className="">
        <select className="h-1rem ml-3" value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
          <option value="C++">C++</option>
        </select>
      </div>
      <div className="flex flex-row mt-3 ml-3">
        <div className="flex card w-30rem"> 
          <div className="flex flex-column">
            <CodeEditorArea language={language} code={code} onCodeChange={handleCodeChange} />
            <div className="flex justify-content-end mt-4">
              <button className="flex text-yellow-500 w-8rem justify-content-center" onClick={handleAnalyseClick}>Analyse</button>
            </div>
          </div>
        </div>
        <div className="flex card ml-8 w-full">
          <Output outputText={outputText} />
        </div>
      </div>
      <div className="bottom-section">
        <div className="text-section">
          Additional text information goes here
        </div>
      </div>
    </div>
  );
}

export default CalculatorPage;
