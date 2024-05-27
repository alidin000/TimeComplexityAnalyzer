import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const complexityColors = {
  constant: 'green',
  logarithmic: 'blue',
  linear: 'orange',
  quadratic: 'red',
  exponential: 'purple',
  cubic: 'brown',
  log_linear: 'cyan',
  factorial: 'magenta',
  polynomial: 'black',
  inverse_ackermann: 'pink',
  iterated_logarithmic: 'teal',
  polylogarithmic: 'indigo',
  fractional_power: 'lime',
  quasilinear: 'coral',
  quasi_polynomial: 'salmon',
  subexponential: 'khaki',
  polynomial_linear_exponent: 'plum',
  double_exponential: 'gold',
};

function Output({ outputText = '', results = [], error = '' }) {
  const getLineStyle = (complexity) => ({
    color: complexityColors[complexity] || 'black',
  });

  const renderExecutionTimes = (avgExecTimes) => (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="body2">
        {Object.entries(avgExecTimes).map(([size, time]) => (
          <span key={size}>{`${size}: ${time.toFixed(2)} ns, `}</span>
        ))}
      </Typography>
    </Box>
  );

  return (
    <Card className="output-card" sx={{ marginTop: 2 }}>
      <CardContent>
        {error ? (
          <Typography variant="h6" color="error" gutterBottom>
            Can't calculate it. Please check your code and try again.
          </Typography>
        ) : (
          <>
            <pre style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
              {results.map((result, index) => (
                <div key={index} style={getLineStyle(result.complexity)}>
                  {result.complexity ? `${result.line.trim()} - ${result.notation} {${result.complexity}}` : result.line.trim()}
                  {result.complexity && renderExecutionTimes(result.avgExecTimes)}
                </div>
              ))}
            </pre>
            {results.functionComplexity && (
              <>
                <Typography className="overall-complexity" variant="h6" mt={2}>
                  Overall Function Time Complexity: {results.functionNotation} {results.functionComplexityWord}
                </Typography>
                {renderExecutionTimes(results.functionAvgExecTimes)}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default Output;
