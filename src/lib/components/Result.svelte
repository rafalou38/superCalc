<script lang="ts">
	import { browser } from '$app/env';

	import type { Operation } from '$lib/Operation';

	export let operation: Operation;

	let result = NaN;

	$: result = browser && operation.calculate();
</script>

<span>
	{result}
</span>
