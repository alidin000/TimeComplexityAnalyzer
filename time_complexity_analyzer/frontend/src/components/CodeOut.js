import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function Output({ outputText = '', results = [], error = '' }) {
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

  const renderExecutionTimes = (avgExecTimes) => (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Table size="small" aria-label="execution times table">
        <TableHead>
          <TableRow>
            {Object.keys(avgExecTimes).map(size => (
              <TableCell key={size} align="center">{size}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {Object.entries(avgExecTimes).map(([size, time]) => (
              <TableCell key={size} align="center">{time.toFixed(2)} ns</TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
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
                <div key={index} className={getLineClassName(result.complexity)}>
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
