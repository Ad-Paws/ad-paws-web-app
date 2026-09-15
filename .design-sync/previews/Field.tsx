import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
  Input,
  Checkbox,
} from 'adpaws-ui';

export function Vertical() {
  return (
    <FieldGroup>
      <Field orientation="vertical">
        <FieldLabel htmlFor="dog-name-v">Nombre del perro</FieldLabel>
        <Input id="dog-name-v" placeholder="Luna" />
        <FieldDescription>Como aparece en su collar o placa.</FieldDescription>
      </Field>
    </FieldGroup>
  );
}

export function Horizontal() {
  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="dog-name-h">Nombre del perro</FieldLabel>
        <Input id="dog-name-h" placeholder="Rocky" />
      </Field>
    </FieldGroup>
  );
}

export function WithError() {
  return (
    <FieldGroup>
      <Field orientation="vertical" data-invalid="true">
        <FieldLabel htmlFor="breed">Raza</FieldLabel>
        <Input id="breed" aria-invalid placeholder="Bulldog Francés" />
        <FieldError errors={[{ message: 'La raza es obligatoria.' }]} />
      </Field>
    </FieldGroup>
  );
}

export function FieldsetWithLegend() {
  return (
    <FieldSet>
      <FieldLegend>Datos del perro</FieldLegend>
      <FieldGroup>
        <Field orientation="vertical">
          <FieldLabel htmlFor="name">Nombre</FieldLabel>
          <Input id="name" placeholder="Maple" />
        </Field>
        <Field orientation="vertical">
          <FieldLabel htmlFor="notes">Notas médicas</FieldLabel>
          <FieldContent>
            <FieldDescription>Alergias, medicamentos o cuidados especiales.</FieldDescription>
          </FieldContent>
        </Field>
        <FieldSeparator>Preferencias</FieldSeparator>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="cancel-policy">
            <Checkbox id="cancel-policy" />
            <FieldTitle>Acepta política de cancelación</FieldTitle>
          </FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
