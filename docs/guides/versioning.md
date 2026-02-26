# バージョン管理ガイド

このプロジェクトでは [changesets](https://github.com/changesets/changesets) を使ってバージョン管理とリリースを行います。

## リリースフロー

```
pnpm changeset → push → [version.yml] Version PR 自動作成
                                        ↓ PR マージ
                        [version.yml] タグ作成 + push
                                        ↓
                        [publish.yml] npm publish (OIDC)
```

1. 変更を加えたら `pnpm changeset` で changeset ファイルを作成
2. master に push すると **version.yml** が Version Packages PR を自動作成
3. Version PR をマージすると、タグが自動で作成・push される
4. タグ push をトリガーに **publish.yml** が npm publish を実行

## Changeset の作成

```sh
pnpm changeset
```

対話的プロンプトで以下を指定します:

- **対象パッケージ**: 変更したパッケージを選択
- **バージョン種別**: patch / minor / major
- **変更の要約**: CHANGELOG に記載される説明文

### バージョン種別の選び方

| 種別 | 使い所 |
|------|--------|
| patch | バグ修正、内部リファクタ |
| minor | 新機能追加 (後方互換) |
| major | 破壊的変更 |

## パッケージのリンク

jirojs, jiro-cli, jiro-repl はリンク設定されており、いずれかのパッケージで minor/major バージョンが上がると、他のパッケージも同じバージョンに揃えられます。

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `pnpm changeset` | 新しい changeset を作成 |
| `pnpm version-packages` | changeset を適用してバージョンと CHANGELOG を更新 |
| `pnpm release` | 全パッケージを npm に publish |

## CI ワークフロー

### version.yml

- **トリガー**: master への push
- changeset ファイルがある場合 → Version Packages PR を作成/更新
- changeset ファイルがない場合 (Version PR マージ直後) → 各パッケージのバージョンからタグを作成して push

### publish.yml

- **トリガー**: `v*` タグの push
- Trusted Publishing (OIDC) で npm に全パッケージを publish
- GitHub Release を自動作成
