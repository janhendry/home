import { HafasClient } from "hafas-client"

export type DepartureStation = Parameters<HafasClient["departures"]>[0]

export async function fetchDeparture(station: DepartureStation) {
	const query =
		"https://v6.db.transport.rest/locations?query=Bremen&fuzzy=true&results=10&stops=true&addresses=true&poi=true&linesOfStops=false&language=en"
	const departures = fetch(query)
	console.log(departures)
	return departures
}
