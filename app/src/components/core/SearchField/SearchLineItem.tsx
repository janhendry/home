import { CSSProperties, useEffect, useRef } from "react"
import { Station } from "hafas-client"
import styles from "./SearchLineItem.module.scss"

export type SearchLineItemProps = {
	blur: boolean
	station: Station
	onClick: () => void
}

export function SearchLineItem({ blur, station, onClick }: SearchLineItemProps) {
	const ref = useModuleLineItem(blur)
	const className = styles.SearchLineItem
	const style: CSSProperties | undefined = blur ? { backgroundColor: "var(--paper-selected" } : undefined

	return (
		<div ref={ref} style={style} onClick={onClick} className={className}>
			<div className={styles.description}>
				<h1>{station.name}</h1>
			</div>
		</div>
	)
}

function useModuleLineItem(blur: boolean) {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (blur) {
			ref.current?.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			})
		}
	}, [blur])

	return ref
}
