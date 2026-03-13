# wf-kim-pathfinder

TypeScript CLI app to evaluate conversation paths from the `browse.wf` kimulacrum API graph.

It scores and compares paths by:

- Chemistry gain (`ChemistryDelta`)
- Thermostat gain (from `OtherDialogueInfos` tags containing `thermostat`)
- Number of boolean activations (from set/reset boolean nodes)

It also asks for boolean condition status on check nodes to resolve conditional branches.
It resolves `Content` localization keys using the dictionary API.

## Setup

```bash
pnpm install
```

## Run in dev mode

```bash
pnpm dev -- --source "https://your-api-endpoint" --dict "https://kim.browse.wf/dicts/es.json" --startId 1 --maxDepth 100 --maxPaths 5000
```

## Run all current conversation APIs (default)

```bash
pnpm dev
```

By default, the CLI first asks which chatroom (endpoint) you want to use, then lists that chatroom's conversations (all `StartDialogueNode` entries) and asks which one to simulate.
You can choose by menu option number or by `startId`.

When no `--source` is provided, the CLI uses these conversation URLs by default:

- `https://kim.browse.wf/data/AoiDialogue_rom.dialogue.json`
- `https://kim.browse.wf/data/ArthurDialogue_rom.dialogue.json`
- `https://kim.browse.wf/data/EleanorDialogue_rom.dialogue.json`
- `https://kim.browse.wf/data/FlareDialogue_rom.dialogue.json`
- `https://kim.browse.wf/data/HexDialogue_rom.dialogue.json`
- `https://kim.browse.wf/data/JabirDialogue_rom.dialogue.json`
- `https://kim.browse.wf/data/KayaDialogue_rom.dialogue.json`
- `https://kim.browse.wf/data/LettieDialogue_rom.dialogue.json`
- `https://kim.browse.wf/data/MinervaVelemirDialogue_rom.dialogue.json`
- `https://kim.browse.wf/data/QuincyDialogue_rom.dialogue.json`
- `https://kim.browse.wf/data/LoidDialogue_rom.dialogue.json`
- `https://kim.browse.wf/data/LyonDialogue_rom.dialogue.json`
- `https://kim.browse.wf/data/MarieDialogue_rom.dialogue.json`
- `https://kim.browse.wf/data/RoatheDialogue_rom.dialogue.json`

Default dictionary:

- `https://kim.browse.wf/dicts/es.json`

## Analyze multiple specific sources

```bash
pnpm dev -- \
	--source "https://kim.browse.wf/data/AoiDialogue_rom.dialogue.json" \
	--source "https://kim.browse.wf/data/ArthurDialogue_rom.dialogue.json" \
	--dict "https://kim.browse.wf/dicts/es.json"
```

## Run with local JSON file

```bash
pnpm dev -- --source "./dialogue.json"
```

## Build and run

```bash
pnpm build
pnpm start -- --source "./dialogue.json"
```

## Notes

- `--source` accepts a URL or local file path and can be repeated.
- `--dict` accepts a URL or local file path to a localization dictionary object.
- `--startId` is optional. If provided, it skips the picker and simulates that start node.
- `--maxDepth` is optional (default: `100`) and prevents infinite traversal loops.
- `--maxPaths` is optional (default: `5000`) and caps DFS expansion on very large graphs.

## Project Structure

- `src/core/pathfinder.ts` contains reusable loading, traversal, scoring, ranking, and transcript-formatting logic.
- `src/cli/app.ts` contains the readline-based CLI flow, prompts, and console output.
- `src/index.ts` is a thin entrypoint that starts the CLI app.

For a future UI, you can import the core module directly and replace the CLI prompt/output layer with components or API handlers.
