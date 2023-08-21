import { Departures, DeparturesArrivalsOptions } from "hafas-client"
import { toQueryString } from "./toQueryString"

export const host = `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`

export async function fetchDeparture(id: string, options?: DeparturesArrivalsOptions): Promise<Departures> {
	const queryString = toQueryString(options)

	const response = await fetch(`${host}/stops/${id}/departures${queryString}`)
	if (!response.ok) {
		throw new Error(response.statusText)
	}
	return await response.json()
}
