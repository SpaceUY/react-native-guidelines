---
title: Entorno y Configuración
nav_order: 5
has_children: true
---

# Entorno y Configuración

Dos tipos de configuración, mantenidos separados:

- Valores de **runtime** que la app lee mientras corre (una URL de API).
- Valores de **build-time** que cambian *qué tipo de app estás compilando* —
  dev, preview o producción.

Y una regla que los une a los dos: **mantené los secretos fuera del cliente.**

- **Entorno en Tiempo de Ejecución** · **Configuración en Tiempo de Compilación** · **Secretos**
