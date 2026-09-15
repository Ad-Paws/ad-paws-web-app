import { Label, Input } from 'adpaws-ui';

export function Default() {
  return <Label htmlFor="service">Servicio</Label>;
}

export function WithControl() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 280 }}>
      <Label htmlFor="dog-name-label">Nombre del perro</Label>
      <Input id="dog-name-label" defaultValue="Rocky" />
    </div>
  );
}
