"use client";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { handleEditorWillMount } from "@/utils/monacoSetup";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <div className="loadingScreen">
          <div className="loaderDiv">
            <div className="loader" />
          </div>
        </div>
      ) : (
        ""
      )}
      <Editor
        height="100vh"
        theme="vs-dark"
        defaultLanguage="typescript"
        defaultValue="console.log('Hello World')"
        beforeMount={(monaco) => {
          handleEditorWillMount(monaco, setLoading);
        }}
        options={{ fontSize: 16 }}
      />
    </>
  );
}
