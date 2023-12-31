<template>
	<h1>The Learn Patience</h1>
	<div class="" id="intro-modal" v-if="!learnTagSet">
		<div class="card">
			<h3>Quickstart</h3>
			<div class="flex">
				<label for="tagInput">Tag:</label>
				<div class="">
					#<input type="text" id="tagInput" v-model="learnTag" />
				</div>
				<button @click="generateCards">Let's Go</button>
			</div>
		</div>
	</div>
	<div class="" v-else>
		<meter
			id="fuel"
			min="3"
			max="150"
			low="50"
			high="100"
			:value="score"
		></meter>
	
		<div v-for="row in rows" class="row">
			<TransitionGroup name="list">
				<Card
					v-for="card in row"
					:key="card.front"
					:front="card.front"
					:back="card.back"
					:revealed="card.revealed"
					:activeCard="activeCard"
					:content="card.content"
					@handleWrong="handleWrong(card)"
					@handleRight="handleRight(card)"
				></Card>
			</TransitionGroup>
		</div>
	</div>
</template>

<script setup lang="tsx">
import Card from "./Card.vue";
import { ref, watch, computed } from "vue";
import { Transition } from "vue";

const learnTag = ref("");
const learnTagSet = ref(false);

const cards = ref([]);

// expose Markdown component to template

const generateCards = async () => {
	learnTagSet.value = true;

	// get all Obsidian notes with tag #vr
	const allNotesWithTag = app.vault.getMarkdownFiles().filter((note) => {
		let willBeIncluded = false;
		const tags = this.app.metadataCache.getFileCache(note)?.tags;
		if (tags) {
			if (
				tags.filter((tag) => tag.tag == "#" + learnTag.value).length > 0
			) {
				willBeIncluded = true;
			}
		}
		return willBeIncluded;
	});

	// pick 30 randomly
	const notes = allNotesWithTag
		.sort(() => Math.random() - Math.random())
		.slice(0, 30);

	this.cards = await Promise.all(
		notes.map(
			async (note) =>
				await this.app.vault.read(note).then((content) => {
					const splitCard = content.split("---");
					const metadata = this.app.metadataCache.getFileCache(note);

					let front = "";
					let back = "";

					try {
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
					} catch (error) {
						return {
							front: "error",
							back: "error",
							revealed: false,
							content: content,
						};
					}
				})
		)
	);

	// fill last row with 3 random notes
	randomNotes = this.cards
		.sort(() => Math.random() - Math.random())
		.slice(0, 3);
	rows.value[3] = randomNotes;
	// remove those 3 notes from the cards array
	randomNotes.forEach((note) => {
		const index = this.cards.indexOf(note);
		this.cards.splice(index, 1);
	});

	activeCard.value = rows.value[3][0].front;
};

const handleRight = (card) => {
	card.revealed = false;
	// remove from current array, and add to the array above
	// if it's in the first row, just remove  it
	const currentRowOfCard = rows.value.findIndex((row) => row.includes(card));
	const currentRowIndex = rows.value[currentRowOfCard].indexOf(card);
	rows.value[currentRowOfCard].splice(currentRowIndex, 1);

	if (currentRowOfCard == 0) {
		finishedCards.value.push(card);
	} else {
		rows.value[currentRowOfCard - 1].push(card);
	}
};

const handleWrong = (card) => {
	card.revealed = false;
	// remove from current array, and add to the last array, at the end
	const currentRowOfCard = rows.value.findIndex((row) => row.includes(card));
	const currentRowIndex = rows.value[currentRowOfCard].indexOf(card);
	rows.value[currentRowOfCard].splice(currentRowIndex, 1);
	rows.value[3].push(card);
};

let rows = ref([[], [], [], []]);
const finishedCards = ref([]);

const activeCard = ref(null);

// watch the last row of rows, and if it has less than 3 cards, add a new one
watch(
	() => rows,
	() => {
		// if cards exist
		if (this.cards.length > 0) {
			// if row[3] has less than 3 cards, add a new one
			if (rows.value[3].length < 3) {
				const newCard =
					this.cards[Math.floor(Math.random() * this.cards.length)];
				rows.value[3].push(newCard);
				const index = this.cards.indexOf(newCard);
				this.cards.splice(index, 1);
			}
		}
		// if row[0] has 7 cards or more (or rows 1,2 and 3 are empty), activate its leftmost card
		if (
			rows.value[0].length >= 7 ||
			(rows.value[1].length == 0 &&
				rows.value[2].length == 0 &&
				rows.value[3].length == 0)
		) {
			activeCard.value = rows.value[0][0].front;
		}
		// row row[1] has 5 cards or more (or rows 2 and 3 are empty), activate its leftmost card
		else if (
			rows.value[1].length >= 5 ||
			(rows.value[2].length == 0 && rows.value[3].length == 0)
		) {
			activeCard.value = rows.value[1][0].front;
		}
		// if row[2] has 5 cards are more (or row 3 is empty), activate its leftmost card
		else if (rows.value[2].length >= 5 || rows.value[3].length == 0) {
			activeCard.value = rows.value[2][0].front;
		} else {
			// by default, activate last row leftmost card
			activeCard.value = rows.value[3][0].front;
		}
	},
	{ deep: true }
);

// calculate current score by: 5 points for every finished card, 4 points for every card in row 0, 3 points for every card in row 1, 2 points for every card in row 2, 1 point for every card in row 3
const score = computed(() => {
	let score = 0;
	score += finishedCards.value.length * 5;
	score += rows.value[0].length * 4;
	score += rows.value[1].length * 3;
	score += rows.value[2].length * 2;
	score += rows.value[3].length * 1;
	return score;
});
</script>

<style scoped>
.flex {
	display: flex;
	gap: 6px;
	align-items: center;
}
h1 {
	text-align: center;
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

#intro-modal {
	display: flex;
	gap: 8px;
	flex-direction: column;
	align-items: center;
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

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
	position: absolute;
}

meter {
	width: 100%;
}

</style>
