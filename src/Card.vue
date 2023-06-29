<template>
	<div class="card">
		<div id="front">
			<p>{{ front }}</p>
			<button
				v-if="!revealed && activeCard == front"
				@click="revealed = true"
			>
				Reveal
			</button>
		</div>
		<div id="back" v-if="revealed">
			<p>---</p>
			{{ back }}
			<div class="button-row">
				<button @click="$emit('handleWrong')" id="wrong">Wrong</button>
				<button @click="$emit('handleRight')" id="correct">Correct</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	front: string;
	back: string;
	revealed: boolean;
	activeCard: string;
}>();


</script>

<style scoped>
.card {
	border: 1px solid #ddd;
	display: grid;
	place-items: center;
}

#wrong {
	background-color: #c62d2d;
}

#correct {
	background-color: #1e9e47;
}

</style>
