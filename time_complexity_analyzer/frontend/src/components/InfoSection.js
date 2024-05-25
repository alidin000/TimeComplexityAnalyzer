import React from 'react';
import { Box, Typography } from '@mui/material';

const InfoSection = ({ language, limitations }) => {
  return (
    <Box mt={4}>
      <Typography variant="h6">Limitations for {language}</Typography>
      <ul>
        {limitations.map((limitation, index) => (
          <li key={index}>
            <Typography>{limitation}</Typography>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default InfoSection;
