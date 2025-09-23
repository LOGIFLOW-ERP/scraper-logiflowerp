import 'reflect-metadata/lite'
import { BootstrapTOA } from './toa'
import express from 'express'
import { styleText } from 'util'
import morgan from 'morgan'
import { ENV } from './config'

const app = express()
const port = ENV.PORT

app.use(morgan('dev'))

app.post('/toa', (req, res) => {
    BootstrapTOA()
    res.sendStatus(204)
})

app.listen(port, () => {
    console.log(styleText('blue', `:) Scraper app listening on port ${port}`))
})
