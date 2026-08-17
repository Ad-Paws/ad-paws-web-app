/**
 * Verifica el contraste de los tokens del tema contra WCAG 2.1 AA.
 *
 * Existe porque el problema no se ve: el verde de marca (#a3c585) es precioso
 * como relleno y daba 1.93:1 usado como texto — la mitad del mínimo. Estuvo así
 * en 36 lugares, incluidos los importes a cobrar, y nadie lo notó revisando
 * capturas. Una fórmula sí lo nota.
 *
 * Lee los valores directamente de src/index.css, así que no puede quedar
 * desincronizado con el tema real.
 *
 * Correr con: node scripts/check-contrast.mjs
 */

import { readFileSync } from "node:fs";

const AA_NORMAL = 4.5;
const AA_LARGE = 3.0; // >=18.66px bold o >=24px
const CSS = readFileSync("src/index.css", "utf8");

/** Lee `--token: #rrggbb;` del bloque indicado (`:root` o `.dark`). */
function tokens(blockName) {
  const start = CSS.indexOf(blockName + " {");
  if (start === -1) throw new Error(`No encuentro el bloque ${blockName}`);
  const block = CSS.slice(start, CSS.indexOf("\n}", start));
  const found = {};
  for (const [, name, value] of block.matchAll(
    /--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g,
  )) {
    found[name] = value.toLowerCase();
  }
  return found;
}

function luminance(hex) {
  const [r, g, b] = hex
    .replace("#", "")
    .match(/../g)
    .map((h) => parseInt(h, 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Cada par es una combinación que la interfaz REALMENTE produce. Añadir un uso
 * nuevo de un token como texto sin añadirlo aquí es como no haberlo revisado.
 */
const PAIRS = [
  // [texto, fondo, mínimo, descripción]
  ["foreground", "background", AA_NORMAL, "texto principal sobre el fondo"],
  ["foreground", "card", AA_NORMAL, "texto principal en tarjeta"],
  ["muted-foreground", "card", AA_NORMAL, "subtítulos en tarjeta"],
  ["muted-foreground", "background", AA_NORMAL, "subtítulos sobre el fondo"],
  ["brand-strong", "card", AA_NORMAL, "marca como texto en tarjeta"],
  ["brand-strong", "background", AA_NORMAL, "marca como texto sobre el fondo"],
  ["brand-strong", "brand-tint", AA_NORMAL, "marca como texto en su tinte"],
  ["brand-foreground", "brand", AA_NORMAL, "texto sobre relleno de marca"],
  ["primary-foreground", "primary", AA_NORMAL, "texto en botón primario"],
  ["secondary-foreground", "secondary", AA_NORMAL, "texto en botón secundario"],
  ["accent-foreground", "accent", AA_NORMAL, "texto sobre acento"],
  ["badge-success-foreground", "badge-success", AA_LARGE, "badge de éxito"],
  ["badge-warning-foreground", "badge-warning", AA_LARGE, "badge de aviso"],
  ["badge-danger-foreground", "badge-danger", AA_LARGE, "badge de peligro"],
];

let failures = 0;

for (const theme of [":root", ".dark"]) {
  const t = tokens(theme);
  console.log(`\n${theme === ":root" ? "TEMA CLARO" : "TEMA OSCURO"}`);

  for (const [fgName, bgName, min, label] of PAIRS) {
    const fg = t[fgName];
    const bg = t[bgName];
    if (!fg || !bg) {
      console.log(`  ?      ${label} — falta ${!fg ? fgName : bgName}`);
      continue;
    }
    const ratio = contrast(fg, bg);
    const ok = ratio >= min;
    if (!ok) failures++;
    console.log(
      `  ${ok ? "ok  " : "FALLA"} ${ratio.toFixed(2).padStart(5)}:1  ` +
        `(min ${min})  ${label}`,
    );
  }
}

if (failures > 0) {
  console.error(
    `\n✗ ${failures} combinación(es) por debajo del mínimo WCAG AA.\n` +
      `  Si el color es de marca, recuerda que hay dos tokens: --brand para\n` +
      `  rellenos y --brand-strong para texto. Ver src/index.css.\n`,
  );
  process.exit(1);
}

console.log(`\n✓ ${PAIRS.length * 2} combinaciones de tokens cumplen WCAG AA`);
