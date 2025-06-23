import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Spot } from "../entities/Spot"
import type { SpotModel } from "../models/spot.model";

const repo = AppDataSource.getRepository(Spot)

export class SpotService {
    static async createSpot(model: SpotModel, user_id: number) {
        const data = await repo.existsBy({
            location: model?.location,
            deletedAt: IsNull() 
        })
        if (data) {
            throw new Error("SPOT_ALREADY_EXISTS")
        }
        await repo.save({
            location: model?.location,
            image: model?.image,
            name: model?.name,
            description: model?.description,
            added_by: user_id
        })
        console.log("checkpoint 3")
    }

    static async getSpotById(id: number) {
        const data = repo.findOne({
            where:{
                spotId: id,
                deletedAt: IsNull()
            }
        })
        if (data == null) {
            throw new Error("SPOT_NOT_EXIST")
        }
        return data
    }

    static async getSpotByLocation(place: string) {
        const data = repo.findOne({
            where: {
                location: place,
                deletedAt: IsNull()
            }
        })
        if (data == null) {
            throw new Error("SPOT_NOT_EXIST")
        }
        return data
    }

    static async deleteSpot(spot: string, user_id: number) {
        const data = await repo.findOne({
            where: {
                name: spot,
                addedBy: user_id,
                deletedAt: IsNull()
            }
        })
        if (data == null) {
            throw new Error("SPOT_NOT_EXIST")
        }
        await repo.save({
            deletedAt: Date.now()
        })
    }
}