# Use official Node.js image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies (important: bcrypt must be installed inside Docker)
RUN npm install

# Copy rest of the application files
COPY . .

# Expose the port (change if needed)
EXPOSE 8000

# Command to run backend
CMD ["node", "index.js"]
