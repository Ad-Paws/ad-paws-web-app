import { Input, Label } from 'adpaws-ui';

export function Default() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 320 }}>
      <Label htmlFor="dog-name">Nombre del perro</Label>
      <Input id="dog-name" placeholder="Ej. Luna" defaultValue="Luna" />
    </div>
  );
}

export function Placeholder() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 320 }}>
      <Label htmlFor="breed">Raza</Label>
      <Input id="breed" placeholder="Ej. Labrador" />
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 320 }}>
      <Label htmlFor="owner">Dueño</Label>
      <Input id="owner" defaultValue="María Gómez" disabled />
    </div>
  );
}

export function Invalid() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 320 }}>
      <Label htmlFor="phone">Teléfono de contacto</Label>
      <Input id="phone" defaultValue="55-0000" aria-invalid="true" />
    </div>
  );
}
