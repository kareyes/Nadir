<script lang="ts">
import "../app.css";

let { children } = $props();
</script>


<svelte:head>
    <title>Neon Quest</title>
</svelte:head>
{@render children()}
