import { toQueryString } from "./toQueryString"

export type Departure = {
	id: string
	/**
	 * Date & time to get departures for. – Default: *now*
	 * @format date-time
	 */
	when?: string
	/** Filter departures by direction. */
	direction?: string
	/**
	 * Show departures for how many minutes?
	 * @default 10
	 */
	duration?: number
	/** Max. number of departures. – Default: *whatever HAFAS wants */
	results?: number
	/**
	 * Parse & return lines of each stop/station?
	 * @default false
	 */
	linesOfStops?: boolean
	/**
	 * Parse & return hints & warnings?
	 * @default true
	 */
	remarks?: boolean
	/**
	 * Language of the results.
	 * @default "en"
	 */
	language?: string
}

export async function fetchDeparture(departure: Departure) {
	const { id, ...query } = departure
	const queryString = toQueryString(query)
	const response = await fetch(`http://localhost:3001/stops/${id}/departures${queryString}`)
	if (!response.ok) {
		throw new Error(response.statusText)
	}
	return await response.json()
}
