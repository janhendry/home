import { Departures, HafasClient } from "hafas-client"

export type DeparturesResponse = Departures

export type DeparturesRequest = {
	station: Parameters<HafasClient["departures"]>[0]
	options?: Parameters<HafasClient["departures"]>[1]
}

export type SearchStationRequest = {
	query: string
	/** @default 3 */
	results?: number
	/**
	 * If you set `fuzzy` to `true`, words with a
	 * [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) `<= 3` will be taken into account.
	 * This is a lot slower though.
	 *
	 * @default false
	 */
	fuzzy?: boolean
	/**
	 * Setting `completion` to `false` speeds things up.
	 *
	 * @default true
	 */
	completion?: boolean
}
