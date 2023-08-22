import { Button } from "@mui/base"
import { $departure, setDeparture } from "../../stores/table"
import { client } from "../../api/client"
import { useStore } from "@nanostores/react"
import { Alternative } from "hafas-client"

export function TramTable() {
	const departure = useStore($departure)
	const { home } = departure
	const fetchData = async () => {
		const departures = await client.fetchHomeStart()
		setDeparture("home", filterDepartures(departures))
	}

	const keys = ["line", "direction", "when", "delay", "platform", "alternatives"]

	return (
		<div>
			<Button onClick={fetchData}>Test</Button>
			<div>
				<table>
					<thead>
						<tr>
							<th key={"line"}>{"line"}</th>
						</tr>
					</thead>
					<tbody>
						{home === undefined
							? null
							: home.map((item, index) => (
									<tr key={index}>
										<td key={"line"}>{item.line?.name}</td>
										<td key={"direction"}>{item.direction}</td>
										<td key={"when"}>{formatTime(item.when)}</td>
									</tr>
							  ))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

function filterDepartures(departures: readonly Alternative[]) {
	const filteredDirection = ["Bf Mahndorf"]
	return departures.filter((item) => (item.direction ? !filteredDirection.includes(item.direction) : false))
}

// 2023-08-22T05:46:00+02:00 to HH:MM
function formatTime(time: string | undefined) {
	if (!time) return ""
	const date = new Date(time)
	const hours = date.getHours()
	const minutes = date.getMinutes()
	return `${hours}:${minutes}`
}
