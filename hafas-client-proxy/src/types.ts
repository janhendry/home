import { Departures, HafasClient } from "hafas-client"

export type DeparturesRequest = {
	station: Parameters<HafasClient["departures"]>[0]
	options?: Parameters<HafasClient["departures"]>[1]
}

export type DeparturesResponse = Departures

export type A = Parameters<HafasClient["departures"]>[0]
