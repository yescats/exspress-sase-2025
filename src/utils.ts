import type { Response } from "express";

export function sendError(res: Response, e: any, code: number = 500) {
    res.status(code).json({
        message: e.message ?? 'An error occured',
        timestamp: new Date(),
    })
}