import { describe, expect, it, vi } from "vitest";
import { MazeAPILive } from "./maze.js";

// Mock the helper/run module
vi.mock("../helper/run.js", () => ({
	runGetRequest: vi.fn(),
	runPostRequest: vi.fn(),
	runRequestWithParams: vi.fn(),
}));

import {
	runGetRequest,
	runPostRequest,
	runRequestWithParams,
} from "../helper/run.js";

describe("MazeAPILive", () => {
	describe("getDataMaze", () => {
		it("should call runGetRequest with correct parameters", () => {
			MazeAPILive.getDataMaze();
			expect(runGetRequest).toHaveBeenCalledWith(
				expect.any(String), // GET_ALL_MAZE_METADATA
				expect.anything(), // MetaArraySchema
			);
		});
	});

	describe("getMaze", () => {
		it("should call runRequestWithParams with correct parameters", () => {
			const mazeId = "test-maze-123";
			MazeAPILive.getMaze(mazeId);
			expect(runRequestWithParams).toHaveBeenCalledWith(
				expect.any(String), // GET_SELECTED_MAZE
				{ maze_id: mazeId },
				expect.anything(), // MazeSchema
			);
		});
	});

	describe("getAllMazes", () => {
		it("should call runGetRequest with correct parameters", () => {
			MazeAPILive.getAllMazes();
			expect(runGetRequest).toHaveBeenCalledWith(
				expect.any(String), // GET_ALL_MAZE
				expect.anything(), // MazeArraySchema
			);
		});
	});

	describe("getAllPlayers", () => {
		it("should call runGetRequest with correct parameters", () => {
			MazeAPILive.getAllPlayers();
			expect(runGetRequest).toHaveBeenCalledWith(
				expect.any(String), // GET_ALL_PLAYERS
				expect.anything(), // PlayerDataArraySchema
			);
		});
	});

	describe("createMaze", () => {
		it("should call runPostRequest with correct parameters", () => {
			const mazeData = {
				name: "Test Maze",
				level: 1,
				numRows: 10,
				numCols: 10,
			};
			MazeAPILive.createMaze(mazeData);
			expect(runPostRequest).toHaveBeenCalledWith(
				expect.any(String), // POST_MAZE
				mazeData,
			);
		});

		it("should handle empty maze data", () => {
			MazeAPILive.createMaze({});
			expect(runPostRequest).toHaveBeenCalledWith(
				expect.any(String), // POST_MAZE
				{},
			);
		});

		it("should handle null maze data", () => {
			MazeAPILive.createMaze(null);
			expect(runPostRequest).toHaveBeenCalledWith(
				expect.any(String), // POST_MAZE
				null,
			);
		});
	});
});
