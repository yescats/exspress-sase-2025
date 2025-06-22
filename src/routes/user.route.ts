import { Router } from "express";
import { UserService } from "../services/user.service";
import { sendError } from "../utils";

export const UserRoute = Router()

UserRoute.post('/register', async (req, res) => {
    console.log('I am?')
    try {
        res.json(await UserService.register(req.body))
    } catch (e: any) {
        sendError(res, e, 401)
    }
})



UserRoute.get('/register', async (req, res) => {
    res.send('bocchi da rock')
})

UserRoute.get('/', async (req, res) => {
    res.send('bawomp')
})