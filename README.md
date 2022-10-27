# Gitopia Web

![Gitopia](https://github.com/gitopia/gitopia-web/blob/master/public/og-gitopia.jpg)

Web frontend app for interacting with Gitopia chain.

## Local setup

To run or build the app, first, need to install `Node.js` and `Yarn` globally

First Install Node (above 12.x.x LTS version) from [official website](https://nodejs.org/)

Then install Yarn

```bash
npm install -g yarn
# OR
sudo npm install -g yarn
```

Then install project dependencies

```bash
yarn
```

Setup your local environment variables

```bash
cp .env.production .env.production.local
vim .env.production.local
```

Build the files

```bash
yarn build
```

Start the production server

```bash
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

Gitopia Web is an open source project and contributions from community are always welcome. Discussion and development majorly take place on the Gitopia via issues and proposals -- everyone is welcome to post bugs, feature requests, comments and pull requests to Gitopia. (read [Contribution Guidelines](CONTRIBUTING.md) and [Coding Guidelines](CodingGuidelines.md).

Setup your local environment variables

```bash
cp .env.development .env.development.local
vim .env.development.local
```

Start a development server

```bash
yarn dev
```

Test your code for linting errors

```bash
yarn lint
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This work is dual-licensed under Apache 2.0 and MIT.
You can choose between one of them if you use this work.

`SPDX-License-Identifier: Apache-2.0 OR MIT`
