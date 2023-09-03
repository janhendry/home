import { Request, Express } from "express"
import { createClient, Departures, Station } from "hafas-client"
import { DeparturesRequest } from "./types"
import { profile as dbProfile } from "hafas-client/p/db/index.js"
import { autocomplete } from "db-stations-autocomplete"
import { readStations } from "db-stations"

const readableStations = readStations()
const stations: Station[] = []

readableStations.on("data", (data) => {
	stations.push(data)
})

export async function addHafaClientProxy(controller: Express) {
	const userAgent = "j.anstipp@me.com"
	const client = createClient(dbProfile, userAgent)

	controller.post("/departures", async (req: Request<null, Departures, DeparturesRequest>, res) => {
		console.log("POST /departures")
		const departures = await client.departures(req.body.station, req.body.options)
		res.json(departures)
	})

	controller.get("/autocomplete", async (req, res) => {
		const searchStation: string = req.query.station as string
		console.log("GET /autocomplete", searchStation)
		const station = autocomplete(searchStation)
			.map((option) => stations.find((station) => station.id === option.id))
			.filter((station) => station !== undefined)

		console.log(station)

		res.json(station)
	})
}
