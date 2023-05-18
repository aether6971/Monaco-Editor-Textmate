"use client"
import React, { useRef } from "react";
import Editor from '@monaco-editor/react'
import { loadWASM } from 'onigasm'
import { Registry } from 'monaco-textmate'
import { wireTmGrammars } from 'monaco-editor-textmate'

export default function Home() {
  const monacoRef = useRef(null);

  const handleEditorWillMount = async (monaco: any) => {
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    monacoRef.current = monaco;
    const theme = await(await fetch('/theme.json')).json()
    const grammar = await (await fetch(`/grammars/typescript/TypeScript.tmLanguage.json`)).json()
    console.log(grammar)
    await loadWASM(`/onigasm.wasm`)
    const registry = new Registry({
      getGrammarDefinition: async (scopeName) => {
        return {
          format: 'json',
          content: grammar
        }
      }
    })
    
    const grammars = new Map()
    grammars.set('css', 'source.css')
    grammars.set('html', 'text.html.basic')
    grammars.set('javascript', 'source.js')
    grammars.set('typescript', 'source.ts')
    monaco.editor.defineTheme('vs-dark', theme);
    await wireTmGrammars(monaco, registry, grammars)
    // monaco.editor.setTheme('dark')
  }

  return (
    <Editor
      height="90vh"
      theme="vs-dark"
      defaultLanguage="typescript"
      defaultValue="console.log('Hello World')"
      beforeMount={handleEditorWillMount}
    />
  );

}
