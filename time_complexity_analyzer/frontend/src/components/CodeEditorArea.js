import React, { useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';

export default function CodeEditorArea() {
  const [code, setCode] = useState(
    ` def circle_area(radius):
    """This function calculates the area of a circle."""
    pi = 3.14159  # Assuming you don't want to import math
    return pi * radius * radius`
  );
  
  const [language, setLanguage] = useState('python'); // Default language is Python
  
  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    // Depending on the selected language, set the code accordingly
    switch (selectedLanguage) {
      case 'java':
        setCode(` public static boolean isPalindrome(String text) {
      int length = text.length();
      for (int i = 0; i < length / 2; i++) {
        if (text.charAt(i) != text.charAt(length - 1 - i)) {
          return false;
        }
      }
      return true;
  }`);
        break;
      case 'python':
        setCode(` def circle_area(radius):
    """This function calculates the area of a circle."""
    pi = 3.14159  # Assuming you don't want to import math
    return pi * radius * radius`);
        break;
      case 'cpp':
        setCode(` int factorial(int num) {
      if (num < 0) {
        return -1; // Handle negative input (optional)
      } else if (num == 0) {
        return 1;
      } else {
        return num * factorial(num - 1);
      }
  }`);
        break;
      default:
        setCode('');
    }
  };
  
  const handleAnalyseClick = () => {
    // Add your logic for analyzing the code here
    // This function will be called when the "Analyse" button is clicked
    console.log("Code analysis triggered");
  };

  return (
    <div>
      <div className="language-selector">
        <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      <CodeEditor
        value={code}
        language={language}
        placeholder={`Please enter ${language} code.`}
        onChange={(evn) => setCode(evn.target.value)}
        padding={15}
        style={{
          backgroundColor: "#f5f5f5",
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
      />
      {/* Add the "Analyse" button */}
      <button className="analyse-button" onClick={handleAnalyseClick}>Analyse</button>
    </div>
  );
}
