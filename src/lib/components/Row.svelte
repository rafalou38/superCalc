<script lang="ts">
	import { browser } from '$app/env';

	import Carret from '$lib/components/Carret.svelte';
	import Result from '$lib/components/Result.svelte';

	import type { Operation } from '$lib/Operation';
	import { createEventDispatcher, onMount } from 'svelte';

	export let operation: Operation;
	const dispatch = createEventDispatcher();

	function handleKeyPress(e: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		const { key } = e;
		if (key === 'Enter') {
			dispatch('validate');
			return e.preventDefault();
		}
		const success = operation.handle_key(key, e.shiftKey, e.ctrlKey);
		if (success) return e.preventDefault();
	}

	function onMouseUp(
		e: MouseEvent & { currentTarget: EventTarget & HTMLSpanElement; target: HTMLSpanElement }
	) {
		const index = parseInt(e.target.dataset['index']);
		if (!index) return;
	}

	function nearest(p: number, x: number, w: number) {
		return Math.abs(p - x) < w / 2 ? -1 : 1;
	}

	function mouseDown(
		e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement; target: HTMLDivElement }
	) {
		let index = parseInt(e.target.dataset['index']);
		if (!index) index = operation.tokens.length;

		const rect = e.target.getBoundingClientRect();

		if (nearest(e.x, rect.left, rect.width) > 0) {
			operation.setCursor(index + 1);
		} else {
			operation.setCursor(index);
		}

		operation.setSelection(index, index);
	}

	function mouseMove(
		e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement; target: HTMLDivElement }
	) {
		if (!e.target.dataset['index']) return;
		const index = parseInt(e.target.dataset['index']);

		if (e.buttons !== 1) return;

		const rect = e.target.getBoundingClientRect();

		if (nearest(e.x, rect.left, rect.width) > 0) {
			operation.setSelection(operation.selection.start, index + 1);
			operation.setCursor(index + 1, true);
		} else {
			operation.setSelection(operation.selection.start, index);
			operation.setCursor(index, true);
		}
		console.log(operation.selection, index);
	}

	onMount(() => {
		$operation.elem.focus();
	});
</script>

<div
	on:select={console.log}
	on:keydown={handleKeyPress}
	on:mousedown={mouseDown}
	on:focus={() => $operation.setFocus(true)}
	on:blur={() => $operation.setFocus(false)}
	bind:this={operation.elem}
	class="operation flex items-center px-4 py-4 w-full bg-slate-50 text-2xl font-mono select-none cursor-text"
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
				i < Math.max($operation.selection.start, $operation.selection.end)}
			on:mouseup={onMouseUp}
			on:mousemove={mouseMove}
			data-index={i}>{@html token.displayKey()}</span
		><!-- 

	 -->{#if i === $operation.cursor_position - 1 && $operation.active && $operation.selection.start === $operation.selection.end}
			<span class="w-0">
				<Carret />
			</span>
		{/if}
	{/each}
	{#if browser}
		<Result {operation} />
	{/if}
</div>

<style lang="postcss">
	.operation:focus {
		@apply outline-none bg-slate-100;
	}
	.selected {
		@apply bg-slate-300 bg-opacity-50;
	}
</style>
