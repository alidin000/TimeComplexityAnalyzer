import React, { useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { Card, CardContent, Box, Typography } from '@mui/material';

function Output({ outputText = '', results = [] }) {
  useEffect(() => {
    hljs.highlightAll();
  }, [outputText, results]);

  const getLineClassName = (complexity) => {
    switch (complexity) {
      case 'constant':
        return 'complexity-constant';
      case 'logarithmic':
        return 'complexity-logarithmic';
      case 'linear':
        return 'complexity-linear';
      case 'quadratic':
        return 'complexity-quadratic';
      case 'exponential':
        return 'complexity-exponential';
      case 'cubic':
        return 'complexity-cubic';
      case 'log_linear':
        return 'complexity-log-linear';
      case 'factorial':
        return 'complexity-factorial';
      case 'polynomial':
        return 'complexity-polynomial';
      default:
        return '';
    }
  };

  return (
    <Box className="output-container" p={2}>
      <Card className="output-card">
        <CardContent>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
            <code className="language-python">
              {results.map((result, index) => (
                <div key={index} className={getLineClassName(result.complexity)}>
                  {result.complexity ? `${result.line.trim()} - ${result.notation} {${result.complexity}}` : result.line.trim()}
                </div>
              ))}
            </code>
          </pre>
          <Typography className="overall-complexity" variant="h6" mt={2}>
            Overall Time Complexity: {results.functionNotation} {results.functionComplexityWord}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Output;
