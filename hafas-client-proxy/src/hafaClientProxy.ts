import { Request, Express } from "express"
import { createClient, Departures } from "hafas-client"
import { DeparturesRequest } from "./types"
import { profile as dbProfile } from "hafas-client/p/db/index.js"

export function addHafaClientProxy(controller: Express) {
	const userAgent = "j.anstipp@me.com"
	const client = createClient(dbProfile, userAgent)

	controller.post("/departures", async (req: Request<null, Departures, DeparturesRequest>, res) => {
		console.log("POST /departures")
		const departures = await client.departures(req.body.station, req.body.options)
		res.json(departures)
	})
}
