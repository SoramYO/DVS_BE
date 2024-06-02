# Use the official Node.js image as the base image
FROM node:20

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the app source code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run the app
CMD ["node", "src/server.js"]

#Run docker docker-compose up --build