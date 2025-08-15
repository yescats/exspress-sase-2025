import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { User } from "../entities/User";
import type { RegisterModel } from "../models/register.model";
import bcrypt from 'bcrypt';
import type { LoginModel } from "../models/login.model";
import jwt from "jsonwebtoken";
import type { Response } from "express";
import { sendError } from "../utils";
import type { DeleteModel } from "../models/delete.model";


const repo = AppDataSource.getRepository(User)
const tokenSecret = process.env.JWT_SECRET
const accessTTL = process.env.JWT_ACCESS_TTL
const refreshTTL = process.env.JWT_REFRESH_TTL
export class UserService {

    static async login(model: LoginModel) {
        const user = await this.getUserByEmail(model.email)

        if (await bcrypt.compare(model.password, user!.password)) {
            const payload = {
                id: user!.userId,
                email: user!.email
            }

            return {
                userId: user!.userId,
                name: user!.name,
                email: user!.email,
                access: jwt.sign(payload, tokenSecret!, { expiresIn: accessTTL }),
                refresh: jwt.sign(payload, tokenSecret!, { expiresIn: refreshTTL })
            }
        }
        throw new Error("BAD_CREDENTIALS")
    }

    static async verifyToken(req: any, res: Response, next: Function) {
        const whitelist = ['/api/user/login', '/api/user/register', '/api/user/refresh', '/api/user/delete']

        if (whitelist.includes(req.originalUrl)) {
            console.log("whitelisted")
            next()
            return
        }

        const authHeader = req.headers['authorization']
        console.log("checkpoint 1")
        const token = authHeader && authHeader.split(' ')[1]

        if (token == undefined) {
            console.log(req.originalUrl)
            res.status(401).json({
                message: "NO_TOKEN_FOUND",
                timestamp: new Date()
            })
            return
        }
        console.log("checkpoint 2")
        jwt.verify(token, tokenSecret!, (err: any, user: any) => {
            if (err) {
                res.status(403).json({
                    message: "INVALID_TOKEN",
                    timestamp: new Date()
                })
            }

            req.user = user
            next()
        })
    }

    static async refreshToken(token: string) {
        const decoded: any = jwt.verify(token, tokenSecret!)
        const user = await this.getUserByEmail(decoded.email)

        const payload = {
                id: user?.userId,
                email: user?.email
        }
        

        return {
            name: user?.email,
            access: jwt.sign(payload, tokenSecret, { expiresIn: accessTTL }),
            refresh: token
        }
    }

    static async register(model: RegisterModel) {
        console.log('register checkpoint 1')
        const data = await repo.existsBy({
            email: model.email,
            deletedAt: IsNull()
        })
        console.log('register checkpoint 2')

        if (data){
            console.log("exists")
            throw new Error("USER_ALREADY_EXISTS")
        }
        const userdata = await repo.existsBy({
            email: model.email
        })
        if (!userdata) {
            console.log('register checpoint 3')
            const hashed = await bcrypt.hash(model.password, 12)
            console.log('register checkpoint 4')
            await repo.save({
                email: model.email,
                password: hashed,
                name: model.name,
                })

            const user = await this.getUserByEmail(model.email)
            const payload = {
                id: user!.userId,
                email: user!.email
            }
            return {
                userId: user!.userId,
                name: user!.name,
                email: user!.email,
                access: jwt.sign(payload, tokenSecret!, { expiresIn: accessTTL }),
                refresh: jwt.sign(payload, tokenSecret!, { expiresIn: refreshTTL })
            }

        } else {
            const hashed = await bcrypt.hash(model.password, 12)
            await repo.update({email: model.email}, {password: hashed, name: model.name, updatedAt: new Date(), deletedAt: null})
            const user = await this.getUserByEmail(model.email)
            const payload = {
                id: user!.userId,
                email: user!.email
            }
            return {
                userId: user!.userId,
                name: user!.name,
                email: user!.email,
                access: jwt.sign(payload, tokenSecret!, { expiresIn: accessTTL }),
                refresh: jwt.sign(payload, tokenSecret!, { expiresIn: refreshTTL })
            }
        }

        
    }

    static async getUserByEmail(email: string) {
        console.log("getuserbyemail")
        console.log(email)
        const data = repo.findOne({
            where: {
                email: email,
                deletedAt: IsNull()
            }
        })

        if (data == null) {
            console.log("Ouch")
            throw new Error("USER_NOT_EXIST")
        }
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

    static async deleteUser(model: DeleteModel) {
        console.log("delete checkpoint 1")
        console.log(model.email)
        const user = await this.getUserByEmail(model.email)
        console.log("delete checkpoint 2")
        console.log(user!.userId)
        await repo.update({ userId: user!.userId}, {deletedAt: new Date()})
        console.log("delete checkpoint 3")
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