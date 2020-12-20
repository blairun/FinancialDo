[FinancialVue](https://github.com/blairun/FinancialVue) is a web app for tracking personal finances. The front end client is built with Vue.js and the backend is a Node.js / SQLite server. Data is retrieved via the Plaid API.

---

### <a href="https://192.168.1.150:9990" target="_blank">Server Setup</a>

##### Install Dependencies

Run `npm install` in the server folder to install Node.js dependencies.

##### Setting up API keys

Create an `.env` file in the server directory. Variables in this file will be loaded as environment variables. This file is ignored by Git.

##### Plaid

Sign up for [Plaid](https://plaid.com/) and apply for the development plan. It may take a day to get approved. Sign up is free and limited to 100 items (i.e. banks), so it should be more than enough for personal use.

Once approved, fill out the following in `server/.env`:

- `PLAID_CLIENT_ID=`
- `PLAID_SECRET_development=`
- `PLAID_PUBLIC_KEY=`

##### Install and configure mkcert

This step enables https on the client and server which secures data being passed back and forth such as passwords and tokens.

Follow install instructions here: https://github.com/FiloSottile/mkcert
For example:

```
sudo wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.1/mkcert-v1.4.1-linux-arm -O /usr/local/bin/mkcert
cd certs
mkcert localhost 192.168.1.150
```

Optionally apply mkcert's `rootCA.pem` certificate to networked pc browser(s) to bypass security warnings when visiting this app. (see https://github.com/FiloSottile/mkcert/issues/6)

Site may break in Firefox on Android. Fix by visiting the <a href="https://192.168.1.150:9990" target="_blank">backend server</a> and allowing access.
More Firefox for Android debugging info: https://developer.mozilla.org/en-US/docs/Tools/about:debugging

##### Automate Database Backups to Google Drive

Nightly zip encrypted database backups to Google Drive can be enabled by adding the following `.env` variables. First create a drive file and save its fileID and folderID.

- `DRIVE_DB_FILE_ID=`
- `DRIVE_ARCHIVE_FOLDER_ID=`

Then start a [Google Drive API Project](https://developers.google.com/drive/api/v3/quickstart/nodejs) and create Google Drive OAuth Credentials. Download the client config file and save the following `.env` variables:

- `DRIVE_CLIENT_ID=`
- `DRIVE_CLIENT_SECRET=`
- `DRIVE_REDIRECT_URI=` (use the first item in redirect_uri)

Run `npm run token-drive`. This will prompt for authorization and save OAuth2 tokens in `.env`.

##### Automate Plaid Updates

Adjust the `server/cron.js` file to tweak the time/frequency of the updates. For example, update transactions daily at midnight and noon.

See here for refresher on updating cron jobs: https://www.ostechni1x.com/a-beginners-guide-to-cron-jobs/

##### Install forever

Install forever as a global node package to reliably serve this webapp: https://www.npmjs.com/package/forever

---

### Client Setup

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

- Open the client in a browser (https://localhost:9998)
- Create a new user account
- Connect to financial institutions through plaid (https://localhost:9998/#/user)
- Update balance data (https://localhost:9998/#/balances)
- Update transaction data (https://localhost:9998/#/transactions)

---

### Development Notes

##### forever

forever can be used to reliably start and stop this app: `forever-start` / `forever-stop` / `forever-list`

Update the file paths in `forever.json` to suit your setup.

##### Client Configuration

`npm run build` Compiles and minifies for production

`npm run lint` Lints and fixes files

To customize the Vue configuration, see [Configuration Reference](https://cli.vuejs.org/config/).

##### Server Database

The backend server saves data to a SQLite database. By default, a 'live' database file is created and used.
A 'test' database file can be used by running the server with this command: `DB_ENV=dbTest nodemon app.js`

New user accounts default to the Plaid 'sandbox' mode which allows users to create unlimited plaid connections. To connect to real bank accounts, update the 'plaidEnv' field in the user account to 'development'. SQL editors like SQLiteStudio make it easy to edit the user account database records.

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
