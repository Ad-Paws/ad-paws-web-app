import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  Button,
} from 'adpaws-ui';

export function Default() {
  return (
    <Card style={{ width: 320 }}>
      <CardHeader>
        <CardTitle>Luna</CardTitle>
        <CardDescription>Labrador · 3 años · María Gómez</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            Editar
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, fontSize: 14, color: '#5f6570' }}>
          Próxima reserva: guardería completa, mañana 9:00 am. Notas: alergia leve a pollo.
        </p>
      </CardContent>
      <CardFooter style={{ gap: 8 }}>
        <Button size="sm">Ver historial</Button>
        <Button size="sm" variant="outline">
          Nueva reserva
        </Button>
      </CardFooter>
    </Card>
  );
}
