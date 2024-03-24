// Output.jsx
import React, { useState, useEffect } from "react";

function Output() {
  const [output, setOutput] = useState("// Output will be displayed here");

  // Replace the code below with your logic for code execution, e.g. using eval(), safe-eval or a sandbox environment
  useEffect(() => {
    try {
      const result = eval("// Your code execution logic here");
      setOutput(result.toString());
    } catch (error) {
      setOutput(error.message);
    }
  }, []);

  return (
    <div className="output">
      <pre>{output}</pre>
    </div>
  );
}

export default Output;
