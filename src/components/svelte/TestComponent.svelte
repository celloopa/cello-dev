<script>
	import Nested from "./Nested.svelte";
</script>

<div class="container">
	<Nested answer={42} />
</div>

<style>
	@import "src/styles/colors.css";
	/* .alert { */
	/* 	font-size: 2rem; */
	/* 	font-weight: 800; */
	/* 	color: var(--color-accent); */
	/* } */
	.container {
		display: flex;
		flex-direction: column-reverse;
		align-items: center;
		color: var(--color-text);
	}
	/* p { */
	/* 	font-weight: 500; */
	/* 	font-size: 1.5rem; */
	/* } */
	/* button { */
	/* 	background: var(--color-accent); */
	/* 	font-size: 1.5rem; */
	/* 	font-weight: 800; */
	/* 	color: var(--color-background); */
	/* 	border-radius: 8px; */
	/* 	padding-block: 0.5rem; */
	/* } */
</style>
