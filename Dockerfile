FROM node:12-alpine

RUN apk add --no-cache git

VOLUME /app
WORKDIR /app
COPY . .

RUN yarn install

# Start the app
ENTRYPOINT ["yarn", "dev"]
