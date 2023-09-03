import { Request, Express } from "express"
import { createClient, Departures, Station } from "hafas-client"
import { DeparturesRequest, SearchStationRequest } from "./types"
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
		console.log(req.body)
		const departures = await client.departures(req.body.station, req.body.options)
		res.json(departures)
	})

	controller.post("/station", async (req: Request<null, Station[], SearchStationRequest>, res) => {
		console.log("POST /station", req.body)
		const { query, results, fuzzy, completion } = req.body
		console.log(query, results, fuzzy, completion)
		const stationList = autocomplete(query, results, fuzzy, completion)
			.map((option) => stations.find((station) => station.id === option.id))
			.filter((station) => station !== undefined)
		res.json(stationList as Station[])
	})
}
