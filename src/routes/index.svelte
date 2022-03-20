<script lang="ts">
	import { browser } from '$app/env';

	import Carret from '$lib/components/Carret.svelte';
	import Result from '$lib/components/Result.svelte';
	import Row from '$lib/components/Row.svelte';
	import { onMount } from 'svelte';

	import { Operation } from '../lib/Operation';
	import { Token } from '../lib/Token';

	let { operations } = Operation;
	$operations = [new Operation('(1345679+87646)*64646'.split(''))];

	function validate(i: number) {
		$operations = [...$operations, new Operation()];
	}
</script>

<!-- {#each operations as operation} -->
<h1 class="text-4xl">TEST</h1>

{#each $operations as operation, i}
	<Row {operation} on:validate={validate.bind(null, i)} />
{/each}
