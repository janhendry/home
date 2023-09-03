import { Button } from "@mui/base"
import { useStore } from "@nanostores/react"
import { client } from "../../client/client"
import { DeparturesRequest, DeparturesResponse } from "../../client/types"
import { $departure, setDeparture } from "../../stores/table"
import styles from "./TramTable.module.scss"
import { SchedulesList } from "../Schedules/SchedulesList"
import { useEffect, useState } from "react"
import { Dialog } from "@mui/material"
import { DepartmentOptions } from "../Schedules/DepartmentOptions"

export function TramTable() {
	const departure = useStore($departure)
	const { home } = departure
	const [station, setStation] = useState("")
	const [open, setOpen] = useState(false)

	const fetchData = (newStation?: string) => async () => {
		if (newStation !== undefined) {
			setStation(newStation)
		}
		const request: DeparturesRequest = {
			station: newStation || station,
			options: {
				duration: 60 * 10,
			},
		}

		const departures = await client.fetchDeparture(request)
		setDeparture("home", filterDepartures(departures))
	}

	const keys = ["line", "direction", "when", "delay", "platform", "alternatives"]

	useEffect(() => {
		const id = setInterval(() => {
			fetchData()
		}, 1000 * 10)
		return () => clearInterval(id)
	}, [])

	return (
		<div className={styles.TramTable}>
			<Button onClick={fetchData("776237")}>Klinikum</Button>
			<Button onClick={fetchData("599309")}>Lise Meitner</Button>
			<Button onClick={fetchData("768277")}>Rennplatz</Button>
			<Button onClick={fetchData("768373")}>Hafer</Button>
			<Button onClick={testDeparture}>Test</Button>
			<Button onClick={() => setOpen(true)}>Options</Button>
			{home === undefined ? null : <SchedulesList items={home} />}
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DepartmentOptions />
			</Dialog>
		</div>
	)
}

function filterDepartures(departures: DeparturesResponse) {
	const filteredDirection = ["Bf Mahndorf", "Tenever"]
	return departures.departures.filter((item) => (item.direction ? !filteredDirection.includes(item.direction) : false))
}

// 2023-08-22T05:46:00+02:00 to HH:MM
function formatTime(time: string | undefined) {
	if (!time) return ""
	const date = new Date(time)
	const hours = date.getHours()
	const minutes = date.getMinutes()
	return `${hours}:${minutes}`
}

async function testDeparture() {
	const stations = await client.fetchDeparture({ station: "768373" })

	console.log(stations.departures)
}

// function OldTable(){

// 	return (
// 		<div className={styles.table}>
// 				<table>
// 					<thead>
// 						<tr>
// 							<th key={"line"}>{"line"}</th>
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{home === undefined
// 							? null
// 							: home.map((item, index) => (
// 									<tr key={index}>
// 										<td key={"line"}>{item.line?.name}</td>
// 										<td key={"direction"}>{item.direction}</td>
// 										<td key={"when"}>{formatTime(item.when)}</td>
// 									</tr>
// 							  ))}
// 					</tbody>
// 				</table>
// 			</div>
// 	)
// }
