import React, { useRef, useEffect } from "react";
import ace from "ace-builds"; // Import Ace Editor library
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

function CodeEditor() {
  const editorRef = useRef(null);

  useEffect(() => {
    // Initialize Ace Editor
    const editor = ace.edit(editorRef.current);
    editor.session.setMode("ace/mode/javascript");
    editor.setTheme("ace/theme/github");
    editor.setFontSize(18);
    editor.setValue("// Type your code here", 1); // Set initial code
    editor.gotoLine(1); // Move cursor to the first line
    editor.setOptions({
      // Set editor options
      maxLines: Infinity, // Set to Infinity for unlimited lines
      autoScrollEditorIntoView: true,
      tabSize: 2,
    });

    // Handle changes in the editor content
    editor.getSession().on("change", () => {
      // Access the current content of the editor using: editor.getValue()
      // You can perform any additional logic here
    });

    // Save editor instance to the ref
    editorRef.current = editor;

    // Clean up function
    return () => {
      // Dispose the editor instance when the component unmounts
      editor.destroy();
    };
  }, []);

  return (
    <div className="code-editor" ref={editorRef}></div>
  );
}

export default CodeEditor;
