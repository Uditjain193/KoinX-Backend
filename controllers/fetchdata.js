const axios = require("axios");
const Crypto = require("../models/crypto")


const fetchdata = async (req, res) => {
    try {
        const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price',
            {
                params: {
                    ids: 'bitcoin,matic-network,ethereum',
                    vs_currencies: 'usd',
                    include_market_cap: true,
                    include_24hr_change: true,
                }
            }
        )
        const all = ['bitcoin', 'matic-network', 'ethereum'];
        for (let i = 0; i < all.length; i++) {
            const { usd: price, usd_market_cap: marketcap, usd_24h_change: change24 } = data[all[i]];
            const existing = await Crypto.findOne({ name: all[i] });
            if (existing) {
                existing.last100.push(price);
                if (existing.last100.length > 100) {
                    existing.last100.shift();
                }
                existing.currentprice = price;
                existing.marketcap = marketcap;
                existing.change24 = change24;
                existing.lastupdate = new Date();
                await existing.save()
            } else {
                const newmodel = await Crypto.create({
                    name: all[i], currentprice: price, marketcap, change24, last100: [price]
                })
            }
        }
    }
    catch (error) {
        console.log(error)
    }
}


const fetchbyid = async (req, res) => {
    const { coin } = req.query;
    const arr = ['bitcoin', 'matic-network', 'ethereum'];
    if (!coin || !arr.includes(coin)) {
        return res.status(400).json({
            error: "invalid or missing coin"
        })
    }
    try {
        const crypto = await Crypto.findOne({ name: coin });
        res.status(201).json({
            price: crypto.currentprice,
            marketcap: crypto.marketcap,
            '24hChange': crypto.change24
        })
    }
    catch (e) {
        res.status(500).json({ error: "server error" })
    }
}


const calculatederivation = (prices) => {
    const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length
    const sqdiff = prices.map((price) => Math.pow(price - mean, 2))
    const variance = sqdiff.reduce((acc, diff) => acc + diff, 0) / prices.length
    return Math.sqrt(variance)
}


const findderivation = async (req, res) => {
    const { coin } = req.query;
    const arr = ['bitcoin', 'matic-network', 'ethereum'];
    if (!coin || !arr.includes(coin)) {
        return res.status(400).json({
            error: "invalid or missing coin"
        })
    }
    try {
        const crypto = await Crypto.findOne({ name: coin });
        const derivation = calculatederivation(crypto.last100);
        return res.status(201).json({
            derivation: parseFloat(derivation.toFixed(2))
        })
    }
    catch (e) {
        res.status(500).json({
            error: "server error"
        })
    }
}

module.exports = { fetchdata, fetchbyid, findderivation }