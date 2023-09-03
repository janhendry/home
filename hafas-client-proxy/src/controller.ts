import express from "express"
import { addHafaClientProxy } from "./hafaClientProxy.ts"

export const controller = express()

controller.use((_, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	next()
})

const port: number = Number.parseInt(process.env.PORT || "3000")
const hostname = process.env.HOSTNAME || "192.168.178.41"
const url = `http://${hostname}:${port}`

addHafaClientProxy(controller)

controller.listen(port, hostname, () => {
	console.info(`Hafas Rest Api is listening on ${url}`)
})
