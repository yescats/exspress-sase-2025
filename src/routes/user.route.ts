import { Router } from "express";
import { UserService } from "../services/user.service";
import { sendError } from "../utils";

export const UserRoute = Router()

//UserRoute.

UserRoute.post('/login', async (req, res) => {
    try {
        res.json(await UserService.login(req.body))
        
    } catch (e: any) {
        sendError(res, e, 401)
    }
    
})

UserRoute.post('/register', async (req, res) => {
    console.log('I am?')
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

