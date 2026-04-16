<script lang="ts">
	export let query: string = '';
	export let onQueryChange: (value: string) => void;
</script>

<label class="search">
	<span>Buscar personaje</span>
	<input
		type="search"
		placeholder="Rick, Morty, Summer..."
		value={query}
		on:input={(event) => onQueryChange((event.currentTarget as HTMLInputElement).value)}
	/>
</label>

<style>
	.search {
		display: grid;
		gap: 0.55rem;
	}

	.search span {
		font-size: 0.92rem;
		color: rgba(15, 28, 46, 0.7);
	}

	input {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid rgba(0, 0, 0, 0.14);
		background: #ffffff;
		color: #0f1c2e;
		padding: 0.95rem 1rem;
		border-radius: 14px;
		outline: none;
	}

	input:focus {
		border-color: rgba(78, 205, 196, 0.8);
		box-shadow: 0 0 0 4px rgba(78, 205, 196, 0.12);
	}
</style>
