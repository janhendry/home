#!/usr/bin/env node
import { createClient as createHafas } from "hafas-client"
import { createHafasRestApi } from "hafas-rest-api"
import { createClient } from "hafas-client"
import { profile as dbProfile } from "hafas-client/p/db/index.js"

console.log("Start hafas-rest-api")
const userAgent = "link-to-your-project-or-email"

export const client = createClient(dbProfile, userAgent)

const docsAsMarkdown = "# Hafas Rest Api"

const config = {
	name: "hafas-rest-api",
	hostname: "localhost",
	version: "1.0.0",
	aboutPage: true,
	logging: true,
	description: "A REST API for HAFAS public transport endpoints.",
	docsLink: "Link to documentation",
	docsAsMarkdown,
}

const hafas = createHafas(dbProfile, "j.anstipp@me.com")
const api = await createHafasRestApi(hafas, config)
const port = 3001
const url = `http://${config.hostname}:${port}`


api.get("/test1", async (req, res, next) => {
	// const departures = await client.departures("8011160", { duration: 10 })
	res.json(departures)
})

api.listen(port, (err) => {
	console.log(`Hafas Rest Api is listening on ${url}`)
	if (err) console.error(err)
})
