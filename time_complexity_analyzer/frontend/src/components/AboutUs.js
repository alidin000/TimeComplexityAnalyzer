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
            Welcome to our platform! Our mission is to provide you with the tools and knowledge to understand algorithms and data structures comprehensively. We aim to assist you in calculating the time complexity of various algorithms, albeit with certain limitations.
          </Typography>
          <Typography variant="body1" paragraph>
            On our Learning Page, you will find detailed tutorials and resources designed to help you grasp different data structures and algorithms. We also offer visualizations to make your learning experience more engaging and effective.
          </Typography>
          <Typography variant="body1" paragraph>
            Utilize our Calculator Page to estimate the time complexity of your algorithms. This tool is crafted to help you gain insights into your code’s performance and to assist in its optimization.
          </Typography>
          <Typography variant="body1" paragraph>
            Please note that our tool is not yet perfect and may not always provide accurate results. Further research and development are required to enhance its accuracy.
          </Typography>
          <Typography variant="h5" gutterBottom>
            A short video about Time Complexity 
          </Typography>
          <Box mt={2} position="relative" paddingTop="56.25%">
            <iframe
              src="https://www.youtube.com/embed/IA8On-kfxYo?list=PLFonK3OU1E4qVvtRGBSL0xtXOmzZkLy8x"
              title="Time Complexity Animations | Data Structure | Visual How"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '60%',
                height: '60%'
              }}
            ></iframe>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AboutUs;
