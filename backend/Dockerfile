FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies (use package-lock if present)
COPY package*.json ./
RUN npm ci --production

# Copy source
COPY . .

EXPOSE 5000

CMD ["npm", "run", "start"]
