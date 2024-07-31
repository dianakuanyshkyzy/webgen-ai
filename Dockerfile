# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY .env ./
COPY . . 

# Build the Next.js application
RUN yarn run build

# Expose the port the app runs on
EXPOSE 5432

# Start the application
CMD ["yarn", "dev"]
