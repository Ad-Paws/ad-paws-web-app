import { Checkbox, Label } from 'adpaws-ui';

export function Unchecked() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Checkbox id="terms" />
      <Label htmlFor="terms">Acepta política de cancelación</Label>
    </div>
  );
}

export function Checked() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Checkbox id="vaccines" defaultChecked />
      <Label htmlFor="vaccines">Vacunas al día</Label>
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Checkbox id="disabled-unchecked" disabled />
        <Label htmlFor="disabled-unchecked">Requiere baño extra</Label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <Label htmlFor="disabled-checked">Recogida por terceros autorizada</Label>
      </div>
    </div>
  );
}
