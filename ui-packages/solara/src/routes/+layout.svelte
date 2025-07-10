<script lang="ts">
	import '../app.css';
	import * as Sidebar from "complib/components/ui/sidebar/index.js";
  	import AppSidebar from "complib/module/app-sidebar.svelte";
	
	let { children } = $props();
</script>

<!-- {@render children()} -->

<Sidebar.Provider>
  <AppSidebar />
  <main>
    <Sidebar.Trigger />
    {@render children?.()}
  </main>
</Sidebar.Provider>
