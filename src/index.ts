import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { configDotenv } from 'dotenv'
import { AppDataSource } from './db'
import { UserRoute } from './routes/user.route'
import http from 'http'
import { SpotRoute } from './routes/spot.route'
import { UserService } from './services/user.service'
import https from 'https'
import fs from 'fs'


const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))


app.use(UserService.verifyToken)
app.use('/api/user', UserRoute)
app.use('/api/spot', SpotRoute)

app.get('/', (req, res) => {
    res.send('hello')
})


const sslOption = {
    key: fs.readFileSync('./src/crypto/key.pem'),
    cert: fs.readFileSync('./src/crypto/cert.pem')
}

configDotenv()
AppDataSource.initialize().then(() => {
    console.log('connected to database')
    const port = process.env.SERVER_PORT || 3000


    https.createServer(sslOption, app)
        .listen(port, () => 
            console.log(`app started on port ${port}`)
        )
})
.catch(e=>{
    console.log('erm, didnt connect oopsie')
    console.log(e)
})
