import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from 'adpaws-ui';

const dogs = [
  { name: 'Luna', breed: 'Labrador', owner: 'María Gómez', status: 'Check-in', service: 'Guardería completa' },
  { name: 'Rocky', breed: 'Bulldog Francés', owner: 'Carlos Ruiz', status: 'En espera', service: 'Medio día' },
  { name: 'Maple', breed: 'Golden Retriever', owner: 'Ana Torres', status: 'Check-out', service: 'Guardería completa' },
  { name: 'Toby', breed: 'Beagle', owner: 'Diego Salas', status: 'Check-in', service: 'Baño y corte' },
];

export function Default() {
  return (
    <Table>
      <TableCaption>Reservas de hoy — 4 perros registrados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Perro</TableHead>
          <TableHead>Raza</TableHead>
          <TableHead>Dueño</TableHead>
          <TableHead>Servicio</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dogs.map((dog) => (
          <TableRow key={dog.name}>
            <TableCell style={{ fontWeight: 500 }}>{dog.name}</TableCell>
            <TableCell>{dog.breed}</TableCell>
            <TableCell>{dog.owner}</TableCell>
            <TableCell>{dog.service}</TableCell>
            <TableCell>{dog.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total del día</TableCell>
          <TableCell>4 reservas</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
