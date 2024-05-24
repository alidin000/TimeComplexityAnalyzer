import React from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText } from "@mui/material";

const InfoSection = ({ language }) => {
  const infoContent = {
    Java: {
      constraints: [
        "Array length should not exceed 10^6.",
        "Elements of the array should be within the range of -10^9 to 10^9.",
        "Ensure the code is syntactically correct before submitting."
      ],
      usage: [
        "Use the provided template to implement your logic.",
        "Click the 'Analyse' button to get the time and space complexity.",
        "Review the output section for detailed analysis."
      ]
    },
    Python: {
      constraints: [
        "Array length should not exceed 10^6.",
        "Elements of the array should be within the range of -10^9 to 10^9.",
        "Ensure the code is syntactically correct before submitting."
      ],
      usage: [
        "Use the provided template to implement your logic.",
        "Click the 'Analyse' button to get the time and space complexity.",
        "Review the output section for detailed analysis."
      ]
    },
    Cpp: {
      constraints: [
        "Array length should not exceed 10^6.",
        "Elements of the array should be within the range of -10^9 to 10^9.",
        "Ensure the code is syntactically correct before submitting."
      ],
      usage: [
        "Use the provided template to implement your logic.",
        "Click the 'Analyse' button to get the time and space complexity.",
        "Review the output section for detailed analysis."
      ]
    }
  };

  const currentInfo = infoContent[language];

  return (
    <Card className="info-section mt-4">
      <CardContent>
        <Typography variant="h5" component="div">
          Language: {language}
        </Typography>
        <div className="constraints mt-2">
          <Typography variant="h6" component="div">
            Constraints:
          </Typography>
          <List>
            {currentInfo.constraints.map((constraint, index) => (
              <ListItem key={index}>
                <ListItemText primary={constraint} />
              </ListItem>
            ))}
          </List>
        </div>
        <div className="usage mt-2">
          <Typography variant="h6" component="div">
            Usage:
          </Typography>
          <List>
            {currentInfo.usage.map((usage, index) => (
              <ListItem key={index}>
                <ListItemText primary={usage} />
              </ListItem>
            ))}
          </List>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoSection;
