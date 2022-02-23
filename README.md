Frontend app for interacting with Gitopia chain.

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

We welcome any bugfixes or optimizations from communinty. For requesting any feature please create an issue first.
Detailed guidelines for creating pull requests will be updated soon.

Setup your local environment variables

```bash
cp .env.development .env.development.local
vim .env.development.local
```

Start a development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This work is dual-licensed under Apache 2.0 and MIT.
You can choose between one of them if you use this work.

`SPDX-License-Identifier: Apache-2.0 OR MIT`
