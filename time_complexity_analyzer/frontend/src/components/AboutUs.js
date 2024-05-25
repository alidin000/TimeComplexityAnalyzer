import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const AboutUs = () => {
  return (
    <Box p={2}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to our website! Our mission is to help you learn about algorithms and data structures, and to provide you with tools to calculate the time complexity of various algorithms with certain limitations.
          </Typography>
          <Typography variant="body1" paragraph>
            On our Learning Page, you'll find comprehensive tutorials and resources to understand different data structures and algorithms. We also offer visualizations to make learning more engaging and effective.
          </Typography>
          <Typography variant="body1" paragraph>
            Use our Calculator Page to estimate the time complexity of your algorithms. This tool is designed to assist you in better understanding how your code performs and to help you optimize it.
          </Typography>
          <Typography variant="h5" gutterBottom>
            Time Complexity Animations
          </Typography>
          <Box mt={2}>
            <iframe
              width="100%"
              height="500"
              src="https://www.youtube.com/embed/IA8On-kfxYo?list=PLFonK3OU1E4qVvtRGBSL0xtXOmzZkLy8x"
              title="Time Complexity Animations | Data Structure | Visual How"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AboutUs;
