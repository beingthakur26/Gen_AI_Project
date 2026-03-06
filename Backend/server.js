const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require("dotenv").config()
const app = require('./src/app')
const connectDB = require('./src/config/Database')

connectDB()

app.listen(3000, () => {
    console.log("server is running on port 3000")
})