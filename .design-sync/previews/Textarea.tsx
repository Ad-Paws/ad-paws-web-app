import { Textarea, Label } from 'adpaws-ui';

export function Default() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 360 }}>
      <Label htmlFor="notes">Notas de alimentación</Label>
      <Textarea
        id="notes"
        defaultValue="Luna es alérgica al pollo, dar solo su croqueta habitual. Dos comidas al día."
      />
    </div>
  );
}

export function Placeholder() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 360 }}>
      <Label htmlFor="comments">Comentarios del check-in</Label>
      <Textarea id="comments" placeholder="Escribe cualquier observación sobre el perro..." />
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 360 }}>
      <Label htmlFor="notes-disabled">Notas de alimentación</Label>
      <Textarea id="notes-disabled" defaultValue="Sin restricciones alimenticias." disabled />
    </div>
  );
}
