import { useState } from "react"

import { Departure, fetchDeparture } from "../../api/fetchDeparture"
import { Button } from "@mui/base"
import { setDeparture } from "../../stores/table"

export function TramTable() {
	const [station] = useState<Departure>({
		id: "775985",
		duration: 60,
	})

	const fetchData = async () => {
		const departure = await fetchDeparture(station)
		setDeparture(station.id, departure)
	}

	return (
		<div>
			<Button onClick={fetchData}>Test</Button>
			{/* {data?.departures.map((departure) => (
				<div key={departure.tripId}>{JSON.stringify(departure, null, 2)}</div>
			))} */}
		</div>
	)
}
