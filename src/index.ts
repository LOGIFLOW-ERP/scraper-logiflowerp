import 'reflect-metadata/lite'
import { BootstrapTOA } from './toa'
import express from 'express'
import { styleText } from 'util'

const app = express()
const port = 3000

app.post('/toa', (req, res) => {
    BootstrapTOA()
    res.sendStatus(204)
})

app.listen(port, () => {
    console.log(styleText('blue', `:) Scraper app listening on port ${port}`))
})
