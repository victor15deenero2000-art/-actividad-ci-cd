<svelte:head>
	<title>Prueba Lectiva</title>
	<meta
		name="description"
		content="Base SvelteKit con arquitectura feature-first/domain-first para integrar Rick and Morty."
	/>
</svelte:head>

<div class="app-shell">
	<slot />
</div>

<style>
	:global(html) {
		color-scheme: light;
	}

	:global(body) {
		margin: 0;
		font-family:
			Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
		background:
			radial-gradient(circle at top, rgba(78, 205, 196, 0.12), transparent 35%),
			linear-gradient(180deg, #ffffff 0%, #f4f7fb 100%);
		color: #0f1c2e;
		min-height: 100vh;
	}

	.app-shell {
		min-height: 100vh;
	}
</style>
