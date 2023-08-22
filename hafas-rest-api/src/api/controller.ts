#!/usr/bin/env ts-node --esm
import express, { Response } from "express"
import { Alternative, Departures } from "hafas-client"
import { client } from "./client.ts"

const port: number = Number.parseInt(process.env.PORT || "3000")
const hostname = process.env.HOSTNAME || "localhost"
const url = `http://${hostname}:${port}`

export const controller = express()

controller.use(express.json())

controller.use((_, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	next()
})

controller.get("/home/start", (_, res: Response<Departures>) => {
	const filteredDirections = ["Bf Mahndorf"]

	client
		.departures("775985", { duration: 120 })
		.then((data) => {
			res.json(data)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
})

controller.listen(port, hostname, () => {
	console.info(`Hafas Rest Api is listening on ${url}`)
})
