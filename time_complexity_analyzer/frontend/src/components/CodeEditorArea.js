import React, { useEffect, useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';

export default function CodeEditorArea({language, initialCode}) {
  const [code, setCode] = useState(initialCode)
  const [send, setSend] = useState(initialCode)
 
  const handleAnalyseClick = () => {
    // Add your logic for analyzing the code here
    // This function will be called when the "Analyse" button is clicked
    console.log("Code analysis triggered");
  };

  useEffect(() => {
    setSend(initialCode)
  
  },[code,language, initialCode])
  return (
    <>
    <div className="flex flex-column">
     
    <div className="card flex flex-row ">
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
      {/* Add the "Analyse" button */}
      
      </div>
    </div>
    </div>
    </>
  );
}
