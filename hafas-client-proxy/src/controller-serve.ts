import { Station, createClient } from "hafas-client"
import { DeparturesRequest, SearchStationRequest } from "."
import { profile as dbProfile } from "hafas-client/p/db/index.js"
import { autocomplete } from "db-stations-autocomplete"
import { readStations } from "db-stations"

const readableStations = readStations()
const stations: Station[] = []

readableStations.on("data", (data) => {
	stations.push(data)
})

Bun.serve({
	fetch(req) {
		return handleFetch(req)
	},
})

function handleFetch(req: Request) {
	const url = new URL(req.url)

	switch (url.pathname) {
		case "/departures":
			return handleDepartures(req)
		case "/station":
			return handleStation(req)
		default:
			return new Response("404!")
	}
}

const userAgent = "j.anstipp@me.com"
const client = createClient(dbProfile, userAgent)

async function handleDepartures(req: Request) {
	const json: DeparturesRequest = await req.json()
	console.log("POST /departures :", json)
	const departures = await client.departures(json.station, json.options)
	return new Response(JSON.stringify(departures))
}

async function handleStation(req: Request) {
	const json: SearchStationRequest = await req.json()
	console.log("POST /station :", json)
	const { query, results, fuzzy, completion } = json
	const stationList = autocomplete(query, results, fuzzy, completion)
		.sort((a, b) => b.score - a.score)
		.map((option) => stations.find((station) => station.id === option.id))
		.filter((station) => station !== undefined)

	return new Response(JSON.stringify(stationList))
}
