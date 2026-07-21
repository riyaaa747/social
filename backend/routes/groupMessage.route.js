import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
sendGroupMessage,
getGroupMessages
}
from "../controllers/groupMessage.controller.js";

const router=express.Router();

router.post(
"/send/:id",
isAuthenticated,
sendGroupMessage
);

router.get(
"/:id",
isAuthenticated,
getGroupMessages
);

export default router;