import { Search, Mail, Eye } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from 'adpaws-ui';

export function AddonStart() {
  return (
    <InputGroup style={{ maxWidth: 320 }}>
      <InputGroupAddon align="inline-start">
        <Search />
      </InputGroupAddon>
      <InputGroupInput placeholder="Buscar perro por nombre..." />
    </InputGroup>
  );
}

export function AddonEndWithButton() {
  return (
    <InputGroup style={{ maxWidth: 320 }}>
      <InputGroupAddon align="inline-start">
        <Mail />
      </InputGroupAddon>
      <InputGroupInput placeholder="correo@adpaws.com.mx" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="sm">
          <Eye />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

export function TextAddon() {
  return (
    <InputGroup style={{ maxWidth: 320 }}>
      <InputGroupAddon align="inline-start">
        <InputGroupText>MXN</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="450.00" />
    </InputGroup>
  );
}

export function WithTextarea() {
  return (
    <InputGroup style={{ maxWidth: 320 }}>
      <InputGroupAddon align="block-start">
        <InputGroupText>Notas médicas</InputGroupText>
      </InputGroupAddon>
      <InputGroupTextarea placeholder="Alergias, medicamentos, cuidados especiales..." />
    </InputGroup>
  );
}
