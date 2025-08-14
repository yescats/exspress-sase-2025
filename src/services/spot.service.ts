import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Spot } from "../entities/Spot"
import type { SpotModel } from "../models/spot.model";
import { UserService } from "./user.service";

const repo = AppDataSource.getRepository(Spot)

export class SpotService {
    static async createSpot(model: SpotModel, userId: number) {
        console.log("createspot_start")
        console.log(userId)

        const data = await repo.existsBy({
            location: model?.location,
            deletedAt: IsNull() 
        })
        if (data) {
            console.log("already exists")
            throw new Error("SPOT_ALREADY_EXISTS")
        }
        await repo.save({
            location: model?.location,
            name: model?.name,
            description: model?.description,
            addedBy: userId
        })
        console.log("checkpoint 3")
    }

    static async getSpots() {
        const data = repo.find({
            where: {
                deletedAt: IsNull()
            }
        })
        if (data == null) {
            throw new Error("NO_DATA___SOMEHOW")
        }
        return data
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