import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("LETS DO IT!!!")
})

export default router;