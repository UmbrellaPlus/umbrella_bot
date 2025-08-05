require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());

const botToken = process.env.BOT_TOKEN;
const chatIds = JSON.parse(process.env.CHAT_ID);

app.use(cors({
    origin: "https://umbrella-plus.com.ua"
}));

app.post("/sendMessage", async (req, res) => {

    if (req.headers.origin && req.headers.origin !== "https://umbrella-plus.com.ua") {
        return res.status(403).json({error: "Forbidden"});
    }

    const {phone} = req.body;

    if(!phone) {
        return res.status(400).json({error: "Phone number is required"});
    }

    try {
        await Promise.all(chatIds.map(chatId =>
                axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    chat_id: chatId,
                    text: `${phone}`
                }
        )));

        res.status(200).json({message: "Phone number sent successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to send phone number"});
    }
});

app.use((err, req,
         res, next) => {
    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({error: "Not allowed by CORS"});
    }
    next(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
