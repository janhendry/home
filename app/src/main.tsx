import ReactDOM from "react-dom/client"
import App from "./App"

import "./index.scss"
import "allotment/dist/style.css"
import "./components/core/CodeEditor/monaco"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />)
