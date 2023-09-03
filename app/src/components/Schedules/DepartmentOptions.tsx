import { Autocomplete, TextField } from "@mui/material"
import { HafasClient, Station } from "hafas-client"
import { useEffect, useState } from "react"
import { client } from "../../client/client"

export type DepartmentOptionsProps = {
	station: Parameters<HafasClient["departures"]>[0]
	options: Parameters<HafasClient["departures"]>[1]
	onChange: (station: string, options: Parameters<HafasClient["departures"]>[1]) => void
}

export function DepartmentOptions() {
	const { station, handelChange, stationOptions } = useDepartmentOptions()

	return (
		<div>
			<Autocomplete
				value={station.name || ""}
				onChange={(_, value) => {
					console.log("onChange", value)
					if (value) {
						handelChange(value)
					}
				}}
				options={stationOptions.map((station) => station.name || "")}
				sx={{ width: 300 }}
				renderInput={(params) => <TextField {...params} label="Movie" />}
			/>
		</div>
	)
}

function useDepartmentOptions() {
	const [station, setStation] = useState<Station>({
		type: "station",
		name: "",
	})
	const [options, setOptions] = useState<Parameters<HafasClient["departures"]>[1]>({})
	const [stationOptions, setStationOptions] = useState<Station[]>([])

	const updateOptions = async () => {
		const stations = await client.fetchAutocomplete(station.name || "")
		setStationOptions(stations)
	}

	const handelChange = (station: string) => {
		console.log("handelChaneg", station)
		setStation({ type: "station", name: station })
	}

	useEffect(() => {
		updateOptions()
	}, [station])

	return {
		station,
		options,
		stationOptions,
		handelChange,
	}
}
