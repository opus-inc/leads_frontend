FROM node:12-alpine

ENV PORT 3000
EXPOSE 3000

# Create app directory
RUN mkdir /app
WORKDIR /app

# Installing dependencies
ADD package.json yarn.lock /app/
RUN yarn --pure-lockfile

# Copying source files
ADD . /app

RUN yarn build

# Running the app
CMD "yarn" "start"