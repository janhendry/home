import { FaBus, FaTrain, FaSubway, FaTaxi, FaShip } from "react-icons/fa"
import { MdTram } from "react-icons/md"

type ProductsIconProps = {
	products?: string
}

export function ProductsIcon({ products }: ProductsIconProps) {
	switch (products) {
		case "nationalExpress":
		case "national":
		case "regionalExpress":
		case "regional":
			return <FaTrain />
		case "bus":
			return <FaBus />
		case "ferry":
			return <FaShip />
		case "subway":
			return <FaSubway />
		case "tram":
			return <MdTram />
		case "taxi":
			return <FaTaxi />
		default:
			console.warn("Unknown product", products)
			return null
	}
}
