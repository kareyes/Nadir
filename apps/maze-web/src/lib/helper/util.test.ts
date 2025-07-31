import { describe, expect, it } from "vitest";
import {
	calculatePlayerRating,
	cn,
	getCellThemeColors,
	getThemeColors,
	levelToTheme,
} from "./util.js";

describe("Utility Functions", () => {
	describe("cn function", () => {
		it("should merge class names correctly", () => {
			expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
		});

		it("should handle conditional classes", () => {
			expect(cn("text-base", true && "font-bold", false && "italic")).toBe(
				"text-base font-bold",
			);
		});

		it("should merge conflicting tailwind classes", () => {
			expect(cn("px-2 py-1", "p-3")).toBe("p-3");
		});
	});

	describe("getCellThemeColors", () => {
		it("should return cyan colors for level 1", () => {
			const colors = getCellThemeColors(1);
			expect(colors.wall).toBe("bg-cyan-400");
			expect(colors.wallShadow).toBe("shadow-[0_0_4px_rgba(6,182,212,0.5)]");
			expect(colors.playerShadow).toBe("drop-shadow-[0_0_8px_#00e0ff]");
		});

		it("should return green colors for level 2", () => {
			const colors = getCellThemeColors(2);
			expect(colors.wall).toBe("bg-green-400");
			expect(colors.wallShadow).toBe("shadow-[0_0_4px_rgba(34,197,94,0.5)]");
			expect(colors.playerShadow).toBe("drop-shadow-[0_0_8px_#22c55e]");
		});

		it("should return purple colors for level 3", () => {
			const colors = getCellThemeColors(3);
			expect(colors.wall).toBe("bg-purple-400");
			expect(colors.wallShadow).toBe("shadow-[0_0_4px_rgba(147,51,234,0.5)]");
			expect(colors.playerShadow).toBe("drop-shadow-[0_0_8px_#9333ea]");
		});

		it("should return default cyan colors for invalid level", () => {
			const colors = getCellThemeColors(999);
			expect(colors.wall).toBe("bg-cyan-400");
		});
	});

	describe("getThemeColors", () => {
		it("should return cyan theme for level 1", () => {
			const colors = getThemeColors(1);
			expect(colors.text).toBe("text-cyan-300");
			expect(colors.primary).toBe("cyan-400");
			expect(colors.primaryRgb).toBe("6,182,212");
		});

		it("should return green theme for level 2", () => {
			const colors = getThemeColors(2);
			expect(colors.text).toBe("text-green-300");
			expect(colors.primary).toBe("green-400");
			expect(colors.primaryRgb).toBe("34,197,94");
		});

		it("should return purple theme for level 3", () => {
			const colors = getThemeColors(3);
			expect(colors.text).toBe("text-purple-300");
			expect(colors.primary).toBe("purple-400");
			expect(colors.primaryRgb).toBe("147,51,234");
		});

		it("should return default theme for invalid level", () => {
			const colors = getThemeColors(0);
			expect(colors.primary).toBe("cyan-400");
		});
	});

	describe("levelToTheme", () => {
		it("should return neon theme and Easy name for level 1", () => {
			const theme = levelToTheme(1);
			expect(theme.theme).toBe("neon");
			expect(theme.name).toBe("Easy");
		});

		it("should return neon-green theme and Medium name for level 2", () => {
			const theme = levelToTheme(2);
			expect(theme.theme).toBe("neon-green");
			expect(theme.name).toBe("Medium");
		});

		it("should return neon-purple theme and Hard name for level 3", () => {
			const theme = levelToTheme(3);
			expect(theme.theme).toBe("neon-purple");
			expect(theme.name).toBe("Hard");
		});

		it("should return default theme for invalid level", () => {
			const theme = levelToTheme(999);
			expect(theme.theme).toBe("neon");
			expect(theme.name).toBe("Easy");
		});
	});

	describe("calculatePlayerRating", () => {
		it("should return rating based on performance", () => {
			// Test with a very efficient performance (should get high rating)
			const result = calculatePlayerRating(3, 2, [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 2, y: 0 },
			]);
			expect(result.rating).toBeGreaterThanOrEqual(1);
			expect(result.rating).toBeLessThanOrEqual(5);
			expect(typeof result.ratingText).toBe("string");
			expect(result.ratingText.length).toBeGreaterThan(0);
		});

		it("should return lower rating for poor performance", () => {
			const result = calculatePlayerRating(50, 40, [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 2, y: 0 },
			]);
			expect(result.rating).toBe(1);
			expect(result.ratingText).toBe("🎯 Keep Practicing!");
		});

		it("should handle case without solution path", () => {
			const result = calculatePlayerRating(20, 15, undefined, 100);
			expect(result.rating).toBeGreaterThanOrEqual(1);
			expect(result.rating).toBeLessThanOrEqual(5);
			expect(typeof result.ratingText).toBe("string");
		});

		it("should return better rating for fewer moves and less time", () => {
			const goodResult = calculatePlayerRating(5, 3, [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 2, y: 0 },
				{ x: 3, y: 0 },
				{ x: 4, y: 0 },
			]);
			
			const badResult = calculatePlayerRating(50, 40, [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 2, y: 0 },
			]);

			expect(goodResult.rating).toBeGreaterThanOrEqual(badResult.rating);
		});

		it("should calculate efficiency correctly", () => {
			// Test the algorithm with known values
			const solutionPath = [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 2, y: 0 },
			];
			
			// Perfect performance (moves = optimal, time = optimal)
			const optimalMoves = solutionPath.length - 1; // 2 moves
			const optimalTime = optimalMoves * 0.8; // 1.6 seconds
			
			const perfectResult = calculatePlayerRating(optimalMoves, optimalTime, solutionPath);
			expect(perfectResult.rating).toBe(5);
		});
	});
});
