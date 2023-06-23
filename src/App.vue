<template>
	<h2>Hello,Developer!</h2>
	<div id="row" v-for="row in rows">
		<div class="card" v-for="card in row">
			{{ card.front }}
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

const cards = ref([]);
this.cards = notes;

const generateCards = async () => {
	this.cards = await Promise.all(
		notes.map(
			async (note) =>
				await this.app.vault.read(note).then((content) => {
					const splitCard = content.split("---");
					const metadata = this.app.metadataCache.getFileCache(note);

					let front = "";
					let back = "";

					if (metadata?.frontmatter || splitCard.length > 2) {
						front = splitCard[2];
						back = splitCard[3];
					} else {
						front = splitCard[0];
						back = splitCard[1];
					}

					console.log("front", front);

					return {
						front: front,
						back: back,
					};
				})
		)
	);
};

console.log("only content", this.cards);
let rows = ref([[], [], [], []]);
console.log("relevant row", rows.value);

generateCards().then(() => {
	// fill last row with 3 random notes
	randomNotes = this.cards
		.sort(() => Math.random() - Math.random())
		.slice(0, 3);
	console.log("random notes", randomNotes);
	rows.value[3] = randomNotes;
});
</script>

<style scoped>
h2 {
	color: lightcoral;
}

.card {
	border: 1px solid #ddd;
}
</style>
