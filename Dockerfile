FROM node:18-alpine

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

# Делаем папку public доступной для хоста
VOLUME ["/app/public"]

# Открываем порт
EXPOSE 3000

# Запускаем в режиме разработки
CMD ["npm", "run", "dev"]