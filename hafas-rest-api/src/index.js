#!/usr/bin/env node
import { createClient as createHafas } from "hafas-client"
import { profile as dbProfile } from "hafas-client/p/db/index.js"
import { createHafasRestApi } from "hafas-rest-api"

console.log("Start hafas-rest-api")

const config = {
	name: "hafas-rest-api",
	hostname: "localhost",
	version: "1.0.0",
	aboutPage: false,
}

const hafas = createHafas(dbProfile, "my-hafas-rest-api")
const api = await createHafasRestApi(hafas, config)
const port = 3001
const url = `http://${config.hostname}:${port}`

console.log(`Hafas Rest Api is listening on ${url}`)
api.listen(port, (err) => {
	if (err) console.error(err)
})
