// CalculatorPage.jsx
import React, { useEffect, useState } from "react";

import CodeEditorArea from "./CodeEditorArea";
import Output from "./Output";

function CalculatorPage() {
  const [code, setCode] = useState(
    ` def circle_area(radius):
    """This function calculates the area of a circle."""
    pi = 3.14159  # Assuming you don't want to import math
    return pi * radius * radius`
  );
  const [codeSend, setCodeSend] = useState('');
  const [language, setLanguage] = useState('python');
  
  useEffect(() => {
    setCodeSend(code);
  },[code])
  
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
          <CodeEditorArea languageSelected={language} initialCode={codeSend} />
          <div className="flex justify-content-end mt-4"> {/* Adjusted the position of justify-content-end */}
            <button className="flex text-yellow-500 w-8rem justify-content-center" onClick={() => {}}>Analyse</button>
          </div>
        </div>
      
      </div>
        <div className="flex card ml-8 w-full">
          <Output />
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
