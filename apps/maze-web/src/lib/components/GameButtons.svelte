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


<div class={`flex gap-4 ${vertical ? 'flex-col' : 'flex-wrap justify-center'} ${vertical ? '' : 'mb-8'}`}>
    <Button variant="neon" size="2xl" onclick={onBackToMain}>
        <Icons.MenuIcon size="40" />
        Back to Main
    </Button>
    <Button variant="neon-pink" color="green" size="2xl" onclick={resetGame}>
        <Icons.RotateCcwIcon />
        Reset Game
    </Button>
    <Button variant="neon-orange" size="2xl" onclick={onSolveMaze}>
        <Icons.LightbulbIcon />
        Tips
    </Button>
    <Button variant="neon-purple" size="2xl" onclick={onAutoSolve}>
        <Icons.BotIcon />
        Game Bot
    </Button>

</div>