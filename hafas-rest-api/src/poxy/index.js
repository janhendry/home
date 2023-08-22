#!/usr/bin/env node
import { createClient } from "hafas-client"
import { profile as dbProfile } from "hafas-client/p/db/index.js"
import { createHafasRestApi } from "hafas-rest-api"
import createHealthCheck from "hafas-client-health-check"

async function init() {
	const config = {
		version: "1.0.0",
		name: "hafas-rest-api",
		hostname: process.env.HOST || "localhost",
		aboutPage: true,
		logging: true,
		description: "A REST API for HAFAS public transport endpoints.",
		docsLink: "Link to documentation",
		docsAsMarkdown: "# Hafas Rest Api",
		core: false,
	}

	const userAgents = process.env.USER_AGENTS || "hafas-rest-api"
	const client = createClient(dbProfile, userAgents)
	const api = await createHafasRestApi(client, config)
	const port = process.env.VITE_PORT || 3000
	const url = `http://${config.hostname}:${port}`

	const berlinHbf = "8011160"
	const checkIfHealthy = createHealthCheck(client, berlinHbf)

	checkIfHealthy()
		.then((isHealthy) => {
			if (isHealthy) console.error("hafas-client instance is healthy.")
			else console.error("hafas-client instance is not healthy!")
		})
		.catch((err) => {
			console.error(err)
			process.exitCode = 1
		})

	api.listen(port, (err) => {
		console.info(`Hafas Rest Api is listening on ${url}`)
		if (err) console.error(err)
	})

	api.get("/health", (req, res) => {
		client
			.locations("Berlin")
			.then(() => res.json({ ok: true }))
			.catch((e) => res.status(500).json(e))
	})
}

init()
