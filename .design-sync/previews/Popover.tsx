import { Popover, PopoverTrigger, PopoverContent, Button } from 'adpaws-ui';

export function Default() {
  return (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">Filtrar por servicio</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Servicios</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: '#5f6570' }}>
          <span>Guardería completa</span>
          <span>Medio día</span>
          <span>Baño y corte</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
