import { Alternative, Departures } from "hafas-client"

async function fetchHomeStart(): Promise<readonly Alternative[]> {
	const response = await fetch("http://localhost:3000/home/start")
	const json: Departures = await response.json()
	return json.departures
}

export const client = {
	fetchHomeStart,
}
