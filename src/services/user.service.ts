import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { User } from "../entities/User";
import type { RegisterModel } from "../models/register.model";
import bcrypt from 'bcrypt'


const repo = AppDataSource.getRepository(User)

export class UserService {
    static async register(model: RegisterModel) {
        console.log('I start')
        const data = await repo.existsBy({
            email: model.email,
            deletedAt: IsNull()
        })

        if (data)
            throw new Error("USER_ALREADY_EXISTS")

        const hashed = await bcrypt.hash(model.password, 12)
        await repo.save({
            email: model.email,
            password: hashed,
            name: model.name
        })
    }

    static async getUserByEmail(email: string) {
        const data = repo.findOne({
            where: {
                email: email,
                deletedAt: IsNull()
            }
        })

        if (data == null) 
            throw new Error("USER_NOT_EXIST")

        return data
    }

    static async getUserById(id: number) {
        const data = repo.findOne({
            where: {
                userId: id,
                deletedAt: IsNull()
            }
        })

        if (data == null) 
            throw new Error("USER_NOT_EXIST")

        return data
    }

    static async deleteUser(id: number) {
        if (await this.getUserById(id)) {
            await repo.save({
                deletedAt: Date.now()
            })
        }
    }
    static async addVisited(id: number, spot: number) {
        const user = await this.getUserById(id)
        if (user == null) {
            throw new Error("USER_NOT_EXIST")
        }
        const newSpot = user.lastSpotId
        repo.save({
            lastSpotId: spot
        })
        
    }
}