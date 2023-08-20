import { useEffect } from "react"
import { Api } from "../api/Api"
import { Departure, fetchDeparture } from "../api/fetchDeparture"

const config = {
	baseUrl: "http://localhost:3001",
}

const api = new Api(config)

export function useDepartures(departure: Departure) {
	useEffect(() => {
		console.log("useDepartures", departure)
	}, [departure])

	return { isLoading: false, error: null, data: [] }
}
