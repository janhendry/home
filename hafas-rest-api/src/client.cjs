const createClient = require('hafas-client')
const dbProfile = require('hafas-client/p/db')

// Adapt this to your project! createClient() won't work with this string.
const userAgent = 'link-to-your-project-or-email'

// create a client with the Deutsche Bahn profile
const client = createClient(dbProfile, userAgent)
async function departures(station, opt) {
    const d = await client.departures("8011160", { duration: 10, linesOfStops: true })
	console.log(d)
}

departures()
