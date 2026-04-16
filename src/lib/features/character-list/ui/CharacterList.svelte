<script lang="ts">
	import type { Character } from '$lib/entities/character/types';

	export let characters: Character[] = [];
</script>

{#if characters.length === 0}
	<p class="empty">No hay resultados para ese filtro.</p>
{:else}
	<div class="grid">
		{#each characters as character}
			<article class="card">
				<img src={character.image} alt={character.name} loading="lazy" />
				<div class="content">
					<h2>{character.name}</h2>
					<p>{character.status} · {character.species}</p>
					<dl>
						<div>
							<dt>Origen</dt>
							<dd>{character.originName}</dd>
						</div>
						<div>
							<dt>Ubicación</dt>
							<dd>{character.locationName}</dd>
						</div>
					</dl>
				</div>
			</article>
		{/each}
	</div>
{/if}

<style>
	.empty {
		margin: 2rem 0 0;
		color: rgba(15, 28, 46, 0.6);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}

	.card {
		overflow: hidden;
		border-radius: 20px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		background: #ffffff;
		box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
	}

	img {
		display: block;
		width: 100%;
		height: 220px;
		object-fit: cover;
	}

	.content {
		padding: 1rem;
	}

	h2 {
		margin: 0 0 0.35rem;
		font-size: 1.05rem;
	}

	p {
		margin: 0 0 0.9rem;
		color: rgba(15, 28, 46, 0.6);
	}

	dl {
		margin: 0;
		display: grid;
		gap: 0.75rem;
	}

	dt {
		font-size: 0.74rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(15, 28, 46, 0.4);
	}

	dd {
		margin: 0.2rem 0 0;
	}
</style>
