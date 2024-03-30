import React from "react";
import CodeEditorArea from "./CodeEditorArea";
import Output from "./Output";

function CalculatorPage() {
  return (
    <div className="calculator-page">
      <div className="top-section">
        <div className="left-section">
          <CodeEditorArea />
        </div>
        <div className="right-section">
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
