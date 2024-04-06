// Output.jsx
import React from "react";
import Paper from '@mui/material/Paper';

function Output({ outputText }) {
  return (
    <div className="card surface-700 ">
      <Paper elevation={3} variant="outlined" className="w-30rem h-20rem">
        <pre>{outputText}</pre>
      </Paper>
    </div>
  );
}

export default Output;
