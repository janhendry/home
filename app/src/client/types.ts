import { Departures, HafasClient } from "hafas-client"

export type DeparturesResponse = Departures

export type DeparturesRequest = {
	station: Parameters<HafasClient["departures"]>[0]
	options?: Parameters<HafasClient["departures"]>[1]
}
