<script lang="ts">
import { goto } from "$app/navigation";
import type { PlayerStats } from "@nadir/global-types";
import { Button, Dialog } from "@nadir/solara";

const { playerStats, isGameOver, resetGame } = $props<{
	playerStats: PlayerStats;
	isGameOver: boolean;
	resetGame: () => void;
}>();
const handleBackToMain = () => {
	goto(`/`);
	// Logic to navigate back to the main menu
};
</script>

 
<Dialog.Root open={isGameOver}  >
  <Dialog.Content class ="mb-4 p-6 text-center rounded-lg border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
    <Dialog.Header>
      <Dialog.Title>Congratulations! You solved the maze!</Dialog.Title>
      <Dialog.Description>
        <span class="text-lg text-cyan-400 whitespace-pre-line">Here are your statistic: </span>
        <div class="text-md text-cyan-400 whitespace-pre-line">
          🚀 Moves: {playerStats.moves}<br>
          ⏱️ Time:  {playerStats.timeTaken}
        </div>
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="neon-pink" onclick={resetGame}>
        🎮 Play Again
      </Button>
      <Button variant="solid-neon" onclick={handleBackToMain}>
        Back to Main
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
