import React, { useEffect, useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Card, CardContent } from "@mui/material";

export default function CodeEditorArea({ language, code, onCodeChange }) {
  const [localCode, setLocalCode] = useState(code);

  useEffect(() => {
    setLocalCode(code);
  }, [code]);

  const handleChange = (evn) => {
    const newCode = evn.target.value;
    setLocalCode(newCode);
    onCodeChange(newCode);
  };

  return (
    <Card className="w-100 mt-3">
      <CardContent>
        <CodeEditor
          value={localCode}
          language={language}
          placeholder={`Please enter ${language} code.`}
          onChange={handleChange}
          padding={15}
          rows={25}
          style={{
            backgroundColor: "#f5f5f5",
            fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
            fontSize: 14,
            height: '100%',
            overflow: 'auto',
          }}
        />
      </CardContent>
    </Card>
  );
}
