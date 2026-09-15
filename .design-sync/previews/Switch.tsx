import { Switch, Label } from 'adpaws-ui';

export function OnOff() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Switch id="whatsapp" defaultChecked />
        <Label htmlFor="whatsapp">Recordatorios por WhatsApp</Label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Switch id="email" />
        <Label htmlFor="email">Recordatorios por correo</Label>
      </div>
    </div>
  );
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Switch size="sm" defaultChecked />
      <Switch size="default" defaultChecked />
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Switch disabled />
      <Label>No disponible</Label>
    </div>
  );
}
