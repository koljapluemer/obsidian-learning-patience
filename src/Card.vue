<template>
	<div class="card">
		<div id="front">
			<div id="front-view"></div>
			<button
				v-if="!revealed && activeCard == front"
				@click="revealed = true"
			>
				Reveal
			</button>
		</div>
		<div id="back" v-if="revealed">
			<!-- <Markdown :source="'---\n\n' + back" /> -->

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

const frontView = document.getElementById("front-view");
console.log("front view", frontView);

defineProps<{
	front: string;
	back: string;
	revealed: boolean;
	activeCard: string;
}>();

console.log("front", this.front);

MarkdownRenderer.renderMarkdown("**hi**", frontView);
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
