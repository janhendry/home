import { ThemeProvider } from "@mui/material"
import { useTheme } from "./hooks/useTheme"

import styles from "./App.module.scss"
import StoreEditor from "./components/core/StoreEditor"
import { Allotment } from "allotment"
import { TramTable } from "./components/tram/TramTable"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

function App() {
	const theme = useTheme()
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<div className={styles.App}>
					<Allotment>
						<Allotment.Pane>
							<StoreEditor />
						</Allotment.Pane>
						<Allotment.Pane preferredSize={300}>
							<TramTable />
						</Allotment.Pane>
					</Allotment>
				</div>
			</ThemeProvider>
		</QueryClientProvider>
	)
}

export default App
