import { HafasClient, Station } from "hafas-client"
import { SearchField } from "../core/SearchField/SearchField"

export type DepartmentOptionsProps = {
	station: Parameters<HafasClient["departures"]>[0]
	options: Parameters<HafasClient["departures"]>[1]
	onChange: (station: string, options: Parameters<HafasClient["departures"]>[1]) => void
}

export function DepartmentOptions() {
	const handleSelect = (station: Station) => {
		console.log(station)
	}

	return (
		<div>
			<SearchField onSelect={handleSelect} />
		</div>
	)
}
