[FinancialVue](https://github.com/blairun/FinancialVueDo) is a web app for automatically updating and tracking personal finances. The app is designed to run on [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/) or on your local network. The front end client is a static site built with Vue.js and the backend is a Node.js server connected to a PostgreSQL database. Financial data is retrieved via the [Plaid API](https://plaid.com/).

---
## Getting Started

These steps will get this application running for you using DigitalOcean. **Note that following these steps will result in charges for the use of DigitalOcean services.**


## Requirements

#### DigitalOcean
You need a DigitalOcean account. If you don't already have one, you can sign up at https://cloud.digitalocean.com/registrations/new.

#### Plaid
You will need to sign up for [Plaid](https://plaid.com/) and apply for the development plan. It may take a day to get approved. Sign up is free and limited to 100 items (i.e. banks), so it should be more than enough for personal use.

## Forking the Source Code

To use all the features of App Platform, you need to be running against your own copy of this code. In this case, you'll be [forking](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) two github repos: [FinancialVueDo](https://github.com/blairun/FinancialVueDo) and [FinancialVueBeDo](https://github.com/blairun/FinancialVueBeDo) as a starting point for your own app.

After forking the repos, you should now be viewing this README in your own github org (e.g. `https://github.com/<your-org>/FinancialVueDo`).

## Deploying the App

#### Deploy Backend Server and Database

Click this button to deploy the backend server and the database to the DigitalOcean App Platform.

 [![Deploy to DO](https://mp-assets1.sfo2.digitaloceanspaces.com/deploy-to-do/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/blairun/FinancialVueBeDo/tree/main)

When prompted, fill in the following environment variables:

- `PLAID_CLIENT_ID=` (See https://dashboard.plaid.com/overview/development)
- `PLAID_PUBLIC_KEY=`
- `PLAID_SECRET_development=`
- `PLAID_SECRET_sandbox=`
- `JWT_SECRET=` (Password chosen by developer)
- `TIINGO_API_KEY=` (Optional. For market data. See https://api.tiingo.com/)
- `DB_NAME=${db.DATABASE}` (Database connection params. See the DigitalOcean app dashboard)
- `DB_USER=${db.USERNAME}`
- `DB_PASS=${db.PASSWORD}`
- `DB_HOST=${db.HOSTNAME}`
- `DB_PORT=${db.PORT}`
- `APP_PORT=8080`
- `CLIENT_ADDRESS=${financial-vue-do.PUBLIC_URL}`

#### Deploy Frontend Server

From your newly created app, choose "Components" » "+ Create Component" » "Static Site". Then choose the "FinancialVueDo" frontend client that you previously forked.

When prompted for Branch, choose  "main".

Edit HTTP Routes, and set the Routes to `/`.

Edit Environment Variables by adding the following:

- `VUE_APP_PLAID_PUBLIC_KEY=` (see https://dashboard.plaid.com/overview/development)
- `VUE_APP_API=${financial-vue-be-do.PUBLIC_URL}`

## Making Changes to Your App

As long as you left the default Autodeploy option enabled when you first launched this app, you can now make code changes and see them automatically reflected in your live application. You can learn more about the App Platform and how to manage and update your application at https://www.digitalocean.com/docs/app-platform/.

#### Sandbox vs real financial data

By default, all user accounts use the Plaid sandbox environment. To connect to real financial data, you will need to open the User table in the database (via SQL or with a database manager like DBeaver) and change the user's "PlaidEnv" field from "sandbox" to "development". Each of the user's new Plaid connections will now use up 1 of your 100 Plaid developer Items.

---

## Local development

**Note: This app needs to run in conjunction with the backend server: [FinancialVueBeDo](https://github.com/blairun/FinancialVueBeDo).**

Run `yarn install` in the client folder to install Node.js dependencies.

Create an `.env` file in the root directory. Variables in this file will be loaded as environment variables. Add these variables:

- `VUE_APP_PLAID_PUBLIC_KEY=` (see https://dashboard.plaid.com/overview/development)
- `VUE_APP_API=http://localhost:8880/`

Then from the client folder run `vue-cli-service serve` to compile and hot-reload the client.

---

## Screenshots

#### Homepage charts
![Homepage charts](https://raw.githubusercontent.com/blairun/FinancialVueDo/main/public/FinancialVue%20-%20Home.png)

#### Balances view
![Balances view](https://raw.githubusercontent.com/blairun/FinancialVueDo/main/public/FinancialVue%20-%20Balances.png)

#### Transactions view
![Transactions view](https://raw.githubusercontent.com/blairun/FinancialVueDo/main/public/FinancialVue%20-%20Transactions.png)

#### User Profile page
![User Profile page](https://raw.githubusercontent.com/blairun/FinancialVueDo/main/public/FinancialVue%20-%20User%20Profile.png)

---
## Acknowledgments

- [build-your-own-mint](https://github.com/yyx990803/build-your-own-mint) was the starting point for plaid server code.
- [tab-tracker](https://github.com/codyseibert/tab-tracker) was a starting point for client/server data transfer.
