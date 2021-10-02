FROM node:12-alpine

ENV PORT 3000
EXPOSE 3000

# Create app directory
RUN mkdir /app
WORKDIR /app

RUN npm install --global pm2

# Installing dependencies
ADD package.json yarn.lock /app/
RUN yarn --pure-lockfile --production

# Copying source files
ADD . /app

RUN yarn build

USER node

# Running the app
CMD [ "pm2-runtime", "npm", "--", "start" ]