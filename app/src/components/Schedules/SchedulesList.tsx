import { Alternative } from "hafas-client"
import { SchedulesLineItem } from "./SchedulesLineItem"
import styles from "./SchedulesList.module.scss"
export type SchedulesListProps = {
	items: readonly Alternative[]
}

export function SchedulesList({ items }: SchedulesListProps) {
	return (
		<div className={styles.SchedulesList}>
			{items.map((item, index) => (
				<SchedulesLineItem key={index} alternative={item} />
			))}
		</div>
	)
}
