import { Alternative, Line } from "hafas-client"
import styles from "./SchedulesLineItem.module.scss"
import { ProductsIcon } from "./TramIcon"
import classNames from "classnames"

type SchedulesLineItemProps = {
	alternative: Alternative
}

export function SchedulesLineItem({ alternative }: SchedulesLineItemProps) {
	const { minutes, delay, lineNr } = useSchedulesLineItem(alternative)

	return (
		<>
			<div className={styles.lineNr}>{lineNr}</div>
			<ProductsIcon products={alternative.line?.product} />
			<div className={styles.minutes}>
				<div>{minutes}</div>
				<div
					className={classNames({
						[styles.delay]: delay > 0,
						[styles.onTime]: delay <= 0,
					})}
				>
					{`\`${delay}\``}
				</div>
			</div>
			<div className={styles.direction}>{alternative.direction}</div>
		</>
	)
}

export function useSchedulesLineItem(alternative: Alternative) {
	const now = new Date()
	const when = alternative.when ? new Date(alternative.when) : null
	const delay = alternative.delay ? alternative.delay / 60 : 0

	const minutes = when ? getTimeDiff(when, now) : null
	const lineNr = getLineNr(alternative.line)
	return {
		minutes,
		delay,
		lineNr,
	}
}

// Minutes to HH:MM
function getTimeDiff(date1: Date, date2: Date): number {
	const diff = date1.getTime() - date2.getTime()
	return Math.round(diff / 60000)
}

// Line number
// Fileter name with regex of productName
function getLineNr(line?: Line) {
	if (!line) return null
	const productName = line.productName || ""
	return line.name?.replace(new RegExp(productName, "gi"), "").trim()
}
