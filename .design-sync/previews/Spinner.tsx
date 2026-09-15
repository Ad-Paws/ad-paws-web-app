import { Spinner } from 'adpaws-ui';

export function Default() {
  return <Spinner style={{ width: 24, height: 24 }} />;
}

export function WithLabel() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#5f6570', fontSize: 14 }}>
      <Spinner style={{ width: 18, height: 18 }} />
      Cargando reservas del día...
    </div>
  );
}
