// Output.jsx
import React, { useState, useEffect } from "react";

function Output() {
  const [output, setOutput] = useState("// Output will be displayed here");

  useEffect(() => {
    try {
      const result = evaluateCode(); // Call the function to evaluate code
      setOutput(result ? result.toString() : "// No output");
    } catch (error) {
      setOutput(error.message);
    }
  }, []);

  // Function to evaluate code
  const evaluateCode = () => {
    // Access the current content of the editor using: editorRef.current.getValue()
    // You can perform any additional logic here
    const code = "// Your code execution logic here";
    return eval(code); // You should avoid using eval in production, consider using alternatives like safe-eval
  };

  return (
    <div className="output">
      <pre>{output}</pre>
    </div>
  );
}

export default Output;
