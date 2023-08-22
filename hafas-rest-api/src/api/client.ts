import { createClient } from "hafas-client"
import { profile as dbProfile } from "hafas-client/p/db/index.js"

const userAgent = "j.anstipp@me.com"

export const client = createClient(dbProfile, userAgent)

