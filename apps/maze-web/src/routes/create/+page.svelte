<script lang="ts">
import { goto } from "$app/navigation";
import { MazeAPIService } from "$lib/api/maze.js";
import MazeGrid from "$lib/components/MazeGrid.svelte";
import {
	type MazeGenerationOptions,
	type MazeMetadata,
	generateMazeSync,
} from "$lib/gameplay/mazeGenerator.js";
import type { Maze } from "@nadir/global-types";
import { Button, Select } from "@nadir/solara";
import { Effect } from "effect";
import { onMount } from "svelte";

// State
let isGenerating = $state(false);
let isSaving = $state(false);
let generatedMaze = $state<Maze | null>(null);
let saveStatus = $state<string>("");

// Form data
let mazeOptions = $state<MazeGenerationOptions>({
	numRows: 10,
	numCols: 10,
	algorithm: "dfs",
});

let mazeMetadata = $state<MazeMetadata>({
	mazeName: "",
	description: "",
	level: 1,
});

let selectedAlgorithm = $state("dfs");
let selectedLevel = $state("1");

// Generate maze function
const generateMaze = () => {
	isGenerating = true;
	saveStatus = "";

	try {
		const maze = generateMazeSync(mazeOptions, {
			...mazeMetadata,
			mazeName: mazeMetadata.mazeName || `Generated Maze ${Date.now()}`,
			description:
				mazeMetadata.description ||
				`A ${mazeOptions.numRows}x${mazeOptions.numCols} maze`,
		});

		generatedMaze = maze;
		saveStatus = "Maze generated successfully!";
	} catch (error) {
		console.error("Error generating maze:", error);
		saveStatus = "Error generating maze. Please try again.";
	} finally {
		isGenerating = false;
	}
};

// Save maze to database
const saveMaze = async () => {
	if (!generatedMaze) return;

	isSaving = true;
	saveStatus = "";

	try {
		// Convert maze to the format expected by the API
		const mazeData = {
			maze_id: generatedMaze.maze_id,
			mazeName: generatedMaze.mazeName,
			level: mazeMetadata.level || 1,
			description: generatedMaze.description,
			created_at: generatedMaze.created_at,
			numCols: generatedMaze.numCols,
			numRows: generatedMaze.numRows,
			grid: JSON.stringify(generatedMaze.grid),
		};

		const result = await MazeAPIService.pipe(
			Effect.flatMap((api) => Effect.promise(() => api.createMaze(mazeData))),
			Effect.provide(MazeAPIService.Default),
			Effect.runPromise,
		);

		saveStatus = "Maze saved successfully!";
		console.log("Maze saved:", result);

		// Redirect to the new maze after a delay
		setTimeout(() => {
			goto(`/${generatedMaze?.maze_id}`);
		}, 1500);
	} catch (error) {
		console.error("Error saving maze:", error);
		saveStatus = "Error saving maze. Please try again.";
	} finally {
		isSaving = false;
	}
};

// Navigate back to main menu
const goBack = () => {
	goto("/");
};

// Reset form
const resetForm = () => {
	generatedMaze = null;
	saveStatus = "";
	mazeMetadata = {
		mazeName: "",
		description: "",
		level: 1,
	};
};

onMount(() => {
	// You can add any initialization logic here
});
</script>

<main class="container mx-auto px-4 py-8">
	<div class="max-w-6xl mx-auto">
		<h1 class="text-4xl font-bold mb-8 text-center text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
			Create New Maze
		</h1>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Configuration Panel -->
			<div class="space-y-6">
				<div class="p-6 bg-gray-800/50 border border-cyan-400/30 rounded-lg">
					<h2 class="text-xl text-cyan-400 mb-4">Maze Configuration</h2>
					<p class="text-gray-300 mb-6">Configure the size and properties of your maze</p>
					
					<div class="space-y-4">
						<!-- Maze Dimensions -->
						<div class="grid grid-cols-2 gap-4">
							<div>
								<label for="rows" class="block text-sm font-medium text-cyan-400 mb-2">
									Rows
								</label>
								<input
									id="rows"
									type="number"
									min="5"
									max="30"
									bind:value={mazeOptions.numRows}
									class="w-full px-3 py-2 bg-gray-700 border border-cyan-400/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
								/>
							</div>
							<div>
								<label for="cols" class="block text-sm font-medium text-cyan-400 mb-2">
									Columns
								</label>
								<input
									id="cols"
									type="number"
									min="5"
									max="30"
									bind:value={mazeOptions.numCols}
									class="w-full px-3 py-2 bg-gray-700 border border-cyan-400/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
								/>
							</div>
						</div>

						<!-- Algorithm Selection -->
						<div>
							<label for="algorithm" class="block text-sm font-medium text-cyan-400 mb-2">
								Generation Algorithm
							</label>
							<select 
								id="algorithm"
								bind:value={selectedAlgorithm}
								onchange={() => mazeOptions.algorithm = selectedAlgorithm as "dfs" | "prims"}
								class="w-full px-3 py-2 bg-gray-700 border border-cyan-400/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
							>
								<option value="dfs">Depth-First Search (DFS)</option>
								<option value="prims" disabled>Prim's Algorithm (Coming Soon)</option>
							</select>
						</div>
					</div>
				</div>

				<div class="p-6 bg-gray-800/50 border border-cyan-400/30 rounded-lg">
					<h2 class="text-xl text-cyan-400 mb-4">Maze Metadata</h2>
					<p class="text-gray-300 mb-6">Add details about your maze</p>
					
					<div class="space-y-4">
						<!-- Maze Name -->
						<div>
							<label for="name" class="block text-sm font-medium text-cyan-400 mb-2">
								Maze Name
							</label>
							<input
								id="name"
								type="text"
								bind:value={mazeMetadata.mazeName}
								placeholder="Enter maze name..."
								class="w-full px-3 py-2 bg-gray-700 border border-cyan-400/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
							/>
						</div>

						<!-- Level -->
						<div>
							<label for="level" class="block text-sm font-medium text-cyan-400 mb-2">
								Difficulty Level
							</label>
							<select 
								id="level"
								bind:value={selectedLevel}
								onchange={() => mazeMetadata.level = parseInt(selectedLevel) as 1 | 2 | 3}
								class="w-full px-3 py-2 bg-gray-700 border border-cyan-400/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
							>
								<option value="1">Level 1 - Easy</option>
								<option value="2">Level 2 - Medium</option>
								<option value="3">Level 3 - Hard</option>
							</select>
						</div>

						<!-- Description -->
						<div>
							<label for="description" class="block text-sm font-medium text-cyan-400 mb-2">
								Description
							</label>
							<textarea
								id="description"
								bind:value={mazeMetadata.description}
								placeholder="Describe your maze..."
								rows="3"
								class="w-full px-3 py-2 bg-gray-700 border border-cyan-400/30 text-white rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
							></textarea>
						</div>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex gap-4">
					<Button
						variant="solid-neon"
						onclick={generateMaze}
						disabled={isGenerating}
						class="flex-1"
					>
						{isGenerating ? "Generating..." : "Generate Maze"}
					</Button>
					
					{#if generatedMaze}
						<Button
							variant="outline"
							onclick={saveMaze}
							disabled={isSaving}
							class="flex-1 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900"
						>
							{isSaving ? "Saving..." : "Save to Database"}
						</Button>
					{/if}
					
					<Button
						variant="ghost"
						onclick={resetForm}
						class="px-6 text-gray-400 hover:text-white"
					>
						Reset
					</Button>
				</div>

				<!-- Status Messages -->
				{#if saveStatus}
					<div class="text-center p-3 rounded-lg {saveStatus.includes('Error') || saveStatus.includes('error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}">
						{saveStatus}
					</div>
				{/if}

				<!-- Back Button -->
				<Button
					variant="ghost"
					onclick={goBack}
					class="w-full mt-4 text-gray-400 hover:text-white"
				>
					← Back to Main Menu
				</Button>
			</div>

			<!-- Maze Preview Panel -->
			<div class="space-y-6">
				<div class="p-6 bg-gray-800/50 border border-cyan-400/30 rounded-lg">
					<h2 class="text-xl text-cyan-400 mb-4">Maze Preview</h2>
					<p class="text-gray-300 mb-6">
						{generatedMaze ? `Generated ${generatedMaze.numRows}x${generatedMaze.numCols} maze` : "Generate a maze to see the preview"}
					</p>
					
					{#if generatedMaze}
						<div class="border-2 border-cyan-400/30 rounded-lg p-4 bg-gray-900/50">
							<MazeGrid
								maze={generatedMaze}
								playerPosition={{ x: 0, y: 0 }}
							/>
						</div>
						
						<div class="mt-4 text-sm text-gray-400 space-y-1">
							<p><strong>Maze ID:</strong> {generatedMaze.maze_id}</p>
							<p><strong>Size:</strong> {generatedMaze.numRows} × {generatedMaze.numCols}</p>
							<p><strong>Created:</strong> {new Date(generatedMaze.created_at).toLocaleString()}</p>
						</div>
					{:else}
						<div class="text-center py-12 text-gray-500">
							<div class="w-16 h-16 mx-auto mb-4 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
								<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
								</svg>
							</div>
							<p>No maze generated yet</p>
							<p class="text-sm">Configure options and click "Generate Maze"</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</main>
