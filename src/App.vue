<template>
	<h2>The Learn Patience</h2>
	<div v-for="row in rows" class="row">
		<div v-for="card in row" :key="card" class="card">
			<div id="front">
				<p>{{ card.front }}</p>
				<button
					v-if="!card.revealed && activeCard == card.front"
					@click="card.revealed = true"
				>
					Reveal
				</button>
			</div>
			<div id="back" v-if="card.revealed">
				<p>---</p>
				{{ card.back }}
				<div class="button-row">
					<button @click="handleWrong(card)">Wrong</button>
					<button @click="handleRight(card)">Correct</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="tsx">
import Hello from "./Hello";
import Hi from "./Hi.vue";
import { ref, watch } from "vue";
import { Transition } from "vue";

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
		if (tags.filter((tag) => tag.tag === "#ux_vr").length > 0) {
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

					// remove every word starting with # (words are separated by spaces, dashes do not end words)
					front = front.replace(/#\w+/g, "");
					back = back.replace(/#\w+/g, "");

					return {
						front: front,
						back: back,
						revealed: false,
					};
				})
		)
	);
};

const handleRight = (card) => {
	card.revealed = false;
	// remove from current array, and add to the array above
	const currentRowOfCard = rows.value.findIndex((row) => row.includes(card));
	const currentRowIndex = rows.value[currentRowOfCard].indexOf(card);
	rows.value[currentRowOfCard].splice(currentRowIndex, 1);
	rows.value[currentRowOfCard - 1].push(card);
};

const handleWrong = (card) => {
	card.revealed = false;
	// remove from current array, and add to the last array, at the end
	const currentRowOfCard = rows.value.findIndex((row) => row.includes(card));
	const currentRowIndex = rows.value[currentRowOfCard].indexOf(card);
	rows.value[currentRowOfCard].splice(currentRowIndex, 1);
	rows.value[3].push(card);
};

console.log("only content", this.cards);
let rows = ref([[], [], [], []]);
console.log("relevant row", rows.value);

const activeCard = ref(null);

generateCards().then(() => {
	// fill last row with 3 random notes
	randomNotes = this.cards
		.sort(() => Math.random() - Math.random())
		.slice(0, 3);
	console.log("random notes", randomNotes);
	rows.value[3] = randomNotes;
	// remove those 3 notes from the cards array
	randomNotes.forEach((note) => {
		const index = this.cards.indexOf(note);
		this.cards.splice(index, 1);
	});

	activeCard.value = rows.value[3][0].front;
});

// watch the last row of rows, and if it has less than 3 cards, add a new one
watch(
	() => rows,
	() => {
		if (rows.value[3].length < 3) {
			const newCard =
				this.cards[Math.floor(Math.random() * this.cards.length)];
			rows.value[3].push(newCard);
			const index = this.cards.indexOf(newCard);
			this.cards.splice(index, 1);
		}
		// if row[0] has 7 cards or more, activate its leftmost card
		if (rows.value[0].length >= 7) {
			activeCard.value = rows.value[0][0].front;
		}
		// row row[1] has 5 cards or more, activate its leftmost card
		else if (rows.value[1].length >= 5) {
			activeCard.value = rows.value[1][0].front;
		}
		// if row[2] has 5 cards are more, activate its leftmost card
		else if (rows.value[2].length >= 5) {
			activeCard.value = rows.value[2][0].front;
		} else {
			// by default, activate last row leftmost card
			activeCard.value = rows.value[3][0].front;
		}
	},
	{ deep: true }
);
</script>

<style scoped>
h2 {
	color: lightcoral;
}

.card {
	border: 1px solid #ddd;
	display: grid;
	place-items: center;
}

#front {
	display: grid;
	place-items: center;
}

.row {
	display: flex;
	gap: 8px;
	margin-bottom: 8px;
	min-height: 120px;
}

.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
</style>
