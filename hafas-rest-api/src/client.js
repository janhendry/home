#!/usr/bin/env node
import {createClient} from 'hafas-client'
import {profile as dbProfile} from 'hafas-client/p/db/index.js'

// Adapt this to your project! createClient() won't work with this string.
const userAgent = 'j.anstipp@me.com'

// create a client with the Deutsche Bahn profile
const client = createClient(dbProfile, userAgent)

async function departures(station, opt) {
    const d = await client.departures("8011160", { duration: 10, linesOfStops: true })
	console.log(d)
}

departures()
