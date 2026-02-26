import type { Shop } from "./types";

/** 直系二郎（前橋千代田店等） — ヤサイ・アブラがデフォルト入り */
export const JIRO_DIRECT: Shop = {
	name: "直系二郎",
	defaults: { ヤサイ: 1, アブラ: 1 },
};

/**
 * ハイマウントM（前橋市）
 * - ヤサイはデフォルト入り、アブラ・ニンニクは未入り
 * - カラメのコールは存在しない（卓上カエシで調整）
 * - 増量表現は「ダブル」=マシマシ相当
 */
export const HIGHMOUNT_M: Shop = {
	name: "ハイマウントM",
	defaults: { ヤサイ: 1, カラメ: null },
};
