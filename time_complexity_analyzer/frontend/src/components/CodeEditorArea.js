// CodeEditorArea.jsx
import React, { useEffect, useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';

export default function CodeEditorArea({ language, initialCode }) {
  const [code, setCode] = useState(initialCode);
  const [send, setSend] = useState(initialCode);

  useEffect(() => {
    setSend(code);
  }, [code]);

  return (
    <div className="flex flex-column">
      <div className="card flex flex-column">
        <CodeEditor
          className="w-30rem h-20rem overflow-scroll"
          value={send}
          language={language}
          placeholder={`Please enter ${language} code.`}
          onChange={(evn) => setCode(evn.target.value)}
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

