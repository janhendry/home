import { Departures } from "hafas-client"
import { map } from "nanostores"

export const $departure = map<Record<string, Departures>>({})

export function setDeparture(id: string, departure: Departures) {
	$departure.set({ ...$departure.get(), [id]: departure })
}
