# Use an official Node.js runtime as a parent image
FROM node:21-alpine3.18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire frontend application to the container
COPY . .

# Expose the port that the React app runs on (default: 3000)
EXPOSE 8080

# Define the command to start your application
CMD ["npm", "run", "preview"]