import { ReadableAtom, WritableAtom } from "nanostores"
import { $userSettings } from "../../../stores/userSettings"

type Store = WritableAtom | ReadableAtom

export const storeRegister: Record<string, Store> = {
	userSettings: $userSettings,
}
