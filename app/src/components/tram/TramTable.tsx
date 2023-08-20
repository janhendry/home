import { useState } from "react"
import { useDepartures } from "../../hooks/useDepatures"
import { DepartureStation } from "../../api/fetchDeparture"

export function TramTable() {
	const [station] = useState<DepartureStation>({
		type: "location",
		id: "775985",
		latitude: 53.071396,
		longitude: 8.949382,
	})

	const { data, error, isLoading } = useDepartures(station)

	return (
		<div>
			{isLoading && <div>Loading...</div>}
			{error && <div>Error: {JSON.stringify(error as any, null, 2)}</div>}
			{/* {data?.departures.map((departure) => (
				<div key={departure.tripId}>{JSON.stringify(departure, null, 2)}</div>
			))} */}
		</div>
	)
}
