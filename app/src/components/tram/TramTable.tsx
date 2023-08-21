import { fetchDeparture } from "../../api/fetchDeparture"
import { Button } from "@mui/base"
import { setDeparture } from "../../stores/table"

export function TramTable() {
	const id = "775985"

	const fetchData = async () => {
		const departures = await fetchDeparture(id)
		setDeparture(id, departures)
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
