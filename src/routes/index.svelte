<script lang="ts">
	import Carret from '$lib/components/Carret.svelte';
	import { onMount } from 'svelte';

	import { Operation } from '../lib/Operation';
	import { Token } from '../lib/Token';

	const operation = new Operation();

	function handleKeyPress(e: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		const { key } = e;
		const success = operation.handle_key(key, e.shiftKey, e.ctrlKey);
		if (success) return e.preventDefault();
	}

	function onMouseUp(
		e: MouseEvent & { currentTarget: EventTarget & HTMLSpanElement; target: HTMLSpanElement }
	) {
		const index = parseInt(e.target.dataset['index']);
		if (!index) return;

		const { target } = e;
		const rect = target.getBoundingClientRect();
		const leftX = rect.left;
		const rightX = leftX + rect.width;

		const distL = Math.abs(leftX - e.x);
		const distR = Math.abs(rightX - e.x);
		if (distL > distR) {
			operation.setCursor(index + 1);
		} else {
			operation.setCursor(index);
		}
	}

	function mouseDown(
		e: MouseEvent & { currentTarget: EventTarget & HTMLSpanElement; target: HTMLSpanElement }
	) {
		const index = parseInt(e.target.dataset['index']);
		if (!index) return;

		operation.setSelection(index, index);
	}

	function mouseMove(
		e: MouseEvent & { currentTarget: EventTarget & HTMLSpanElement; target: HTMLSpanElement }
	) {
		const index = parseInt(e.target.dataset['index']);
		if (!index) return;

		if (e.buttons !== 1) return;

		operation.setSelection(operation.selection.start, index);
	}
</script>

<!-- {#each operations as operation} -->

<div
	on:select={console.log}
	on:keydown={handleKeyPress}
	on:focus={() => $operation.setFocus(true)}
	on:blur={() => $operation.setFocus(false)}
	class="operation flex items-center px-4 py-4 w-full bg-slate-50 text-2xl select-none cursor-text"
	tabindex="0"
>
	{#if 0 === $operation.cursor_position && $operation.active && $operation.selection.start === $operation.selection.end}
		<Carret />
	{/if}
	{#each $operation.tokens as token, i}
		<span
			class=""
			style="color: {token.color()};"
			class:selected={$operation.selection.start != $operation.selection.end &&
				Math.min($operation.selection.start, $operation.selection.end) <= i &&
				i <= Math.max($operation.selection.start, $operation.selection.end)}
			on:mouseup={onMouseUp}
			on:mousedown={mouseDown}
			on:mousemove={mouseMove}
			data-index={i}>{@html token.displayKey()}</span
		><!-- 

	 -->{#if i === $operation.cursor_position - 1 && $operation.active && $operation.selection.start === $operation.selection.end}
			<span class="w-0">
				<Carret />
			</span>
		{/if}
	{/each}
</div>
<!-- {$operation} -->
<!--  
<br />

<button
	on:click={() => {
		$operation.key('*');
	}}>*</button
> -->

<!-- {/each} -->
<style lang="postcss">
	.operation:focus {
		@apply outline-none bg-slate-100;
	}
	.selected {
		@apply bg-slate-300 bg-opacity-50;
	}
</style>
