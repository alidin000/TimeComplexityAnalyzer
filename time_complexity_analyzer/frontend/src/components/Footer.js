import React from "react";
import { Container, Typography, Link, Box } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: "#3f51b5", py: 3, mt: 5 }}>
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography variant="body2" color="inherit">
            © TimeComplexity™ 2024
          </Typography>
          <Box>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              About
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              Licensing
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              Contact
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
