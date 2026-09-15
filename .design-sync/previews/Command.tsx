import { Home, Dog, CalendarClock, Users } from 'lucide-react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from 'adpaws-ui';

export function Default() {
  return (
    <Command style={{ maxWidth: 360, border: '1px solid var(--border)' }}>
      <CommandInput placeholder="Buscar perros, dueños o acciones..." />
      <CommandList>
        <CommandGroup heading="Perros">
          <CommandItem>
            <Dog />
            Luna
            <CommandShortcut>⌘L</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Dog />
            Rocky
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Acciones">
          <CommandItem>
            <Home />
            Ir al panel
          </CommandItem>
          <CommandItem>
            <CalendarClock />
            Nueva reserva
          </CommandItem>
          <CommandItem>
            <Users />
            Ver dueños
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function EmptyState() {
  return (
    <Command style={{ maxWidth: 360, border: '1px solid var(--border)' }}>
      <CommandInput placeholder="Buscar «Bobby»..." />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
      </CommandList>
    </Command>
  );
}
