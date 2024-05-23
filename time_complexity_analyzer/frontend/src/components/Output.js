// src/components/Output.jsx
import React, { useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // You can choose a different style
import Paper from '@mui/material/Paper';

function Output({ outputText = '', results = [] }) {
  useEffect(() => {
    hljs.highlightAll();
  }, [outputText, results]);

  const getLineClassName = (complexity) => {
    switch (complexity) {
      case '1':
        return 'complexity-constant';
      case 'log(n)':
        return 'complexity-logarithmic';
      case 'n':
        return 'complexity-linear';
      case 'n^2':
        return 'complexity-quadratic';
      default:
        return '';
    }
  };

  const overallComplexity = results.reduce((max, result) => {
    if (result.complexity === 'n^2') return 'n^2';
    if (result.complexity === 'n' && max !== 'n^2') return 'n';
    if (result.complexity === 'log(n)' && !['n', 'n^2'].includes(max)) return 'log(n)';
    return max;
  }, '1');

  return (
    <div className="card surface-700 output-card">
      <Paper elevation={3} variant="outlined" className="output-paper">
        <pre>
          <code className="language-java"> {/* Update this class based on the detected language */}
            {results.map((result, index) => (
              <div key={index} className={getLineClassName(result.complexity)}>
                {`Line ${index + 1}: ${result.line.trim()} - O(${result.complexity})`}
              </div>
            ))}
          </code>
        </pre>
        <div className="overall-complexity">
          Overall Time Complexity: O({overallComplexity})
        </div>
      </Paper>
    </div>
  );
}

export default Output;
