import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from 'adpaws-ui';

export function Closed() {
  return (
    <Select defaultValue="guarderia">
      <SelectTrigger style={{ width: 240 }}>
        <SelectValue placeholder="Selecciona un servicio" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="guarderia">Guardería completa</SelectItem>
        <SelectItem value="medio-dia">Medio día</SelectItem>
        <SelectItem value="bano">Baño y corte</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function Open() {
  return (
    <Select defaultOpen defaultValue="guarderia">
      <SelectTrigger style={{ width: 240 }}>
        <SelectValue placeholder="Selecciona un servicio" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Servicios</SelectLabel>
          <SelectItem value="guarderia">Guardería completa</SelectItem>
          <SelectItem value="medio-dia">Medio día</SelectItem>
          <SelectItem value="bano">Baño y corte</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="entrenamiento">Entrenamiento</SelectItem>
      </SelectContent>
    </Select>
  );
}
