<script lang="ts">
import { Button, Icons } from "@nadir/solara";

const { resetGame, onSolveMaze, onBackToMain } = $props<{
	resetGame: () => void;
	onSolveMaze: () => void;
	onBackToMain: () => void;
}>();
</script>


<div class="flex flex-wrap gap-4 justify-center mb-8">
    <Button variant="neon-pink" color="green" size="lg" onclick={resetGame}>
        <Icons.RotateCcwIcon />
        Reset Game
    </Button>
    <Button variant="neon-orange" size="lg" onclick={onSolveMaze}>
        <Icons.LightbulbIcon />
        Tips
    </Button>
    <Button variant="neon" size="lg" onclick={onBackToMain}>
        <Icons.MenuIcon />
        Back to Main
    </Button>
</div>