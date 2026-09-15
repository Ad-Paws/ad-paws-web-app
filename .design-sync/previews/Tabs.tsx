import { Tabs, TabsList, TabsTrigger, TabsContent } from 'adpaws-ui';

export function Default() {
  return (
    <Tabs defaultValue="perfil" style={{ width: 360 }}>
      <TabsList>
        <TabsTrigger value="perfil">Perfil</TabsTrigger>
        <TabsTrigger value="historial">Historial</TabsTrigger>
        <TabsTrigger value="facturacion">Facturación</TabsTrigger>
      </TabsList>
      <TabsContent value="perfil" style={{ fontSize: 14, color: '#5f6570', paddingTop: 12 }}>
        Luna · Labrador · 3 años. Dueña: María Gómez.
      </TabsContent>
      <TabsContent value="historial" style={{ fontSize: 14, color: '#5f6570', paddingTop: 12 }}>
        4 visitas este mes, última el 12 de septiembre.
      </TabsContent>
      <TabsContent value="facturacion" style={{ fontSize: 14, color: '#5f6570', paddingTop: 12 }}>
        Saldo pendiente: $0.00 MXN.
      </TabsContent>
    </Tabs>
  );
}

export function LineVariant() {
  return (
    <Tabs defaultValue="activos" style={{ width: 320 }}>
      <TabsList variant="line">
        <TabsTrigger value="activos">Activos</TabsTrigger>
        <TabsTrigger value="archivados">Archivados</TabsTrigger>
      </TabsList>
      <TabsContent value="activos" style={{ fontSize: 14, color: '#5f6570', paddingTop: 12 }}>
        8 perros con reserva activa hoy.
      </TabsContent>
      <TabsContent value="archivados" style={{ fontSize: 14, color: '#5f6570', paddingTop: 12 }}>
        No hay perros archivados.
      </TabsContent>
    </Tabs>
  );
}
