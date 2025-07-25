import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getCellThemeColors = (level: number) => {
	switch (level) {
		case 1:
			return {
				wall: "bg-cyan-400",
				wallShadow: "shadow-[0_0_4px_rgba(6,182,212,0.5)]",
				playerShadow: "drop-shadow-[0_0_8px_#00e0ff]",
			};
		case 2:
			return {
				wall: "bg-green-400",
				wallShadow: "shadow-[0_0_4px_rgba(34,197,94,0.5)]",
				playerShadow: "drop-shadow-[0_0_8px_#22c55e]",
			};
		case 3:
			return {
				wall: "bg-purple-400",
				wallShadow: "shadow-[0_0_4px_rgba(147,51,234,0.5)]",
				playerShadow: "drop-shadow-[0_0_8px_#9333ea]",
			};
		default:
			return {
				wall: "bg-cyan-400",
				wallShadow: "shadow-[0_0_4px_rgba(6,182,212,0.5)]",
				playerShadow: "drop-shadow-[0_0_8px_#00e0ff]",
			};
	}
};

export const getGridThemeColors = (level: number) => {
	switch (level) {
		case 1:
			return {
				primary: "cyan-400",
				primaryRgb: "6,182,212",
				border: "border-cyan-400",
				borderOpacity: "border-cyan-400/30",
				shadow: "shadow-[0_0_20px_rgba(6,182,212,0.2)]",
				innerShadow:
					"shadow-[0_0_15px_rgba(6,182,212,0.4),inset_0_0_15px_rgba(6,182,212,0.1)]",
			};
		case 2:
			return {
				primary: "green-400",
				primaryRgb: "34,197,94",
				border: "border-green-400",
				borderOpacity: "border-green-400/30",
				shadow: "shadow-[0_0_20px_rgba(34,197,94,0.2)]",
				innerShadow:
					"shadow-[0_0_15px_rgba(34,197,94,0.4),inset_0_0_15px_rgba(34,197,94,0.1)]",
			};
		case 3:
			return {
				primary: "purple-400",
				primaryRgb: "147,51,234",
				border: "border-purple-400",
				borderOpacity: "border-purple-400/30",
				shadow: "shadow-[0_0_20px_rgba(147,51,234,0.2)]",
				innerShadow:
					"shadow-[0_0_15px_rgba(147,51,234,0.4),inset_0_0_15px_rgba(147,51,234,0.1)]",
			};
		default:
			return {
				primary: "cyan-400",
				primaryRgb: "6,182,212",
				border: "border-cyan-400",
				borderOpacity: "border-cyan-400/30",
				shadow: "shadow-[0_0_20px_rgba(6,182,212,0.2)]",
				innerShadow:
					"shadow-[0_0_15px_rgba(6,182,212,0.4),inset_0_0_15px_rgba(6,182,212,0.1)]",
			};
	}
};
