import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * El schema es una copia del SDL exportado por el backend (`backend/schema.graphql`).
 * Tras cualquier cambio en el backend: copiarlo de nuevo y correr `pnpm codegen`.
 *
 * `documents` solo apunta a las carpetas nuevas: las operaciones legadas de
 * `src/lib/api/*` no validan contra el schema nuevo y se migrarán gradualmente
 * a `src/graphql/operations` (o `src/features/[feature]/queries`).
 */
const config: CodegenConfig = {
  overwrite: true,
  schema: "./schema.graphql",
  documents: ["src/graphql/**/*.{ts,tsx}", "src/features/**/*.{ts,tsx}"],
  ignoreNoDocuments: true,
  generates: {
    "src/gql/": {
      preset: "client",
      config: {
        useTypeImports: true,
        scalars: {
          // Money viaja como string decimal ("650.00"); nunca number (el
          // backend rechaza números para evitar pérdida de punto flotante).
          Money: "string",
          DateTime: "string",
          Upload: "File",
        },
      },
    },
  },
};

export default config;
