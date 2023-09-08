import { Button } from "@mui/base"
import { Dialog, Tabs } from "@mui/material"
import Tab from "@mui/material/Tab"
import { useStore } from "@nanostores/react"
import { Station } from "hafas-client"
import { useEffect, useState } from "react"
import { client } from "../../client/client"
import { DeparturesRequest, DeparturesResponse } from "../../client/types"
import { $departure, setDeparture } from "../../stores/table"
import { SchedulesList } from "../Schedules/SchedulesList"
import { SearchField } from "../core/SearchField/SearchField"
import styles from "./TramTable.module.scss"

export type TabStation = {
	id: string
	name: string
} & Station

type AppState = {
	station: TabStation[]
	selectedStation: TabStation
}

export function TramTable() {
	const departure = useStore($departure)
	const { home } = departure
	const [appState, setAppState] = useState<AppState>({
		station: [
			{
				type: "station",
				id: "768373",
				name: "Haferwende",
			},
			{
				type: "station",
				id: "768277",
				name: "Rennplatz",
			},
			{
				type: "station",
				id: "599309",
				name: "Lise-Meitner-Straße",
			},
			{
				type: "station",
				id: "776237",
				name: "Klinikum Bremen-Ost",
			},
		],
		selectedStation: {
			type: "station",
			id: "768373",
			name: "Haferwende",
		},
	})

	const [open, setOpen] = useState(false)

	const fetchData = async () => {
		const request: DeparturesRequest = {
			station: appState.selectedStation.id,
			options: {
				duration: 60 * 10,
			},
		}

		const departures = await client.fetchDeparture(request)
		setDeparture("home", filterDepartures(departures))
	}

	const handleChangeTab = (_: any, newValue: TabStation) => {
		setAppState({
			...appState,
			selectedStation: newValue,
		})
	}

	const handleSelect = (station: TabStation) => {
		setAppState({
			...appState,
			station: [
				...appState.station,
				{
					...station,
					id: station.id,
					name: station.name,
				},
			],
		})
		setOpen(false)
	}

	useEffect(() => {
		fetchData()
	}, [appState.selectedStation])

	return (
		<div className={styles.TramTable}>
			<Tabs value={appState.selectedStation} onChange={handleChangeTab}>
				{appState.station.map((station) => (
					<Tab key={station.id} label={station.name} value={station} />
				))}
			</Tabs>
			<Button onClick={() => setOpen(true)}>Options</Button>
			{home === undefined ? null : <SchedulesList items={home} />}
			<Dialog open={open} onClose={() => setOpen(false)}>
				<SearchField onSelect={handleSelect} />
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
