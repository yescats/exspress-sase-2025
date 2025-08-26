import { Router } from "express";
import { UserService } from "../services/user.service";
import { sendError } from "../utils";
import { send } from "process";

export const UserRoute = Router()

//UserRoute.

UserRoute.get('/', async (req, res) => {
    try {
        res.json(await UserService.getUsers())
    } catch (e) {
        sendError(res, e)
    }
})

UserRoute.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        res.json(await UserService.getUserById(id))
    } catch (e) {
        sendError(res, e)
    }
})

UserRoute.post('/login', async (req, res) => {
    try {
        res.json(await UserService.login(req.body))
        
    } catch (e: any) {
        sendError(res, e, 401)
    }
    
})

UserRoute.post('/register', async (req, res) => {
    try {
        res.json(await UserService.register(req.body))
        
    } catch (e: any) {
        sendError(res, e, 401)
    }
})

UserRoute.put('/delete', async (req, res) => {
    try {
        res.json(await UserService.deleteUser(req.body))
    } catch (e: any) {
        sendError(res, e, 401)
    }
})

UserRoute.post('/refresh', async (req, res) => {
    try {
        const auth = req.headers['authorization']
        const token = auth && auth.split(' ')[1]
        res.json(await UserService.refreshToken(token!))
    } catch (e: any) {
        sendError(res, e, 401)
    }
})

//UserRoute.put('/update_last_visited', async (require, res) => {
    //try {
      //  res.json(await UserService.addVisited(req.body, ))
    //} catch (e: any) {
    //    sendError(res, e, 401)
  //  }
//})



UserRoute.get('/register', async (req, res) => {
    res.send('bocchi da rock')
})

