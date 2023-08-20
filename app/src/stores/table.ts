import { map } from "nanostores"

export const $departure = map<Record<string, any[]>>({})

export function setDeparture(id: string, departure: any[]) {
	$departure.set({ ...$departure.get(), [id]: departure })
}
