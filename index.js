const express = require("express");
const app = express();
const dotenv = require("dotenv")
const dbconnect = require("./config/database")
const schedule = require("node-schedule")
const { fetchdata } = require("./controllers/fetchdata");
const router = require("./routes/cryptoroute");

dotenv.config();

const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use("/", router)

dbconnect();
fetchdata()

schedule.scheduleJob('0 */2 * * *', fetchdata)

app.listen(PORT, () => {
    console.log("server started at port 4000")
})