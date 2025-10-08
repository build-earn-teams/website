import express from "express"
import { getStatus, signup, testEmail } from "../controllers/collaboratorController.js"

const collaboratorRouter= express.Router()


collaboratorRouter.get('/api',getStatus)
collaboratorRouter.post('/api/v1/signup', signup);
collaboratorRouter.get('/api/test-email', testEmail);


export default collaboratorRouter