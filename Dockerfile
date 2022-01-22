FROM node:12-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY package.json ./
# COPY  yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# Start the app
ENTRYPOINT ["yarn", "start"]
