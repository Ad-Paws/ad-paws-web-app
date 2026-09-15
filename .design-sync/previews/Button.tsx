import { Plus, Trash2, ChevronRight } from 'lucide-react';
import { Button } from 'adpaws-ui';

export function Variants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <Button variant="default">Guardar</Button>
      <Button variant="secondary">Cancelar</Button>
      <Button variant="outline">Ver detalles</Button>
      <Button variant="ghost">Omitir</Button>
      <Button variant="destructive">Eliminar</Button>
      <Button variant="link">Más información</Button>
    </div>
  );
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <Button size="sm">Pequeño</Button>
      <Button size="default">Normal</Button>
      <Button size="lg">Grande</Button>
      <Button size="icon" aria-label="Agregar">
        <Plus />
      </Button>
    </div>
  );
}

export function WithIcon() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <Button>
        <Plus />
        Nueva reserva
      </Button>
      <Button variant="outline">
        Continuar
        <ChevronRight />
      </Button>
      <Button variant="destructive">
        <Trash2 />
        Eliminar perro
      </Button>
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <Button disabled>Guardar</Button>
      <Button variant="outline" disabled>
        Cancelar
      </Button>
    </div>
  );
}
