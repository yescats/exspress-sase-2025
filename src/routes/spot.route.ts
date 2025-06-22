import { Router } from "express";
import { SpotService } from "../services/spot.service";
import { sendError } from "../utils";

export const SpotRoute = Router()

SpotRoute.post('/create', async (req, res) => {
    try {
        res.json(await SpotService.createSpot(req.body, 1))
    } catch (e: any) {
        sendError(res, e, 401)
    }
})

SpotRoute.get('/', async (req, res) => {
    res.send('ojds')
}) 