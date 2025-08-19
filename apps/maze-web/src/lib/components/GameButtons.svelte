<script lang="ts">
import { Button, Icons } from "@nadir/solara";

const {
	resetGame,
	onSolveMaze,
	onBackToMain,
	onAutoSolve,
	vertical = false,
} = $props<{
	resetGame: () => void;
	onSolveMaze: () => void;
	onBackToMain: () => void;
	onAutoSolve: () => void;
	vertical?: boolean;
}>();
</script>


<div class={`flex gap-2 sm:gap-4 ${vertical ? 'flex-col' : 'flex-wrap justify-center'} ${vertical ? '' : 'mb-8'}`}>
    <Button 
        variant="neon" 
        size={vertical ? "xl" : "lg"}
        class={vertical ? "w-full sm:w-auto" : ""}
        onclick={onBackToMain}
        title="Back to Main"
    >
        <Icons.MenuIcon class="w-5 h-5 sm:w-6 sm:h-6" />
        <span class="hidden sm:inline ml-2">Back to Main</span>
    </Button>
    <Button 
        variant="neon-pink" 
        color="green" 
        size={vertical ? "xl" : "lg"}
        class={vertical ? "w-full sm:w-auto" : ""}
        onclick={resetGame}
        title="Reset Game"
    >
        <Icons.RotateCcwIcon class="w-5 h-5 sm:w-6 sm:h-6" />
        <span class="hidden sm:inline ml-2">Reset Game</span>
    </Button>
    <Button 
        variant="neon-orange" 
        size={vertical ? "xl" : "lg"}
        class={vertical ? "w-full sm:w-auto" : ""}
        onclick={onSolveMaze}
        title="Tips"
    >
        <Icons.LightbulbIcon class="w-5 h-5 sm:w-6 sm:h-6" />
        <span class="hidden sm:inline ml-2">Tips</span>
    </Button>
    <Button 
        variant="neon-purple" 
        size={vertical ? "xl" : "lg"}
        class={vertical ? "w-full sm:w-auto" : ""}
        onclick={onAutoSolve}
        title="Game Bot"
    >
        <Icons.BotIcon class="w-5 h-5 sm:w-6 sm:h-6" />
        <span class="hidden sm:inline ml-2">Game Bot</span>
    </Button>

</div>