import { Station } from "hafas-client"
import { DeparturesRequest, DeparturesResponse, SearchStationRequest } from "./types"

const hostname = import.meta.env.VITE_API_HOSTNAME
const port = import.meta.env.VITE_API_PORT
const url = `http://${hostname}:${port}`

function fetchDeparture(request: DeparturesRequest): Promise<DeparturesResponse> {
	const body = JSON.stringify(request)
	console.log("fetchDeparture", body)
	return fetch(`${url}/departures`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body,
	}).then((response) => response.json())
}

function fetchAutocomplete(request: SearchStationRequest): Promise<Station[]> {
	const body = JSON.stringify(request)
	console.log("station", body)
	return fetch(`${url}/station`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body,
	}).then((response) => response.json())
}

export const client = {
	fetchDeparture,
	fetchAutocomplete,
}
