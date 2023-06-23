<template>
	<h2>Hello,Developer!</h2>
    <div id="row" v-for="row in rows">
        <div class="card" v-for="card in row">
            hi
        </div>
    </div>
</template>

<script setup lang="tsx">
import Hello from "./Hello";
import Hi from "./Hi.vue";
import { ref } from "vue";
let hi = ref("");
let HiHi = () => (
	<h1>
		<Hello></Hello>
	</h1>
);

// get all Obsidian notes with tag #vr
const allNotesWithTag = app.vault.getMarkdownFiles().filter((note) => {
	let willBeIncluded = false;
	const tags = this.app.metadataCache.getFileCache(note)?.tags;
	if (tags) {
		if (tags.filter((tag) => tag.tag === "#ux-vr").length > 0) {
			willBeIncluded = true;
		}
	}
	return willBeIncluded;
});
// pick 30 randomly
const notes = allNotesWithTag
	.sort(() => Math.random() - Math.random())
	.slice(0, 30);
console.log(notes);

let rows = ref([
	[{}, {}, {}, {}, {}, {}, {}],
	[{}, {}, {}, {}, {}],
	[{}, {}, {}, {}, {}],
	[{}, {}, {}],
]);
</script>

<style scoped>
h2 {
	color: lightcoral;
}

.card {
    border: 1px solid #ddd;
}
</style>
