const mongoose = require("mongoose")
const cryptoschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    currentprice: {
        type: Number,
        required: true
    },
    marketcap: {
        type: Number,
        required: true
    },
    change24: {
        type: Number,
        required: true
    },
    lastupdate: {
        type: Date,
        default: Date.now
    },
    last100: {
        type: [Number],
        default: []
    }
})
module.exports = mongoose.model("Crypto", cryptoschema)