## What I built
I built a web app for automatically updating and tracking personal finances. I wanted to learn web development and decided to create a practical tool that I can use every day. The app stands out from other finance apps with its focus on visual simplicity, responsive design, and open source codebase.

### Category Submission:
Built for Business

### App Link
https://financial-vue-do-vdnma.ondigitalocean.app/#/

This example app allows users to connect to sample data through [Plaid's](https://plaid.com/) sandbox environment. Anyone can fork the code and start connecting to real financial institutions.

### Screenshots
#### Homepage charts
 <img src="https://raw.githubusercontent.com/blairun/FinancialVueDo/main/public/FinancialVue%20-%20Home.png" style="max-width: 600px" width="100%" height="auto"> 

#### Balances view
 <img src="https://raw.githubusercontent.com/blairun/FinancialVueDo/main/public/FinancialVue%20-%20Balances.png" style="max-width: 600px" width="100%" height="auto"> 

#### Transactions view
 <img src="https://raw.githubusercontent.com/blairun/FinancialVueDo/main/public/FinancialVue%20-%20Transactions.png" style="max-width: 600px" width="100%" height="auto"> 

#### User Profile page
 <img src="https://raw.githubusercontent.com/blairun/FinancialVueDo/main/public/FinancialVue%20-%20User%20Profile.png" style="max-width: 600px" width="100%" height="auto"> 

### Description
[FinancialVue](https://github.com/blairun/FinancialVueDo) is a web app for automatically updating and tracking personal finances. The app is designed to run on [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/) or on your local network. The front end client is a static site built with Vue.js and the backend is a Node.js server connected to a PostgreSQL database. Financial data is retrieved via the [Plaid API](https://plaid.com/).

### Link to Source Code
Front end static site: [FinancialVueDo](https://github.com/blairun/FinancialVueDo)<br/>
Back end web app: [FinancialVueBeDo](https://github.com/blairun/FinancialVueBeDo) 

### Permissive License
MIT

## Background
I started teaching myself web development in the middle of the pandemic. FinancialVue is my first ever web app. I wanted a practical, visually-appealing tool to track my personal finances. The initial iteration was designed to run on my home network. My friend invited me to participate in this hackathon, which provided a perfect opportunity to learn how to deploy the code online. Now the DigitalOcean App Platform provides a secure way to host and update the app so it is accessible anywhere.

### How I built it 
The app is made of three components that all run on the DigitalOcean App Platform: a Static site, a Web Service, and a Database. The Source Code README includes a "Deploy to DigitalOcean" button and detailed instructions so that the project can easily be deployed by others.

I learned several new skills and concepts along the way:
- DigitalOcean app platform and deployment
- First time using PostgreSQL
- Git forking, branching, and merging
- HTTP ports for local and DigitalOcean deployment
- Yaml config files for DigitalOcean app button
- Packages including axios, bootstrap, chart.js, d3, passport, pg, plaid, sequelize, vue, and vuex

### Additional Resources/Info
#### Acknowledgments

- [build-your-own-mint](https://github.com/yyx990803/build-your-own-mint) was the starting point for plaid server code.
- [tab-tracker](https://github.com/codyseibert/tab-tracker) was a starting point for client/server data transfer.