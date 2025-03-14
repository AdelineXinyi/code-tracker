import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";

export default function MonacoEditor({ code, onChange }: { code: string, onChange: (newCode: string) => void }) {
  // Set the correct type for the ref (HTMLElement | null)
  const editorRef = useRef<HTMLDivElement | null>(null);  // Use HTMLDivElement as the type

  useEffect(() => {
    if (editorRef.current) {  // Ensure the ref is not null
      const editor = monaco.editor.create(editorRef.current, {
        value: code,
        language: "javascript",  // Set the language you want (e.g., "javascript", "python", etc.)
        theme: "vs-dark",  // Set a theme
        automaticLayout: true,  // Make sure the layout adjusts to container size
      });

      // Listen for changes in the editor content
      editor.onDidChangeModelContent(() => {
        onChange(editor.getValue());  // Update parent component with the new code
      });

      return () => {
        editor.dispose();  // Cleanup the editor when the component is unmounted
      };
    }
  }, [code, onChange]);  // Re-run the effect if the code or onChange changes

  return <div ref={editorRef} style={{ height: "500px", width: "100%" }} />;  // Container for Monaco Editor
}