import React from 'react';
import { Card, CardContent, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorIcon from '@mui/icons-material/Error';

const complexityColors = {
  constant: 'green',
  linear: 'orange',
  quadratic: 'red',
  logarithmic: 'blue',
  exponential: 'purple',
  cubic: 'brown',
  log_linear: 'cyan',
  factorial: 'magenta',
  polynomial: 'black',
  inverse_ackermann: 'pink',
  iterated_logarithmic: 'teal',
  log_logarithmic: 'navy',
  polylogarithmic: 'indigo',
  fractional_power: 'lime',
  quasilinear: 'coral',
  quasi_polynomial: 'salmon',
  subexponential: 'khaki',
  subexponential_variant: 'olive',
  polynomial_linear_exponent: 'plum',
  double_exponential: 'gold',
  exponential_poly: 'silver'
};

function Output({ outputText = '', results = [], error = '', loading = false }) {
  const getLineStyle = (complexity) => ({
    color: complexityColors[complexity] || 'black',
  });

  const renderExecutionTimes = (avgExecTimes) => (
    <Box sx={{ marginTop: 1 }}>
      <Typography variant="body2" component="div">
        {Object.entries(avgExecTimes).map(([size, time]) => (
          <Chip key={size} label={`${size}: ${time.toFixed(2)} ns`} sx={{ marginRight: 0.5, marginBottom: 0.5 }} />
        ))}
      </Typography>
    </Box>
  );

  return (
    <Card className="output-card" sx={{ marginTop: 2 }}>
      <CardContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <CircularProgress />
            <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
              Please wait...
            </Typography>
          </Box>
        ) : error ? (
          <Box display="flex" alignItems="center" color="error.main">
            <ErrorIcon />
            <Typography variant="h6" color="error" gutterBottom sx={{ marginLeft: 1 }}>
              Can't calculate it. Please check your code and try again.
            </Typography>
          </Box>
        ) : (
          <>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Line-by-Line Analysis</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Line</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Complexity</TableCell>
                        <TableCell>Average Execution Times (size : time)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map((result, index) => (
                        <TableRow key={index} style={getLineStyle(result.complexity)}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{result.line}</TableCell>
                          <TableCell>
                            {result.complexity ? (
                              <Chip
                                label={`${result.notation} {${result.complexity}}`}
                                style={{ backgroundColor: complexityColors[result.complexity], color: 'white' }}
                              />
                            ) : (
                              ''
                            )}
                          </TableCell>
                          <TableCell>{renderExecutionTimes(result.avgExecTimes)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
            {results.functionComplexity && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Overall Function Analysis</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Typography variant="h6" className="overall-complexity">
                      Overall Function Time Complexity: <Chip label={`${results.functionNotation} {${results.functionComplexityWord}}`} style={{ backgroundColor: complexityColors[results.functionComplexity], color: 'white' }} />
                    </Typography>
                    {renderExecutionTimes(results.functionAvgExecTimes)}
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default Output;
