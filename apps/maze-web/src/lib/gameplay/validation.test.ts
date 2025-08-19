import { GamePlayError, type Maze } from "@nadir/global-types";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { validateBounds, validateMaze } from "./validation.js";

describe("Maze Validation", () => {
	const mockMaze: Maze = {
		maze_id: "test-maze",
		mazeName: "Test Maze",
		level: 1,
		numRows: 5,
		numCols: 5,
		grid: [
			{
				horizontal: [false, false, false, false, false],
				vertical: [false, false, false, false, false],
			},
			{
				horizontal: [false, false, false, false, false],
				vertical: [false, false, false, false, false],
			},
			{
				horizontal: [false, false, false, false, false],
				vertical: [false, false, false, false, false],
			},
			{
				horizontal: [false, false, false, false, false],
				vertical: [false, false, false, false, false],
			},
			{
				horizontal: [false, false, false, false, false],
				vertical: [false, false, false, false, false],
			},
		],
		description: "",
		created_at: "",
	};

	describe("validateMaze", () => {
		it("should succeed with valid maze", async () => {
			const result = await Effect.runPromise(validateMaze(mockMaze));
			expect(result).toEqual(mockMaze);
		});

		it("should fail with null maze", async () => {
			await expect(
				Effect.runPromise(validateMaze(null as unknown as Maze)),
			).rejects.toThrow();
		});

		it("should fail with undefined maze", async () => {
			await expect(
				Effect.runPromise(validateMaze(undefined as unknown as Maze)),
			).rejects.toThrow();
		});
	});

	describe("validateBounds", () => {
		it("should succeed with valid coordinates", async () => {
			const coordinates = { x: 2, y: 3 };
			const result = await Effect.runPromise(
				validateBounds(coordinates, mockMaze),
			);
			expect(result).toEqual(coordinates);
		});

		it("should succeed with boundary coordinates", async () => {
			const coordinates = { x: 0, y: 0 };
			const result = await Effect.runPromise(
				validateBounds(coordinates, mockMaze),
			);
			expect(result).toEqual(coordinates);
		});

		it("should succeed with max boundary coordinates", async () => {
			const coordinates = { x: 4, y: 4 };
			const result = await Effect.runPromise(
				validateBounds(coordinates, mockMaze),
			);
			expect(result).toEqual(coordinates);
		});

		it("should fail with negative x coordinate", async () => {
			const coordinates = { x: -1, y: 2 };
			await expect(
				Effect.runPromise(validateBounds(coordinates, mockMaze)),
			).rejects.toThrow();
		});

		it("should fail with negative y coordinate", async () => {
			const coordinates = { x: 2, y: -1 };
			await expect(
				Effect.runPromise(validateBounds(coordinates, mockMaze)),
			).rejects.toThrow();
		});

		it("should fail with x coordinate out of bounds", async () => {
			const coordinates = { x: 5, y: 2 };
			await expect(
				Effect.runPromise(validateBounds(coordinates, mockMaze)),
			).rejects.toThrow();
		});

		it("should fail with y coordinate out of bounds", async () => {
			const coordinates = { x: 2, y: 5 };
			await expect(
				Effect.runPromise(validateBounds(coordinates, mockMaze)),
			).rejects.toThrow();
		});

		it("should fail with both coordinates out of bounds", async () => {
			const coordinates = { x: 10, y: 10 };
			await expect(
				Effect.runPromise(validateBounds(coordinates, mockMaze)),
			).rejects.toThrow();
		});
	});

	describe("edge cases", () => {
		it("should handle 1x1 maze", async () => {
			const smallMaze: Maze = {
				...mockMaze,
				numRows: 1,
				numCols: 1,
				grid: [
					{
						horizontal: [false],
						vertical: [false],
					},
				],
			};

			const coordinates = { x: 0, y: 0 };
			const result = await Effect.runPromise(
				validateBounds(coordinates, smallMaze),
			);
			expect(result).toEqual(coordinates);
		});

		it("should handle rectangular maze", async () => {
			const rectMaze: Maze = {
				...mockMaze,
				numRows: 3,
				numCols: 7,
			};

			const coordinates = { x: 2, y: 6 };
			const result = await Effect.runPromise(
				validateBounds(coordinates, rectMaze),
			);
			expect(result).toEqual(coordinates);
		});
	});
});
