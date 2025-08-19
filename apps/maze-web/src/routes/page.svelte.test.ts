import { page } from "@vitest/browser/context";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Page from "./+page.svelte";

// Mock the navigation module
vi.mock("$app/navigation", () => ({
	goto: vi.fn(),
}));

// Mock the utility functions
vi.mock("$lib/helper/util.js", () => ({
	getThemeColors: vi.fn((level: number) => ({
		dropShadow: `drop-shadow-${level}`,
		text: `text-level-${level}`,
	})),
	levelToTheme: vi.fn((level: number) => ({
		theme: level === 1 ? "neon" : level === 2 ? "neon-green" : "neon-purple",
		name: level === 1 ? "Easy" : level === 2 ? "Medium" : "Hard",
	})),
}));

// Mock the component dependencies
vi.mock("@nadir/solara", () => ({
	Button: "button",
	Icons: {
		Loader: "div",
	},
	Loading: {
		Root: "div",
	},
	ToggleGroup: {
		Root: "div",
		Item: "div",
	},
}));

describe("+page.svelte", () => {
	const mockMazeData = [
		{
			maze_id: "1",
			mazeName: "Forest Maze",
			level: 1,
			numRows: 10,
			numCols: 10,
		},
		{
			maze_id: "2",
			mazeName: "Desert Challenge",
			level: 2,
			numRows: 15,
			numCols: 15,
		},
	];

	it("should render the logo and title", async () => {
		const mockData = {
			maze: vi.fn().mockResolvedValue(mockMazeData),
		};

		render(Page, { data: mockData });

		const logo = page.getByAltText("Neon Quest Logo");
		await expect.element(logo).toBeInTheDocument();

		const title = page.getByText("Choose your maze level and start playing!");
		await expect.element(title).toBeInTheDocument();
	});

	it("should show loading state when mazes are not loaded", async () => {
		const mockData = {
			maze: vi.fn().mockImplementation(
				() => new Promise(() => {}), // Never resolves
			),
		};

		render(Page, { data: mockData });

		const loadingText = page.getByText("Loading Maze...");
		await expect.element(loadingText).toBeInTheDocument();
	});

	it("should render maze selection when mazes are loaded", async () => {
		const mockData = {
			maze: vi.fn().mockResolvedValue(mockMazeData),
		};

		render(Page, { data: mockData });

		// Wait for mazes to load
		await new Promise((resolve) => setTimeout(resolve, 100));

		const forestMaze = page.getByText("Forest Maze");
		await expect.element(forestMaze).toBeInTheDocument();

		const desertMaze = page.getByText("Desert Challenge");
		await expect.element(desertMaze).toBeInTheDocument();
	});

	it("should disable start button when no maze is selected", async () => {
		const mockData = {
			maze: vi.fn().mockResolvedValue(mockMazeData),
		};

		render(Page, { data: mockData });

		// Wait for mazes to load
		await new Promise((resolve) => setTimeout(resolve, 100));

		const startButton = page.getByText("Start Game");
		await expect.element(startButton).toBeInTheDocument();
		await expect.element(startButton).toHaveAttribute("disabled");
	});

	it("should handle empty maze array", async () => {
		const mockData = {
			maze: vi.fn().mockResolvedValue([]),
		};

		render(Page, { data: mockData });

		// Wait for processing
		await new Promise((resolve) => setTimeout(resolve, 100));

		const loadingText = page.getByText("Loading Maze...");
		await expect.element(loadingText).toBeInTheDocument();
	});

	it("should handle single maze object instead of array", async () => {
		const singleMaze = {
			maze_id: "1",
			mazeName: "Solo Maze",
			level: 1,
			numRows: 10,
			numCols: 10,
		};

		const mockData = {
			maze: vi.fn().mockResolvedValue(singleMaze),
		};

		render(Page, { data: mockData });

		// Wait for processing
		await new Promise((resolve) => setTimeout(resolve, 100));

		const soloMaze = page.getByText("Solo Maze");
		await expect.element(soloMaze).toBeInTheDocument();
	});

	it("should handle maze loading errors", async () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		const mockData = {
			maze: vi.fn().mockRejectedValue(new Error("Failed to load mazes")),
		};

		render(Page, { data: mockData });

		// Wait for error handling
		await new Promise((resolve) => setTimeout(resolve, 100));

		expect(consoleError).toHaveBeenCalledWith(
			"Error loading maze list:",
			expect.any(Error),
		);

		consoleError.mockRestore();
	});
});
