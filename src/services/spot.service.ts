import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Spot } from "../entities/Spot"
import type { SpotModel } from "../models/spot.model";
import { UserService } from "./user.service";

const repo = AppDataSource.getRepository(Spot)

export class SpotService {
    static async createSpot(model: SpotModel, userId: number) {

        const data = await repo.existsBy({
            location: model?.location,
            deletedAt: IsNull() 
        })
        if (data) {
            throw new Error("SPOT_ALREADY_EXISTS")
        }
        await repo.save({
            location: model?.location,
            name: model?.name,
            description: model?.description,
            addedBy: userId
        })
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

    static async deleteSpot(spot_id: any) {
        const data = await repo.findOne({
            where: {
                spotId: spot_id.id,
                deletedAt: IsNull()
            }
        })
        if (data == null) {
            throw new Error("SPOT_NOT_EXIST")
        }
        await repo.update({spotId: data.spotId},{ deletedAt: new Date()})
    }

    static async redactSpot(spot_id: number, spot: SpotModel) {
        const data = await repo.findOne({
            where: {
                spotId: spot_id,
                deletedAt: IsNull()
            }
        })
        if (data == null) {
            throw new Error("SPOT_NOT_EXIST")
        }
        await repo.update({spotId: data.spotId}, {name: spot.name, location: spot.location, description: spot.description, updatedAt: new Date()})
    }
}