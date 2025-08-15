import { Router } from "express";
import { SpotService } from "../services/spot.service";
import { sendError } from "../utils";
import { send } from "process";

export const SpotRoute = Router()

SpotRoute.post('/create', async (req: any, res) => {
    try {
        console.log(req.user.id)
        await SpotService.createSpot(req.body, req.user.id)
    } catch (e: any) {
        sendError(res, e, 401)
    }
})

SpotRoute.get('/:id', async (require, res) => {
    try {
        const id = Number(require.params.id)
        res.json(await SpotService.getSpotById(id))
    } catch (e) {
        sendError(res, e)
    }
})

SpotRoute.post('/:id/change', async (require, res) => {
    try {
        const id = Number(require.params.id)
        await SpotService.redactSpot(id, require.body)
    } catch (e: any) {

    }
})

SpotRoute.get('/', async (req, res) => {
    try {
        res.json(await SpotService.getSpots())
    } catch (e) {
        sendError(res, e)
    }
}) 