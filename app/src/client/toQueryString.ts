export type QueryParamsType = Record<string | number, any>

function encodeQueryParam(key: string, value: any) {
	const encodedKey = encodeURIComponent(key)
	return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`
}

function addQueryParam(query: QueryParamsType, key: string) {
	return encodeQueryParam(key, query[key])
}

function addArrayQueryParam(query: QueryParamsType, key: string) {
	const value = query[key]
	return value.map((v: any) => encodeQueryParam(key, v)).join("&")
}

export function toQueryString(rawQuery?: QueryParamsType): string {
	const query = rawQuery || {}
	const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key])
	const querys = keys
		.map((key) => (Array.isArray(query[key]) ? addArrayQueryParam(query, key) : addQueryParam(query, key)))
		.join("&")

	return querys.trim() === "" ? "" : `?${querys}`
}
