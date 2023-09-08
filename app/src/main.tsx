import ReactDOM from "react-dom/client"
import App from "./components/App"

import "allotment/dist/style.css"
import "./components/core/CodeEditor/monaco"
import "./index.scss"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />)
