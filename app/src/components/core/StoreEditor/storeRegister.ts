import { ReadableAtom, WritableAtom } from "nanostores"
import { $departure } from "../../../stores/table"
import { $userSettings } from "../../../stores/userSettings"

type Store = WritableAtom | ReadableAtom

export const storeRegister: Record<string, Store> = {
	departure: $departure,
	userSettings: $userSettings,
}
