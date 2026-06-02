# 1. Indicamos la imagen base (Node 20 en su versión 'alpine' que es mucho más ligera)
FROM node:20-alpine

# 2. Creamos y nos movemos a la carpeta /app dentro del contenedor
WORKDIR /app

# 3. Copiamos PRIMERO los archivos de dependencias
# (Esto ayuda a que Docker guarde en caché este paso y sea más rápido)
COPY package.json package-lock.json ./

# 4. Instalamos las dependencias
RUN npm install

# 5. Copiamos el resto de los archivos de tu proyecto al contenedor
COPY . .

# 6. Construimos la aplicación de Next.js para producción
RUN npm run build

# 7. Exponemos el puerto 3000 (el que usa Next.js por defecto)
EXPOSE 3000

# 8. Comando final que se ejecuta al levantar el contenedor
CMD ["npm", "start"]