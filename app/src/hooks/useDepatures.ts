import { useQuery } from "@tanstack/react-query"
import { DepartureStation, fetchDeparture } from "../api/fetchDeparture"
import { useEffect, useState } from "react"

export function useDepartures(station: DepartureStation) {
	useEffect(() => {
		console.log("useDepartures", station)
		fetchDeparture(station)
	}, [station])

	return { isLoading: false, error: null, data: [] }
}
