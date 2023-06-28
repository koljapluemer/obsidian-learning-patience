import {
	App,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	Component,
} from "obsidian";

import { MyView, VIEW_TYPE } from "./view";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(VIEW_TYPE, (leaf) => new MyView(leaf));

		this.addRibbonIcon("triangle", "Start Learning Patience", (evt) => {
			new TagModal(this.app, this).open();
			this.activateView();
		});
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
	async activateView() {
		if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length === 0) {
			await this.app.workspace.getLeaf(false).setViewState({
				type: VIEW_TYPE,
				active: true,
			});
		}

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
		);
	}
}

export class TagModal extends Modal {
	component: Component;

	// ask user for a tag, save, and close  modal
	constructor(app: App, component: Component) {
		super(app);
		this.component = component;
	}

	onOpen() {
		let { contentEl } = this;
		contentEl.createEl("h2", { text: "Input Tag For Learn Patience:" });
		contentEl.createEl("input", { attr: { id: "tag-input" } });
		contentEl.createEl("button", {
			text: "Start",
			attr: { id: "save-button" },
		});

		contentEl
			.querySelector("#save-button")
			.addEventListener("click", () => {
				let tag = contentEl.querySelector("#tag-input").value;
				// save tag to localstorage
				localStorage.setItem("patience-tag", tag);
				this.close();
			});
	}
}
