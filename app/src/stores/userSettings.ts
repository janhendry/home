import { persistentAtom } from "@nanostores/persistent"

export type UserSettings = {
	themeMode: "light" | "dark"
}

const initialUserSettings: UserSettings = {
	themeMode: "dark",
}

export const $userSettings = persistentAtom<UserSettings>(
	"docker-compose-configurator__userSettings",
	initialUserSettings,
	{
		encode: JSON.stringify,
		decode: JSON.parse,
	},
)
