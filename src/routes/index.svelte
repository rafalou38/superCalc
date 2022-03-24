<script lang="ts">
	import { browser } from '$app/env';

	import Carret from '$lib/components/Carret.svelte';
	import Result from '$lib/components/Result.svelte';
	import Row from '$lib/components/Row.svelte';
	import { onMount } from 'svelte';

	import { Operation } from '../lib/Operation';
	import { Token } from '../lib/Token';

	let { operations } = Operation;
	$operations = [new Operation('123.32'.split(''))];

	function validate(i: number) {
		const result = $operations.at(-1).calculate();
		if (isNaN(result)) {
			$operations = [...$operations, new Operation()];
		} else {
			$operations = [...$operations, new Operation(result.toString().split(''))];
		}
	}
</script>

{#each $operations as operation, i}
	<Row {operation} on:validate={validate.bind(null, i)} />
{/each}
