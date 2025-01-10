const express = require("express");
const router = express.Router();

const { fetchbyid, findderivation } = require("../controllers/fetchdata");

router.get("/stats", fetchbyid)
router.get("/deviation", findderivation)

module.exports = router
