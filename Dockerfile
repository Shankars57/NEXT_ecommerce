FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy rest of the application
COPY . .

# Build the application
RUN yarn build

EXPOSE 3000

# Start the application
CMD ["sh", "-c", "npx prisma migrate deploy && yarn start"]