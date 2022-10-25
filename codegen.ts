import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://prod.backend.prop.house/graphql",
  documents: ["src/**/*.tsx"],
  ignoreNoDocuments: true,
  config: { useTypeImports: true },
  generates: { "./src/propHouse/graphql/": { preset: "client", plugins: [] } },
};

export default config;
