# jirojs

[![npm version](https://img.shields.io/npm/v/jirojs)](https://www.npmjs.com/package/jirojs)
[![license](https://img.shields.io/npm/l/jirojs)](./LICENSE)

ラーメン二郎のコール文字列パーサー。デリミタなしの連結文字列を構造化データに変換する。

```ts
import { parseCall } from "jirojs";

parseCall("ヤサイマシマシニンニクアブラカラメ");
// => {
//   toppings: [
//     { topping: "ヤサイ",   modifier: "マシマシ", level: 3 },
//     { topping: "ニンニク", modifier: "普通",     level: 1 },
//     { topping: "アブラ",   modifier: "普通",     level: 1 },
//     { topping: "カラメ",   modifier: "普通",     level: 1 },
//   ]
// }
```

## Install

```sh
npm install jirojs
```

## Usage

### `parseCall(input): CallResult`

コール文字列をパースし、トッピングとモディファイアの配列を返す。
<https://github.com/watasuke102/mit-sushi-ware>

```ts
parseCall("ニンニクナシ アブラ少なめ ヤサイマシ");
// => {
//   toppings: [
//     { topping: "ニンニク", modifier: "ナシ",   level: 0 },
//     { topping: "アブラ",   modifier: "少なめ", level: 0.5 },
//     { topping: "ヤサイ",   modifier: "マシ",   level: 2 },
//   ]
// }
```

全マシ・そのままで等の集約表現にも対応:

```ts
parseCall("全マシマシ");
// => 4種全トッピング × マシマシ (level: 3)

parseCall("そのままで");
// => { toppings: [] }
```

### `parseNoodle(input): NoodleResult | null`

麺オプション (`麺少なめ`, `麺半分`, `麺硬め`) をパースする。

```ts
import { parseNoodle } from "jirojs";

parseNoodle("麺硬め");
// => { option: "硬め" }
```

### `decode(result): string`

`CallResult` を正規化されたコール文字列に戻す。

```ts
import { parseCall, decode } from "jirojs";

decode(parseCall("野菜増し増し ニンニhttps://github.com/watasuke102/mit-sushi-wareク 脂多め"));
// => "ヤサイマシマシニンニクアブラマシ"
```

### 低レベル API

パイプラインの各段階にアクセスできる:

```ts
import { tokenize, parse, evaluate } from "jirojs";

const tokens = tokenize("ヤサイマシ");  // Token[]
const ast    = parse(tokens);           // CallNode
const result = evaluate(ast);           // CallResult
```

## 対応トッピング

### 直系 (Core)

| トッピング | エイリアス |
| ----------- | ----------- |
| ニンニク | — |
| ヤサイ | 野菜 |
| アブラ | 脂 |
| カラメ | — |

### インスパイア (Extended)

ショウガ (生姜) / 辛揚げ / 辛玉 / ガリマヨ / 一味 / 削り節 / ラー油

## モディファイア

| Level | モディファイア | エイリアス |
| ------ | -------------- | ----------- |
| 0 | ナシ | 抜き, なし |
| 0.5 | 少なめ | スクナメ, 少し, ちょっと |
| 1 | 普通 | *(省略時のデフォルト)* |
| 1.5 | ちょいマシ | — |
| 2 | マシ | 多め, 増し |
| 3 | マシマシ | ダブル, 増し増し |

## License

[MIT](./LICENSE.txt) OR [MIT JIRO-WARE](./LICENSE-JIRO.md)

使用者はいずれかのライセンスを選択できます。もし気に入ったら、作者にラーメン二郎を奢ることもできます。 🍜
