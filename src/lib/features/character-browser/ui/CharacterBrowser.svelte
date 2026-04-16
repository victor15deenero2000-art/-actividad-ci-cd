<script lang="ts">
	import { CharacterList } from '$lib/features/character-list';
	import { CharacterSearch } from '$lib/features/character-search';
	import type { CharacterBrowserData } from '../model';

	export let data: CharacterBrowserData;
	export let onQueryChange: (value: string) => void;
</script>

<section class="hero">
	<div class="eyebrow">SvelteKit · Rick and Morty</div>
	<h1>Arquitectura frontend lista para crecer sin mezclar UI con negocio.</h1>
	<p>
		Base feature-first/domain-first con contratos claros entre pantalla, dominio y API.
	</p>
</section>

<div class="panel">
	<CharacterSearch query={data.query} onQueryChange={onQueryChange} />

	<div class="meta">
		<p>{data.total} personajes</p>
		{#if data.error}
			<p class="error">{data.error}</p>
		{/if}
	</div>

	<CharacterList characters={data.characters} />
</div>

<style>
	section.hero {
		max-width: 960px;
		margin: 0 auto;
		padding: 4rem 1.25rem 1.5rem;
	}

	.eyebrow {
		display: inline-flex;
		padding: 0.4rem 0.75rem;
		border-radius: 999px;
		background: rgba(78, 205, 196, 0.12);
		color: #7ef0e3;
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1 {
		max-width: 14ch;
		margin: 1rem 0 0.8rem;
		font-size: clamp(2.4rem, 7vw, 4.8rem);
		line-height: 0.95;
	}

	p {
		max-width: 60ch;
		margin: 0;
		color: rgba(15, 28, 46, 0.65);
		font-size: 1.03rem;
	}

	.panel {
		max-width: 960px;
		margin: 0 auto;
		padding: 0 1.25rem 3rem;
		display: grid;
		gap: 1rem;
	}

	.meta {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: center;
	}

	.meta p {
		margin: 0;
		font-size: 0.95rem;
	}

	.error {
		color: #ffb4b4;
	}
</style>
