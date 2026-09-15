/**
 * Política de contraseña para los registros (empresa y cliente).
 *
 * Es una validación de UX: guía al usuario y evita un viaje al servidor con
 * una contraseña que se va a rechazar. La regla real tiene que aplicarla el
 * backend en `createUser`; esto no es una frontera de seguridad.
 */

export const PASSWORD_MIN_LENGTH = 10;

export interface PasswordRule {
  id: "length" | "lowercase" | "uppercase" | "number" | "symbol";
  label: string;
  test: (password: string) => boolean;
}

export const PASSWORD_RULES: readonly PasswordRule[] = [
  {
    id: "length",
    label: `Al menos ${PASSWORD_MIN_LENGTH} caracteres`,
    // Array.from cuenta caracteres, no unidades UTF-16 (emojis, acentos compuestos).
    test: (pw) => Array.from(pw).length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: "uppercase",
    label: "Una letra mayúscula",
    test: (pw) => /\p{Lu}/u.test(pw),
  },
  {
    id: "lowercase",
    label: "Una letra minúscula",
    test: (pw) => /\p{Ll}/u.test(pw),
  },
  {
    id: "number",
    label: "Un número",
    test: (pw) => /\p{Nd}/u.test(pw),
  },
  {
    id: "symbol",
    label: "Un símbolo (ej. ! @ # $ %)",
    // Cualquier cosa que no sea letra, número ni espacio.
    test: (pw) => /[^\p{L}\p{N}\s]/u.test(pw),
  },
];

/** Semáforo: rojo, amarillo, verde. `none` = campo vacío. */
export type PasswordStrength = "none" | "weak" | "medium" | "strong";

export interface PasswordEvaluation {
  rules: { rule: PasswordRule; passed: boolean }[];
  passedCount: number;
  strength: PasswordStrength;
  /** Cumple TODAS las reglas. Solo así se permite continuar. */
  isValid: boolean;
}

export function evaluatePassword(password: string): PasswordEvaluation {
  const rules = PASSWORD_RULES.map((rule) => ({
    rule,
    passed: rule.test(password),
  }));
  const passedCount = rules.filter((r) => r.passed).length;
  const isValid = passedCount === PASSWORD_RULES.length;

  let strength: PasswordStrength;
  if (password.length === 0) strength = "none";
  else if (isValid) strength = "strong";
  else if (passedCount >= 3) strength = "medium";
  else strength = "weak";

  return { rules, passedCount, strength, isValid };
}

/** Reglas listas para `react-hook-form` (`rules` de un `FormField`). */
export const passwordFieldRules = {
  required: "La contraseña es requerida",
  validate: (value: string) =>
    evaluatePassword(value ?? "").isValid ||
    "La contraseña no cumple con los requisitos de seguridad",
};
