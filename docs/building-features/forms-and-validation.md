---
title: Forms & Validation
parent: Building Features
nav_order: 4
---

# Forms & Validation

We build forms with **`react-hook-form`** and validate with **`zod`**, wired
together by `@hookform/resolvers`. The schema is the single source of truth — the
form's TypeScript types are *inferred* from it, so validation and types can never
drift apart.

```tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Text, TextInput } from "react-native";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
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

Key points:

- Wrap each native input in a **`Controller`** (React Native inputs aren't
  uncontrolled DOM nodes, so RHF needs the adapter).
- Read errors from `formState.errors.<field>?.message`.
- `z.coerce.number()` turns the string a `TextInput` produces into a number
  before validating.

{: .tip }
Reuse zod schemas beyond forms — validate API responses with the same schema
(`schema.parse(response)`) so bad data fails loudly at the boundary instead of
deep inside a screen.
