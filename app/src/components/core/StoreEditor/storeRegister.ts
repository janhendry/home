import { ReadableAtom, WritableAtom } from "nanostores"
import { $userSettings } from "../../../stores/userSettings"
import { $departure } from "../../../stores/table"

type Store = WritableAtom | ReadableAtom

export const storeRegister: Record<string, Store> = {
	departure: $departure,
	userSettings: $userSettings,
}
