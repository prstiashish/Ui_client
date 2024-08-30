FROM node:alpine

# Expose the port in which react application will run
EXPOSE 3000

# Set the working directory
WORKDIR /src

# Copy and install ReactJS requirements
COPY package-lock.json /src
COPY package.json /src

# `npm ci` command will install the dependency graph resolved in package-lock.json
RUN npm install

# Uncomment this and remove the volume definition in docker-compose.yml during production deployment
COPY . /src

# Start the container process
CMD [ "npm" , "run", "dev" ]