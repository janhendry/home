import { Autocomplete, TextField } from "@mui/material"
import { useStore } from "@nanostores/react"
import { useMemo, useState } from "react"

import { storeRegister } from "./storeRegister"
import CodeEditor from "../CodeEditor"

export default function StoreEditor() {
	const { code, storeKey, storeKeys, setStoreKey, handleSave } = useStoreEditor()

	return (
		<>
			<Autocomplete
				size="small"
				sx={{ padding: "10px", backgroundColor: "var(--monaco-bg)" }}
				disablePortal
				options={storeKeys}
				renderInput={(params) => <TextField label={"Store"} {...params} fullWidth={true} />}
				value={storeKey}
				onChange={(_, newValue) => {
					if (newValue) {
						setStoreKey(newValue)
					}
				}}
			/>
			<CodeEditor code={JSON.stringify(code, null, 2)} onSave={handleSave} />
		</>
	)
}

function useStoreEditor() {
	const [storeKey, setStoreKey] = useState(Object.keys(storeRegister)[0])
	const store = useMemo(() => storeRegister[storeKey], [storeKey])
	const code = useStore(store)

	const readOnly = !("set" in store)

	const handleSave = (code: string) => {
		if (!readOnly) {
			store.set(JSON.parse(code))
		}
	}

	return {
		code,
		storeKey,
		handleSave,
		setStoreKey,
		storeKeys: Object.keys(storeRegister),
	}
}
