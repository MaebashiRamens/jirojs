/**
 * Formatter — テキスト内の二郎コール文字列を検出・整形する機能
 *
 * ## ステータス: 設計のみ（未実装）
 *
 * ## ユースケース
 *
 * ```
 * 入力: "今日はヤサイ増し増しニンニク、脂多めで頼んだ"
 * 出力: "今日はヤサイマシマシニンニクアブラマシで頼んだ"
 * ```
 *
 * ## API 設計
 *
 * ```ts
 * interface FormatOptions {
 *   delimiter?: string;  // トッピング間のデリミタ（デフォルト: "" = なし）
 *   sort?: boolean;      // トッピングを正規順にソートするか（デフォルト: false）
 * }
 *
 * // コール文字列単体を正規化
 * function formatCall(input: string, options?: FormatOptions): string;
 *
 * // テキスト中のコール文字列を検出・正規化
 * function formatText(input: string, options?: FormatOptions): string;
 * ```
 *
 * ## 必要な拡張: 位置追跡トークナイザ
 *
 * 現在のトークナイザは位置情報を保持しない。フォーマッタには各トークンの
 * 元テキスト内でのオフセット情報が必要:
 *
 * ```ts
 * interface LocatedToken {
 *   token: Token;
 *   start: number;  // 元テキスト内の開始位置
 *   end: number;    // 元テキスト内の終了位置
 * }
 *
 * function tokenizeWithLocation(input: string): LocatedToken[];
 * ```
 *
 * ## コール文字列の検出アルゴリズム
 *
 * 1. 位置追跡トークナイザでテキスト全体をスキャン
 * 2. トッピング / モディファイア / デリミタの連続区間（ラン）を検出
 * 3. 各ランの開始〜終了位置を特定
 * 4. ランを parse → evaluate → decode で正規化
 * 5. 元テキストの該当区間を正規化結果で置換（後ろから置換して位置ズレを回避）
 *
 * ## 課題
 *
 * - **偽陽性**: 「一味違う」のような一般テキストに含まれるトッピング名の誤検出
 * - **境界判定**: コール文字列の開始・終了位置の正確な判定
 *   （最低1つのトッピングトークンを含むランのみを対象にする）
 * - **部分マッチ**: テキスト中の認識不能文字の扱い（スキップ vs ラン終了）
 */
