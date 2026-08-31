---
title: Formularios y Validación
parent: Desarrollo de Funcionalidades
nav_order: 4
---

# Formularios y Validación

Armamos los formularios con **`react-hook-form`** y validamos con **`zod`**,
conectados mediante `@hookform/resolvers`. El schema es la única fuente de
verdad — los tipos de TypeScript del formulario se *infieren* de él, así que
la validación y los tipos nunca pueden desalinearse.

```tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Text, TextInput } from "react-native";

const schema = z.object({
  email: z.string().email("Ingresá un email válido"),
  amount: z.coerce.number().positive("El monto debe ser mayor a 0"),
});

type FormValues = z.infer<typeof schema>;

export function PaymentForm({ onValid }: { onValid: (v: FormValues) => void }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput value={value} onChangeText={onChange} autoCapitalize="none" />
        )}
      />
      {errors.email && <Text>{errors.email.message}</Text>}

      {/* submit */}
      {/* onPress={handleSubmit(onValid)} */}
    </>
  );
}
```

Puntos clave:

- Envolvé cada input nativo en un **`Controller`** (los inputs de React
  Native no son nodos DOM no controlados, así que RHF necesita el adapter).
- Leé los errores desde `formState.errors.<field>?.message`.
- `z.coerce.number()` convierte el string que produce un `TextInput` en un
  número antes de validar.

{: .tip-title }
Consejo

{: .tip }
Reusá los schemas de zod más allá de los formularios — validá las respuestas
de la API con el mismo schema (`schema.parse(response)`) para que los datos
inválidos fallen ruidosamente en el borde, en vez de en algún lugar profundo
de una screen.
