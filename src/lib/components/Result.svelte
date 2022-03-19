<script lang="ts">
	import { browser } from '$app/env';

	import type { Operation } from '$lib/Operation';

	export let operation: Operation;

	let result = NaN;

	$: result = browser && $operation.calculate();
</script>

<span class="ml-auto text-lime-500/30" class:error={isNaN(result)}>
	{result}
</span>

<style lang="postcss">
	.error {
		@apply text-red-500/30;
	}
</style>
