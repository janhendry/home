import { createTheme } from "@mui/material"
import { useStore } from "@nanostores/react"
import { useEffect, useMemo } from "react"
import { $userSettings } from "../stores/userSettings"

export function useTheme() {
	const { themeMode } = useStore($userSettings)
	const theme = useMemo(() => getMuiTheme(themeMode), [themeMode])

	useEffect(() => {
		document.querySelector("html")?.setAttribute("data-theme", themeMode)
	}, [themeMode])

	return theme
}

export function getMuiTheme(mode: "dark" | "light") {
	return createTheme({
		palette: {
			mode,
		},
	})
}
