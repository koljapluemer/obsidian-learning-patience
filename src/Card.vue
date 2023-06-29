<template>
	<div class="card">
		<div id="front">
			<Markdown :source="front" />
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
import { ref, watch, computed } from "vue";

const component = Component;

defineProps<{
	front: string;
	back: string;
	revealed: boolean;
	activeCard: string;
	content: string;
}>();

// // log all image files in the vault
// const images = app.vault.getFiles().filter((file) => {
// 	return file.path.endsWith(".png");
// });
// const firstImage = images[0];
// const renderedImg = ref("");
// // open as binary file so it can be displayed
// app.vault.readBinary(firstImage).then((image) => {
// 	console.log('Image', image);
// 	const blob = new Blob([image], { type: "image/png" });
// 	renderedImg.value = URL.createObjectURL(blob);
// });
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
