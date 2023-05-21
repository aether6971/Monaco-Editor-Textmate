import { wireTmGrammars } from "monaco-editor-textmate";
import { updateTheme } from "@/utils/colors";
import { LanguageRegistry, languages } from "@/utils/grammars";
import { loadWASM } from "onigasm";

export const handleEditorWillMount = async (
  monaco: any,
  setLoading: (val: boolean) => void
) => {
  monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  const theme = await (await fetch("/theme.json")).json();
  await loadWASM(`/onigasm.wasm`);
  const registry = new LanguageRegistry({
    basePath: "/",
    jsonFetcher: async (uri) => (await fetch(uri)).json(),
  });

  const grammars = new Map();
  languages.forEach(({ id, scopeName }) => {
    grammars.set(id, scopeName);
  });
  console.log(grammars);
  monaco.editor.defineTheme("vs-dark", updateTheme("vs-dark", "dark", theme));
  try {
    await wireTmGrammars(monaco, registry, grammars);
  } catch (error) {
    console.log((error as Error).message);
  }
  setLoading(false);
  // monaco.editor.setTheme('dark')
  console.clear();
};
