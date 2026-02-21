import express from "express";

const app = express();

app.get("/api/ping", (_req, res) => {
    return res.json({ message: "pong" });
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
