// CalculatorPage.jsx
import React from "react";
import CodeEditor from "./CodeEditor";
import Output from "./Output";

function CalculatorPage() {
  return (
    <div className="calculator-page">
      <CodeEditor />
      <Output />
    </div>
  );
}

export default CalculatorPage;
