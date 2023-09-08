import { useStore } from "@nanostores/react"
import { editor } from "monaco-editor"
import { $userSettings } from "../../../stores/userSettings"
import styles from "./CodeEditor.module.scss"
import { DiffEditor, monaco } from "./monaco"

export interface CodeDiffEditorProps {
	original: string
	modified: string
	onSave?: (code: string) => void
	readOnly?: boolean
	options?: editor.IStandaloneEditorConstructionOptions
}

export function CodeDiffEditor({ onSave, original, modified, readOnly = false, options }: CodeDiffEditorProps) {
	const onMount = (editor: editor.IStandaloneDiffEditor) => {
		editor.addAction({
			id: "save",
			label: "Save",
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
			run: () => onSave?.(editor.getModifiedEditor().getValue()),
		})
	}

	const { themeMode } = useStore($userSettings)

	return (
		<div className={styles.CodeEditor}>
			<DiffEditor
				options={{
					inDiffEditor: false,
					readOnly,
					wordWrap: "off",
					minimap: {
						enabled: false,
					},
					...options,
				}}
				onMount={onMount}
				language="json"
				theme={themeMode === "dark" ? "vs-dark" : "vs-light"}
				original={original}
				modified={modified}
			/>
		</div>
	)
}
