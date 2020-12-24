[FinancialVue](https://github.com/blairun/FinancialVueDo) is a web app for tracking personal finances. The front end client is a static site built with Vue.js and the backend is a Node.js server connected to a PostgreSQL database. Financial data is retrieved via the Plaid API.

TODO !! Update client README with FinancialVue setup info. Focus on easy setup through DigitalOcean app platform.
# Getting Started #

These steps will get this sample application running for you using DigitalOcean.

**Note: Following these steps will result in charges for the use of DigitalOcean services**

## Requirements


* You need a DigitalOcean account. If you don't already have one, you can sign up at https://cloud.digitalocean.com/registrations/new
    
## Forking the Sample App Source Code

To use all the features of App Platform, you need to be running against your own copy of this application. To make a copy, click the Fork button above and follow the on-screen instructions. In this case, you'll be forking this repo as a starting point for your own app (see [Github documentation](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) to learn more about forking repos.

After forking the repo, you should now be viewing this README in your own github org (e.g. `https://github.com/<your-org>/sample-vuejs`)

**Note:** You can skip forking this repo and select the "Vue.js" sample from the app creation page, however do notice that certain features will be disabled.

## Deploying the App ##

Click this button to deploy the app to the DigitalOcean App Platform.

 [![Deploy to DO](https://mp-assets1.sfo2.digitaloceanspaces.com/deploy-to-do/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/digitalocean/sample-vuejs/tree/main)
 
## Making Changes to Your App ##

As long as you left the default Autodeploy option enabled when you first launched this app, you can now make code changes and see them automatically reflected in your live application. During these automatic deployments, your application will never pause or stop serving request because the App Platform offers zero-downtime deployments.

## Learn More ##

You can learn more about the App Platform and how to manage and update your application at https://www.digitalocean.com/docs/apps/.

===========

IDEA Add instructions for local development?
### Client Setup for Development

##### Set up API keys

Create an `.env` file in the client directory. Variables in this file will be loaded as environment variables. This file is ignored by Git. Fill out the following in the `client/.env` file:

- `VUE_APP_PLAID_PUBLIC_KEY=`

##### Install Dependencies

Run `npm install` in the client folder to install Node.js dependencies.

---

### Running the App

From the server folder, run `nodemon app.js` to start the backend server.

Then from the client folder run `npm run serve` to compile and hot-reload the client.

If everything has been done correctly, you will be able to

- Open the client in a browser (https://localhost:8080)
- Create a new user account
- Connect to financial institutions through plaid (https://localhost:8080/#/user)
- Update balance data (https://localhost:8080/#/balances)
- Update transaction data (https://localhost:8080/#/transactions)

---
##### Client Configuration

`npm run build` Compiles and minifies for production

`npm run lint` Lints and fixes files


---

### Acknowledgments

- [build-your-own-mint](https://github.com/yyx990803/build-your-own-mint) was the starting point for plaid server code.
- [tab-tracker](https://github.com/codyseibert/tab-tracker) was a starting point for client/server data transfer.

---

### Screenshots

Landing page<br>
![Screenshot1](https://raw.githubusercontent.com/blairun/FinancialVue/master/public/ScreenShot1.png)

Homepage charts<br>
![Screenshot2](https://raw.githubusercontent.com/blairun/FinancialVue/master/public/ScreenShot9.png)

Balances<br>
![Screenshot3](https://raw.githubusercontent.com/blairun/FinancialVue/master/public/ScreenShot6.png)

Transactions<br>
![Screenshot4](https://raw.githubusercontent.com/blairun/FinancialVue/master/public/ScreenShot5.png)


