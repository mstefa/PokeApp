#use an standar container to start build ours owns
FROM node:14.16.0-alpine3.13
# Create app directory insede the container
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
#npm install or for production 
RUN npm ci  --only=production
# Bundle app source
COPY . .
#Expose the port used by de app
EXPOSE 3002
CMD node index.js