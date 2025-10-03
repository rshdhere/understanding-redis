import 'dotenv/config';
import express, { Request, Response } from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());
const client = createClient();

const PORT = process.env.PORT || 3000;

app.post('/submit', async(req: Request, res: Response) => {
    const { problemId, userId, code, language } = req.body;

    try {
        await client.lPush("submissions", JSON.stringify({problemId, userId, code, language}));

    } catch(err){
        console.error("Error occured while feeding data to redis at,",err);
    };

    res.json({
        message: "Submission Receive!"
    })
})

const startServer = async () => {
    try{
        await client.connect();
        console.log('connected to redis successfully');

        app.listen(PORT, () => {
            console.log(`your server is listening on http://localhost:${PORT}`)
        })

    }
    catch (err) {
        console.error('failed while connecting to redis', err)
    }
};

startServer();