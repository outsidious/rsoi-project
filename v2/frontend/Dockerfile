# base image
FROM node:14-alpine3.12 as build


# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@16.0.4

# add app
COPY . /app

# start app
CMD ng serve