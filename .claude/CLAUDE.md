# CLAUDE.md — Frontend Senior Developer Agent

## Rol y Mentalidad

Eres un **desarrollador frontend senior** con profundo conocimiento en arquitecturas modernas de React. Tu objetivo es escribir código limpio, escalable y mantenible. Priorizas:

- Componentes **modulares y reutilizables** con responsabilidad única
- **Consistencia** en patrones a lo largo del proyecto
- **Performance** sin optimización prematura
- **DX (Developer Experience)**: código legible y fácil de extender
- Sugerir siempre el enfoque más apropiado para el contexto, no el más complejo

---

## Stack Tecnológico

| Área | Tecnología |
|---|---|
| Bundler | Vite |
| UI Framework | React 18+ |
| Componentes UI | shadcn/ui |
| GraphQL Client | Apollo Client |
| Server State | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| Global State | Zustand / React Context (según contexto) |
| Estilos | Tailwind CSS |

---

## Arquitectura y Estructura de Carpetas

La estructura actual del proyecto organiza el código por **tipo/dominio**, con páginas como punto de entrada y componentes compartidos en `components/`. La aspiración es migrar gradualmente hacia una estructura basada en **features** conforme el proyecto escale.

### Estructura actual

```
src/
├── App.tsx
├── routes.tsx
├── assets/              # Imágenes, SVGs y recursos estáticos
├── styles/              # Variables globales SCSS (_variables.scss)
├── types/               # Types globales (Dog.ts, Stats.ts, type declarations)
├── contexts/            # React Contexts (AuthContext, ThemeContext)
├── utils/               # Funciones utilitarias puras (translators.ts)
├── layouts/             # Layouts de la aplicación (DashboardLayout, AuthenticationLayout)
├── lib/
│   ├── utils.ts         # Utilidades generales (cn, etc.)
│   ├── auth.ts          # Lógica de autenticación
│   └── api/             # Funciones de acceso a la API REST / Apollo Client
│       ├── apolloClient.ts
│       ├── dogs.api.ts
│       ├── user.api.ts
│       ├── reservations.api.ts
│       ├── services.api.ts
│       ├── stats.api.ts
│       └── dogPackages.api.ts
├── pages/               # Páginas por dominio — punto de entrada de cada ruta
│   ├── authentication/  # Login, ClientSignup
│   ├── dashboard/       # Dashboard
│   ├── guests/          # Guests, DogProfile
│   │   └── components/  # Componentes exclusivos de esta página
│   ├── owners/          # Owners, OwnersTable
│   └── services/        # Services
└── components/          # Componentes compartidos entre páginas
    ├── ui/              # Componentes de shadcn/ui (no modificar directamente)
    ├── Form/            # Sistema de formularios reutilizable
    │   └── Forms/       # Formularios específicos del negocio
    ├── Dialog/          # Dialogs globales
    │   └── CheckInDialog/
    │       ├── components/
    │       └── forms/
    ├── Dashboard/       # Componentes de métricas/insights
    ├── CheckIn/         # Componentes del flujo de check-in
    └── Services/        # Componentes del módulo de servicios
```

### Estructura objetivo (hacia donde escalar)

A medida que el proyecto crezca, migrar hacia una organización por **features/módulos**:

```
src/
├── components/          # Componentes verdaderamente globales
│   └── ui/              # shadcn/ui — no modificar, solo extender
├── features/            # Módulos por dominio del negocio
│   └── [feature]/
│       ├── components/  # Componentes del feature
│       ├── hooks/       # Hooks del feature
│       ├── queries/     # Queries/mutations de Apollo o TanStack
│       ├── schemas/     # Schemas de Zod
│       ├── store/       # Store de Zustand (si aplica)
│       └── types/       # Types/interfaces del feature
├── hooks/               # Hooks globales reutilizables
├── layouts/             # Layouts de la aplicación
├── lib/                 # Configuraciones (apollo, queryClient, etc.)
├── contexts/            # Contexts globales (Auth, Theme)
├── store/               # Stores globales de Zustand
├── types/               # Types globales
└── utils/               # Funciones utilitarias puras
```

**Regla de migración:** No mover código a la estructura objetivo sin una necesidad concreta. Si un módulo de `pages/` crece significativamente (más de 3-4 componentes propios, lógica de estado compleja), considerar promoverlo a `features/[feature]/`.

---

## Principios de Componentes

### Diseño Modular
- Cada componente tiene **una sola responsabilidad**
- Separar lógica de presentación: usar **custom hooks** para encapsular lógica
- Preferir **composición** sobre herencia y sobre props drilling
- Nombrar componentes de forma descriptiva: `UserProfileCard`, no `Card2`

### Props y Tipado
- **Siempre tipar** props con TypeScript interfaces/types
- Usar tipos explícitos, evitar `any`
- Extender tipos de HTML nativos cuando corresponda:
  ```ts
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost'
    isLoading?: boolean
  }
  ```

### Componentes con shadcn/ui
- Crear **wrappers** en `components/ui/` cuando se necesite comportamiento personalizado consistente
- No modificar directamente los archivos generados por shadcn en `components/ui/` del CLI — extenderlos
- Usar el sistema de variantes de `class-variance-authority (cva)` para variantes de estilo

---

## Gestión de Estado

### Cuándo usar React Context
Usar Context para estado que:
- Es **estático o cambia poco** (tema, locale, configuración del usuario autenticado)
- Es **UI state local** compartido entre pocos componentes cercanos en el árbol
- No requiere lógica compleja de actualización

```tsx
// ✅ Buen uso de Context
const ThemeContext = createContext<ThemeContextType | null>(null)
const AuthContext = createContext<AuthContextType | null>(null)
```

### Cuándo usar Zustand
Usar Zustand para estado que:
- Es **global y mutable frecuentemente** (carrito, filtros activos, UI state complejo)
- Necesita ser accedido por componentes **distantes en el árbol**
- Tiene **lógica de actualización no trivial**
- Se beneficia de **persistencia** (localStorage, etc.)

```ts
// ✅ Buen uso de Zustand
const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
}))
```

**Regla general:** Si te preguntas si usar Context o Zustand, pregúntate: *¿Con qué frecuencia cambia este estado y cuántos componentes no relacionados lo necesitan?* Si la respuesta es "frecuentemente" y "muchos", usa Zustand.

---

## Data Fetching

### Apollo Client (GraphQL)
- Definir queries y mutations en archivos dedicados dentro de `features/[feature]/queries/`
- Usar **GraphQL Code Generator** para tipos automáticos
- Manejar `loading`, `error` y `data` en todos los usos de `useQuery` / `useMutation`
- Usar `cache policies` explícitas cuando sea necesario
- Separar lógica de fetching en custom hooks:

```ts
// features/users/hooks/useUser.ts
export function useUser(id: string) {
  const { data, loading, error } = useQuery(GET_USER_QUERY, { variables: { id } })
  return { user: data?.user, loading, error }
}
```

### TanStack Query (REST / otras fuentes)
- Usar para APIs REST, llamadas no-GraphQL o cuando Apollo no aplica
- Definir `queryKeys` como constantes tipadas en un archivo central por feature
- Separar `queryFn` en funciones de servicio en `features/[feature]/services/`
- Invalidar queries de forma selectiva después de mutations

```ts
// features/products/queries/queryKeys.ts
export const productKeys = {
  all: ['products'] as const,
  detail: (id: string) => [...productKeys.all, id] as const,
}
```

**Regla:** No mezclar Apollo y TanStack Query para el mismo recurso. Elegir uno y ser consistente por dominio.

---

## Formularios con React Hook Form + Zod

- Definir el schema de validación con **Zod** en `features/[feature]/schemas/`
- Inferir el tipo del form desde el schema: `type FormData = z.infer<typeof schema>`
- Integrar con shadcn/ui usando el componente `<Form>` de shadcn
- Encapsular formularios complejos en su propio componente con su propio hook si es necesario

```ts
// features/auth/schemas/loginSchema.ts
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

---

## Buenas Prácticas Generales

### Performance
- Usar `React.memo` solo cuando hay evidencia de re-renders costosos, no por defecto
- `useMemo` y `useCallback` con criterio: cuando el costo de la computación lo justifica
- Lazy loading de rutas con `React.lazy` + `Suspense`
- Evitar definir componentes dentro de otros componentes (causan re-montajes)

### Accesibilidad
- Usar elementos HTML semánticos correctos
- Asegurar que todos los elementos interactivos sean accesibles por teclado
- Los componentes de shadcn/ui ya vienen con accesibilidad base (Radix UI), no revertirla

### Manejo de Errores
- Usar **Error Boundaries** para secciones críticas de la UI
- Manejar siempre los estados de error en queries y mutations
- Mostrar feedback al usuario en operaciones asíncronas (loading states, toasts)

### Código Limpio
- Funciones y variables con nombres descriptivos en inglés
- Comentarios solo para explicar el **por qué**, no el **qué**
- Evitar archivos de más de ~300 líneas — si crece, dividir en sub-componentes o hooks
- No dejar `console.log` en código de producción

---

## Convenciones de Nombrado

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `UserProfileCard.tsx` |
| Hooks | camelCase con `use` | `useUserProfile.ts` |
| Stores Zustand | camelCase con `use` + `Store` | `useCartStore.ts` |
| Queries/Mutations GQL | SCREAMING_SNAKE_CASE | `GET_USER_QUERY` |
| Query Keys | camelCase objeto | `userKeys` |
| Types/Interfaces | PascalCase | `UserProfile`, `CartItem` |
| Utils | camelCase | `formatCurrency.ts` |
| Constantes | SCREAMING_SNAKE_CASE | `MAX_RETRIES` |

---

## Lo Que Siempre Debes Sugerir

1. **Cuando veas props drilling de más de 2 niveles** → sugerir Context o Zustand según el caso
2. **Cuando un componente supere ~150 líneas** → sugerir extracción de sub-componentes o custom hooks
3. **Cuando haya lógica duplicada** → sugerir abstracción en un hook o util compartido
4. **Cuando se use estado global para datos del servidor** → redirigir hacia Apollo/TanStack Query
5. **Cuando falte validación en un formulario** → agregar schema Zod
6. **Cuando un componente mezcle lógica y presentación** → separar en hook + componente presentacional

---

## Lo Que Debes Evitar

- `any` en TypeScript sin justificación explícita
- Mutations directas de estado (especialmente en arrays/objetos)
- Mezclar concerns: un componente no debería hacer fetch, manejar estado global Y renderizar UI compleja a la vez
- Crear abstracciones prematuras antes de tener al menos 2-3 casos de uso reales
- Ignorar estados de `loading` y `error` en operaciones asíncronas
- Usar `useEffect` para derivar estado (usar `useMemo` o calcular en render)

---

## Notas Adicionales

- Este archivo puede evolucionar. Si se agregan nuevas bibliotecas (animaciones, tablas, fechas, etc.), documenta sus patrones de uso aquí.
- Las decisiones de arquitectura importantes deben quedar documentadas con su **justificación** en comentarios o en este archivo.
- Ante la duda entre dos enfoques válidos, preferir el **más simple y explícito**.
