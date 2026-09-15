import { Separator } from 'adpaws-ui';

export function Horizontal() {
  return (
    <div style={{ width: 280 }}>
      <div style={{ fontSize: 14, fontWeight: 500 }}>Luna</div>
      <div style={{ fontSize: 13, color: '#5f6570' }}>Labrador · 3 años</div>
      <Separator style={{ margin: '12px 0' }} />
      <div style={{ fontSize: 13, color: '#5f6570' }}>Próxima reserva: mañana 9:00 am</div>
    </div>
  );
}

export function Vertical() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 32 }}>
      <span style={{ fontSize: 13 }}>Perfil</span>
      <Separator orientation="vertical" />
      <span style={{ fontSize: 13 }}>Historial</span>
      <Separator orientation="vertical" />
      <span style={{ fontSize: 13 }}>Facturación</span>
    </div>
  );
}
