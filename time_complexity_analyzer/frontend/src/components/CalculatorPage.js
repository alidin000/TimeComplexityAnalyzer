// CalculatorPage.jsx
import React, { useState } from "react";
import CodeEditorArea from "./CodeEditorArea";
import Output from "./Output";

function CalculatorPage({ isAuthenticated, currentUser }) {
  const [code, setCode] = useState(`def circle_area(radius):\n\t\"\"\"This function calculates the area of a circle.\"\"\"\n\tpi = 3.14159\n\treturn pi * radius * radius`);
  const [language, setLanguage] = useState('python');
  const [outputText, setOutputText] = useState("// Output will be displayed here");
  const user = isAuthenticated ? currentUser : "Unknown";

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    switch (selectedLanguage) {
      case 'java':
        setCode(`public static boolean isPalindrome(String text) {\n\tint length = text.length();\n\tfor (int i = 0; i < length / 2; i++) {\n\t\tif (text.charAt(i) != text.charAt(length - 1 - i)) {\n\t\t\treturn false;\n\t\t}\n\t}\n\treturn true;\n}`);
        break;
      case 'python':
        setCode(`def circle_area(radius):\n\t\"\"\"This function calculates the area of a circle.\"\"\"\n\tpi = 3.14159\n\treturn pi * radius * radius`);
        break;
      case 'cpp':
        setCode(`int factorial(int num) {\n\tif (num < 0) {\n\t\treturn -1;\n\t} else if (num == 0) {\n\t\treturn 1;\n\t} else {\n\t\treturn num * factorial(num - 1);\n\t}\n}`);
        break;
      default:
        setCode('');
    }
  };

  const handleAnalyseClick = () => {
    // Call the API endpoint to analyse the code and store it in the database
    fetch('/api/analyse-code/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        language: language,
        user: user,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Analysis output:', data.output);
      // Update the output text state with the analysis output
      setOutputText(data.output);
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle errors if any
    });
  };

  return (
    <div className="">
      <div className="">
        <select className="h-1rem ml-3" value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      <div className="flex flex-row mt-3 ml-3">
        <div className="flex card w-30rem"> 
          <div className="flex flex-column">
            <CodeEditorArea language={language} initialCode={code} />
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
