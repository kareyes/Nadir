import { beforeEach, describe, expect, it, vi } from "vitest";
import { runPostRequest } from "./run.js";

// Mock the environment variable
vi.mock("$env/dynamic/public", () => ({
	env: {
		PUBLIC_API_URL: "http://localhost:8080",
	},
}));

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("HTTP Request Utilities", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("runPostRequest", () => {
		it("should make a successful POST request", async () => {
			const mockResponse = { id: 1, name: "Test Maze" };
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await runPostRequest("/api/maze", {
				name: "Test Maze",
				level: 1,
			});

			expect(mockFetch).toHaveBeenCalledWith("http://localhost:8080/api/maze", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: "Test Maze", level: 1 }),
			});
			expect(result).toEqual(mockResponse);
		});

		it("should throw error on failed POST request", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
			});

			await expect(
				runPostRequest("/api/maze", { name: "Test Maze" }),
			).rejects.toThrow("HTTP error! status: 404");
		});

		it("should handle network errors", async () => {
			mockFetch.mockRejectedValueOnce(new Error("Network error"));

			await expect(
				runPostRequest("/api/maze", { name: "Test Maze" }),
			).rejects.toThrow("Network error");
		});
	});

	describe("URL parameter replacement", () => {
		it("should replace URL parameters correctly", () => {
			const endpoint = "/api/maze/:maze_id/level/:level";
			const params = { maze_id: "123", level: "2" };

			const expectedUrl = Object.entries(params).reduce(
				(url, [key, value]) => url.replace(`:${key}`, String(value)),
				endpoint,
			);

			expect(expectedUrl).toBe("/api/maze/123/level/2");
		});

		it("should handle single parameter replacement", () => {
			const endpoint = "/api/maze/:id";
			const params = { id: "abc123" };

			const expectedUrl = Object.entries(params).reduce(
				(url, [key, value]) => url.replace(`:${key}`, String(value)),
				endpoint,
			);

			expect(expectedUrl).toBe("/api/maze/abc123");
		});

		it("should handle no parameters", () => {
			const endpoint = "/api/maze";
			const params = {};

			const expectedUrl = Object.entries(params).reduce(
				(url, [key, value]) => url.replace(`:${key}`, String(value)),
				endpoint,
			);

			expect(expectedUrl).toBe("/api/maze");
		});
	});
});
