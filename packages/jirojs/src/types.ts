/** Core toppings available at direct Jiro (直系) shops */
export type CoreTopping = "ニンニク" | "ヤサイ" | "アブラ" | "カラメ";

/** Extended toppings found at Jiro-inspired (インスパイア) shops */
export type ExtendedTopping =
	| "ショウガ"
	| "辛揚げ"
	| "辛玉"
	| "ガリマヨ"
	| "一味"
	| "削り節"
	| "ラー油";

/** All recognized toppings */
export type Topping = CoreTopping | ExtendedTopping;

/** Modifiers from least to most, in canonical form */
export type Modifier = "ナシ" | "少なめ" | "ちょいマシ" | "普通" | "マシ" | "マシマシ";

/** Noodle-specific options (separate from the topping call) */
export type NoodleOption = "少なめ" | "半分" | "硬め";

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

export interface ToppingToken {
	type: "topping";
	value: Topping;
	raw: string;
}

export interface ModifierToken {
	type: "modifier";
	value: Modifier;
	raw: string;
}

export type AggregateModifier = "全マシ" | "全マシマシ";

export interface AggregateToken {
	type: "aggregate";
	value: AggregateModifier;
	raw: string;
}

export interface SonomamaToken {
	type: "sonomama";
	raw: string;
}

export interface NoodleToken {
	type: "noodle";
	value: NoodleOption;
	raw: string;
}

export interface DelimiterToken {
	type: "delimiter";
	raw: string;
}

export type Token =
	| ToppingToken
	| ModifierToken
	| AggregateToken
	| SonomamaToken
	| DelimiterToken;

// ---------------------------------------------------------------------------
// AST
// ---------------------------------------------------------------------------

export type CallNode = SonomamaNode | AggregateNode | ToppingListNode;

export interface SonomamaNode {
	type: "sonomama";
}

export interface AggregateNode {
	type: "aggregate";
	modifier: "マシ" | "マシマシ";
}

export interface ToppingListNode {
	type: "topping_list";
	items: ToppingSpecNode[];
}

export interface ToppingSpecNode {
	type: "topping_spec";
	topping: Topping;
	modifier: Modifier;
}

export interface NoodleNode {
	type: "noodle";
	option: NoodleOption;
}

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------

export interface CallResult {
	toppings: ToppingResult[];
}

export interface ToppingResult {
	topping: Topping;
	modifier: Modifier;
	level: number;
}

export interface NoodleResult {
	option: NoodleOption;
}
