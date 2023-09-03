import { ChangeEvent, useEffect, useRef, useState } from "react"
import styles from "./SearchField.module.scss"
import { client } from "../../../client/client"
import { SearchLineItem } from "./SearchLineItem"
import { TabStation } from "../../tram/TramTable"

export type SearchFieldProps = {
	onSelect?: (station: TabStation) => void
}

export function SearchField({ onSelect }: SearchFieldProps) {
	const {
		inputRef,
		menuRef,
		indexFocus,
		station,
		stationList,
		handleOnBlur,
		handleInput,
		handleKeyDown,
		handleSelect,
	} = useSearchField(onSelect)

	return (
		<div ref={menuRef} onKeyDown={handleKeyDown} className={styles.SearchField}>
			<form className={styles.inputField}>
				{/* <IonIcon icon="search" className={styles.searchIcon} /> */}
				<input
					type="text"
					ref={inputRef}
					value={station}
					placeholder="Search module"
					onChange={handleInput}
					onBlur={handleOnBlur}
				/>
			</form>
			<div className={styles.moduleLineItemList}>
				{stationList.map((moduleSchema, index) => (
					<SearchLineItem
						key={moduleSchema.id}
						station={moduleSchema}
						blur={indexFocus === index}
						onClick={handleSelect(index)}
					/>
				))}
			</div>
		</div>
	)
}

function useSearchField(onSelect: ((station: TabStation) => void) | undefined) {
	const inputRef = useRef<HTMLInputElement>(null)
	const menuRef = useClickOutside<HTMLDivElement>(close)
	const [indexFocus, setIndexFocus] = useState(0)
	const { station, stationList, handleChange } = useSearchStation()

	const moveIndex = (delta: number) => {
		setIndexFocus((prevState) => {
			const newIndex = prevState + delta
			if (newIndex < 0) {
				return stationList.length - 1
			} else if (newIndex >= stationList.length) {
				return 0
			} else {
				return newIndex
			}
		})
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			moveIndex(e.key === "ArrowUp" ? -1 : 1)
		}
		if (e.key === "Enter") {
			onSelect?.(stationList[indexFocus])
		}
		if (e.key === "Escape") {
			close?.()
		}
	}

	const handleSelect = (index: number) => () => {
		onSelect?.(stationList[index])
	}

	const handleOnBlur = () => {
		inputRef.current?.blur()
	}

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		setIndexFocus(0)
		handleChange(e.target.value)
	}

	useEffect(() => {
		inputRef.current?.focus()
	}, [])

	return {
		menuRef,
		inputRef,
		indexFocus,
		station,
		stationList,
		handleInput,
		handleOnBlur,
		handleKeyDown,
		handleSelect,
	}
}

function useSearchStation() {
	const [station, setStation] = useState("")
	const [stationList, setStationList] = useState<TabStation[]>([])

	const updateStationList = async () => {
		setStationList(
			await client.fetchAutocomplete({
				query: station,
				results: 100,
				fuzzy: true,
			}),
		)
	}

	const handleChange = (station: string) => {
		setStation(station)
	}

	useEffect(() => {
		updateStationList()
	}, [station])

	return {
		station,
		stationList,
		handleChange,
	}
}

export function useClickOutside<T>(handler?: (event?: Event) => void): React.RefObject<T> {
	const ref = useRef<T>(null)

	useEffect(() => {
		const listener = (event: Event) => {
			const current = ref.current as HTMLElement | null

			if (!current || current.contains(event.target as Node)) {
				return
			}

			handler?.(event)
		}

		document.addEventListener("pointerdown", listener)
		document.addEventListener("touchstart", listener)

		return () => {
			document.removeEventListener("pointerdown", listener)
			document.removeEventListener("touchstart", listener)
		}
	}, [ref, handler])

	return ref
}
