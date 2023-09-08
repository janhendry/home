import { ThemeProvider } from "@mui/material"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Allotment } from "allotment"
import { useTheme } from "../hooks/useTheme"
import styles from "./App.module.scss"
import StoreEditor from "./core/StoreEditor"
import { TramTable } from "./tram/TramTable"

const queryClient = new QueryClient()

const showStoreEditor = import.meta.env.VITE_SHOW_STORE_EDITOR === "true"

function App() {
	const theme = useTheme()
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<div className={styles.App}>
					<Allotment>
						{showStoreEditor ? (
							<Allotment.Pane>
								<StoreEditor />
							</Allotment.Pane>
						) : null}
						<Allotment.Pane>
							<TramTable />
						</Allotment.Pane>
					</Allotment>
				</div>
			</ThemeProvider>
		</QueryClientProvider>
	)
}

export default App
