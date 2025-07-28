<script lang="ts">
import { goto } from "$app/navigation";
import type { PlayerStats } from "@nadir/global-types";
import { Button, Dialog, Rating } from "@nadir/solara";

const { playerStats, isGameOver, resetGame } = $props<{
	playerStats: PlayerStats;
	isGameOver: boolean;
	resetGame: () => void;
}>();
const handleBackToMain = () => {
	goto(`/`);
};
</script>

 
<Dialog.Root open={isGameOver}>
  <Dialog.Content class="max-w-md mx-auto p-6 text-center rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.3)] ">
    <Dialog.Header class="relative z-10">
      <Dialog.Title class="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-4">
       Maze Conquered!
      </Dialog.Title>
      <Dialog.Description>
        <div class="space-y-6">
          <div class="text-center space-y-2">
            <div class="text-sm text-cyan-400/80">
              You've successfully navigated through the digital labyrinth
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-400/30 p-4 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              <div class="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative z-10 text-center space-y-2">
                <div class="text-3xl animate-bounce">🚀</div>
                <div class="text-sm text-cyan-300 font-medium">Moves</div>
                <div class="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  {playerStats.moves}
                </div>
              </div>
            </div>
            <div class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-400/30 p-4 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(147,51,234,0.4)]">
              <div class="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative z-10 text-center space-y-2">
                <div class="text-3xl animate-pulse">⏱️</div>
                <div class="text-sm text-purple-300 font-medium">Time</div>
                <div class="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  {playerStats.timeTaken}
                </div>
              </div>
            </div>
          </div>
          <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 border border-yellow-400/30 p-6 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
            <div class="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-orange-400/5 to-red-400/5 animate-pulse"></div>
            <div class="relative z-10 text-center space-y-4">
              <div class="space-y-2">
                <div class="text-xl font-bold text-yellow-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
                   Performance Rating 
                </div>
                <div class="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto rounded-full animate-pulse"></div>
              </div>
              <div class="flex items-center justify-center py-2">
                <div class="relative">
                  <div class="absolute inset-0 blur-xl bg-yellow-400/30 scale-150 animate-pulse"></div>
                  
                  <Rating.Root 
                    value={playerStats.rating} 
                    readonly={true}
                    size="xl"
                    color="yellow"
                    class="relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.9)] transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <div class="text-yellow-300 font-bold text-xl drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                  {playerStats.ratingText}
                </div>
                <div class="text-xs text-yellow-400/60 italic">
                  Based on moves efficiency and time performance
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <div class="flex flex-col sm:flex-row gap-3 w-full">
        <!-- Play Again Button -->
        <Button 
          variant="neon-pink" 
          onclick={resetGame}
          class="flex-1 group relative overflow-hidden transition-all duration-300 hover:scale-105"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative z-10 flex items-center justify-center gap-2">
            <span class="text-lg group-hover:animate-bounce">🎮</span>
            <span class="font-semibold">Play Again</span>
          </div>
        </Button>
        
        <!-- Back to Main Button -->
        <Button 
          variant="solid-neon" 
          onclick={handleBackToMain}
          class="flex-1 group relative overflow-hidden transition-all duration-300 hover:scale-105"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative z-10 flex items-center justify-center gap-2">
            <span class="text-lg group-hover:animate-pulse">🏠</span>
            <span class="font-semibold">Back to Main</span>
          </div>
        </Button>
      </div>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
