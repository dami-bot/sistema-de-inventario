#!/bin/sh

# Ejecutar migraciones Prisma
npx prisma migrate deploy

# Iniciar la app NestJS
npm run start
