import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {createGroup, getGroups,updateGroup} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/create", isAuthenticated, createGroup);

router.put("/:id", isAuthenticated, updateGroup);

router.get("/", isAuthenticated, getGroups);

export default router;