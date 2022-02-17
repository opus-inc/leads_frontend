FROM node:14.18.0

ENV PORT 3000
EXPOSE 3000

# Create app directory
RUN mkdir /app
WORKDIR /app

# RUN npm install --global pm2

# Installing dependencies
COPY package.json  /app/
# RUN yarn --pure-lockfile --production
RUN yarn

# Copying source files
COPY . /app

RUN yarn build

# RUN chmod -R 777 .

# USER node

# Running the app
# CMD [ "pm2-runtime", "npm", "--", "start" ]
CMD yarn run dev
