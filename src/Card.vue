<template>
	<div class="card">
		<div id="front">
			<Markdown :source="front + '![](Pasted image 20230629185337.png)'" />

			<button
				v-if="!revealed && activeCard == front"
				@click="revealed = true"
			>
				Reveal
			</button>
		</div>
		<div id="back" v-if="revealed">
			<Markdown :source="'---\n\n' + back" />

			<div class="button-row">
				<button @click="$emit('handleWrong')" id="wrong">Wrong</button>
				<button @click="$emit('handleRight')" id="correct">
					Correct
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import Markdown from "vue3-markdown-it";
import {
	MarkdownView,
	MarkdownPreviewView,
	MarkdownRenderer,
	Component,
} from "obsidian";
const component = Component;

defineProps<{
	front: string;
	back: string;
	revealed: boolean;
	activeCard: string;
	content: string;
}>();

// log all image files in the vault
const images = app.vault.getFiles().filter((file) => {
	return file.path.endsWith(".png");
});
console.log("images", images);
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
