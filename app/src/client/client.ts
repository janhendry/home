import { Station } from "hafas-client"
import { DeparturesRequest, DeparturesResponse } from "./types"

const hostname = import.meta.env.VITE_API_HOSTNAME
const port = import.meta.env.VITE_API_PORT
const url = `http://${hostname}:${port}`

function fetchDeparture(params: DeparturesRequest): Promise<DeparturesResponse> {
	return fetch(`${url}/departures`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(params),
	}).then((response) => response.json())
}

function fetchAutocomplete(station: string): Promise<Station[]> {
	console.log("fetchAutocomplete", station)

	return fetch(`${url}/autocomplete?station=${station}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		// body: JSON.stringify(params),
	}).then((response) => response.json())
}

export const client = {
	fetchDeparture,
	fetchAutocomplete,
}
