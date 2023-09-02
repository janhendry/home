import { Monaco } from "@monaco-editor/react"
import { useStore } from "@nanostores/react"
import classNames from "classnames"
import { editor } from "monaco-editor"
import { $userSettings } from "../../../stores/userSettings"
import styles from "./CodeEditor.module.scss"
import { MonacoEditor } from "./monaco"

export type Language =
	| "json"
	| "typescript"
	| "javascript"
	| "dockerfile"
	| "plaintext"
	| "markdown"
	| "html"
	| "css"
	| "xml"
	| "yaml"
	| "sql"
	| "yml"
	| "shell"
	| "sh"

export interface CodeEditorProps {
	className?: string
	code: string
	language?: Language
	onSave?: (code: string) => void
	readOnly?: boolean
	path?: string
	options?: editor.IStandaloneEditorConstructionOptions
}

export function CodeEditor({
	className,
	onSave,
	code,
	path,
	readOnly = false,
	options,
	language = "json",
}: CodeEditorProps) {
	const { themeMode } = useStore($userSettings)

	const onMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
		monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
			enableSchemaRequest: true,
			validate: true,
			schemas: [
				// TODO Use schema from configSchema.json
				// {
				// 	uri: "resources/schema/configuration.json",
				// 	fileMatch: ["configuration.json"],
				// 	schema: configSchema,
				// },
			],
		})

		editor.addAction({
			id: "save",
			label: "Save",
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
			run: () => onSave?.(editor.getValue()),
		})
	}

	return (
		<div className={classNames(className, styles.CodeEditor)}>
			<MonacoEditor
				options={{
					readOnly,
					minimap: {
						enabled: false,
					},
					...options,
				}}
				path={path}
				onMount={onMount}
				language={language}
				theme={themeMode === "dark" ? "vs-dark" : "vs-light"}
				value={code}
			/>
		</div>
	)
}
