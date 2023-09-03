import { Alternative } from "hafas-client"
import { map } from "nanostores"

export const $departure = map<Record<string, readonly Alternative[]>>({})

export function setDeparture(id: string, departure: readonly Alternative[]) {
	$departure.set({ ...$departure.get(), [id]: departure })
}

$departure.get().departure
