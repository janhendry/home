import { DeparturesRequest, DeparturesResponse, SearchStationRequest } from "./types"
import { TabStation } from "../components/tram/TramTable"

const hostname = import.meta.env.VITE_API_HOSTNAME
const port = import.meta.env.VITE_API_PORT
const url = `http://${hostname}:${port}`

function fetchDeparture(request: DeparturesRequest): Promise<DeparturesResponse> {
	const body = JSON.stringify(request)
	return fetch(`${url}/departures`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body,
	}).then((response) => response.json())
}

function fetchAutocomplete(request: SearchStationRequest): Promise<TabStation[]> {
	const body = JSON.stringify(request)
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
