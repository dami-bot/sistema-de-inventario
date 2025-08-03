# Usa una imagen oficial de Node
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto (ajustá si usás otro)
EXPOSE 3001


# Comando para iniciar NestJS
COPY docker-entrypoint.sh .

CMD ["./docker-entrypoint.sh"]
