import React, { useEffect, useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';

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
    <div className="flex flex-column">
      <div className="card flex flex-column">
        <CodeEditor
          className="w-30rem h-20rem overflow-scroll"
          value={localCode}
          language={language}
          placeholder={`Please enter ${language} code.`}
          onChange={handleChange}
          padding={15}
          rows={25}
          style={{
            backgroundColor: "#f5f5f5",
            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          }}
        />
      </div>
    </div>
  );
}
