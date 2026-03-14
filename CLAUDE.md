# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Links

- [Nix Language](docs/guides/nix-language.md) - Language quick reference, anti-patterns, flake/treefmt patterns
- [Nix Troubleshooting](docs/troubleshooting/nix-common-issues.md) - Debug commands, common issues, validation checklist

## Project Overview

`jirojs` is a TypeScript library that parses Ramen Jiro (ラーメン二郎) call strings (コール文字列). It takes a string like `"ヤサイマシマシニンニクアブラカラメ"` and outputs a structured representation of each topping and its modifier.

## Development Environment

- **Node.js and pnpm versions are managed by Nix** via `flake.nix`
- Enter the dev shell: `nix develop` (or use direnv with `use flake` in `.envrc`)
- Install dependencies: `pnpm install`

## Build & Commands

```sh
pnpm build        # Build with tsup (outputs dist/ with ESM .mjs + CJS .cjs + .d.ts)
pnpm test         # Run tests with vitest
pnpm lint         # Type-check with tsc --noEmit
nix fmt           # Format all files (biome for TS/JS/JSON, nixfmt for .nix). ALWAYS use this, never bare `treefmt`
```

## Architecture

### Build System

- **tsup** for bundling (NO webpack). Dual ESM/CJS output with `.mjs`/`.cjs` extensions.
- `package.json` has `"type": "module"` and uses the `"exports"` field for dual format.
- Source lives in `src/`, build output in `dist/` (gitignored).

### Formatting & Linting

- **`nix fmt`** is the ONLY correct way to format. It invokes treefmt via the flake with the correct config.
- **Biome** handles TypeScript/JavaScript/JSON formatting and linting (replaces ESLint + Prettier).
- **nixfmt** handles `.nix` file formatting.
- Biome configuration is in `biome.json` at root; treefmt integration is in `treefmt.nix`.
- `nix flake check` verifies formatting in CI.

### Nix Integration

- `flake.nix` provides devShell with: nodejs, pnpm, typescript, typescript-language-server, treefmt wrapper
- treefmt-nix is used to configure formatters declaratively via `treefmt.nix`
- `nix fmt` = project-wide formatting (ALWAYS use this), `nix flake check` = CI formatting check

## Essential Rules

1. **Development environment**: Always use `nix develop` (or direnv) for a reproducible environment
2. **ALWAYS format with `nix fmt`** before committing. This runs the flake's treefmt wrapper (Biome for TS/JS/JSON + nixfmt for .nix). **NEVER use bare `treefmt` or run biome/nixfmt directly** — bare `treefmt` may resolve to a different binary that only formats `.nix` files, silently skipping all TS/JS/JSON. `nix fmt` is the ONLY safe command:

   ```bash
   nix fmt
   ```

3. **ALWAYS validate** after any `.nix` file change:

   ```bash
   nix flake check
   ```

4. **Run tests** after code changes:

   ```bash
   pnpm test
   ```

## Nix Anti-Patterns to Avoid

- Avoid `rec { }` → use `let ... in` instead (prevents infinite recursion)
- Avoid top-level `with` statements (obscures scope, hides bugs)
- Avoid lookup paths `<...>` → use flake inputs (ensures reproducibility)
- Always quote URLs (RFC 45)

## Domain: Jiro Call Parsing

### Call System

At Ramen Jiro, when staff asks 「ニンニク入れますか？」, the customer responds with a concatenated string of topping+modifier pairs. The parser must handle delimiter-free concatenation.

### Core Toppings (Direct Jiro / 直系)

| Topping | Aliases | Default |
| --------- | --------- | --------- |
| ニンニク (garlic) | — | Not included |
| ヤサイ (vegetables) | 野菜 | Included at standard amount |
| アブラ (fat) | 脂 | Included at standard amount |
| カラメ (soy tare) | — | Not included |

### Extended Toppings (Jiro-inspired / インスパイア)

ショウガ/生姜, 辛揚げ, 辛玉, ガリマヨ, 一味, 削り節, ラー油

### Modifiers (least to most)

| Modifier | Aliases | Meaning |
| ---------- | --------- | --------- |
| ナシ | 抜き, なし | Remove |
| 少なめ | スクナメ, 少し, ちょっと | Less |
| ちょいマシ | — | Slightly more |
| (none) | 普通 | Standard/add |
| マシ | 多め, 増し | More |
| マシマシ | ダブル, 増し増し | Much more |

Shop-specific: カラカラ (豚山), 限界盛り (麺でる), チョモランマ (rare)

### Aggregate Modifiers

- `全マシ` / `全部マシ` = all toppings at マシ
- `全マシマシ` / `全部マシマシ` = all toppings at マシマシ
- `そのままで` = no garlic, everything else standard

### Parser Challenges

1. Toppings and modifiers concatenate without delimiters: `ヤサイマシマシニンニクアブラカラメ`
2. `マシマシ` must be greedily matched before `マシ`
3. `カラメ` (topping) contains characters that could be confused with modifier patterns
4. Delimiters are optional (none, comma `、`, space)
5. Noodle options (`麺少なめ`, `麺半分`, `麺硬め`) are separate from the main call

### Approximate Grammar

```txt
Call        := "そのままで" | AggregateModifier | ToppingList
AggregateModifier := ("全" | "全部") ("マシ" | "マシマシ")
ToppingList := ToppingSpec (Delimiter? ToppingSpec)*
ToppingSpec := Topping Modifier?
Delimiter   := "、" | " "
```

## Publishing

```sh
pnpm publish --access public    # Package: jirojs
pnpm pack --dry-run             # Preview package contents before publishing
```

Validate before publishing with `publint` and `@arethetypeswrong/cli` (`attw --pack .`).
