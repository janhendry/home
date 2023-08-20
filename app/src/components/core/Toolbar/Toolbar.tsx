import styles from "./Toolbar.module.scss"

type ToolbarProps = {
	children?: React.ReactNode
}

export function Toolbar({ children }: ToolbarProps) {
	return <div className={styles.Toolbar}>{children}</div>
}
