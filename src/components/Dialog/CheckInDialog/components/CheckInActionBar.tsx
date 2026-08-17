import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { formatPrice } from "../constants";

/**
 * Barra de acciones fija al pie del diálogo.
 *
 * En un laptop de 13" el modal deja unos 500px útiles, y lo que quedaba abajo
 * del pliegue era justo lo que la persona necesita: cuánto se cobra y el botón
 * para confirmar. Tener que scrollear para encontrar el precio es al revés de
 * como debería ser — el detalle puede quedar abajo, la decisión no.
 *
 * `sticky bottom-0` dentro del contenedor con scroll del diálogo, con fondo
 * opaco y borde superior para que el contenido no se transparente por detrás.
 */

interface CheckInActionBarProps {
  /** Lo que se cobra. Null mientras no haya cotización del servidor. */
  amountDue: number | null;
  /** Valuación completa; si es mayor, se muestra tachada. */
  total?: number | null;
  quoteError?: string | null;
  /** Los botones del formulario. */
  children: ReactNode;
}

export function CheckInActionBar({
  amountDue,
  total,
  quoteError,
  children,
}: CheckInActionBarProps) {
  const quoted = amountDue !== null;
  const covered = quoted && total != null && total > amountDue;

  return (
    <div className="sticky bottom-0 -mx-6 mt-2 px-6 pt-3 pb-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">
          {covered ? "A cobrar" : "Total"}
        </span>
        {quoteError ? (
          // Nunca un importe cuando la cotización falló: se cobraría de menos.
          <span className="flex items-center gap-1.5 text-sm text-red-700">
            <AlertCircle className="w-4 h-4" />
            No se pudo cotizar
          </span>
        ) : !quoted ? (
          <span className="text-sm text-muted-foreground">Cotizando…</span>
        ) : (
          <span className="flex items-baseline gap-2">
            {covered && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(total!)}
              </span>
            )}
            <span className="text-xl font-bold text-brand-strong">
              {formatPrice(amountDue)}
            </span>
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
