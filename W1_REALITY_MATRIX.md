# W1 — Reality matrix / 設計審査用

2026-11-05 / 固定版 `1c38bf35c254a891200d3cedecfd57abebe83d8d`

## 証拠の境界

収録と実描画、遮蔽、医学的正確性を別に扱う。`PRESENT_VERIFIED` は本試験で対象セットの実3D画像を取得できたという意味で、全メンバーの医学的承認ではない。`HIDDEN_BUT_PRESENT` はUIの表示セット外。`PRESENT_BUT_OCCLUDED` は別構造に遮られた状態で、一般的な自動判定は実装しない。画面は未判定の遮蔽を `UNVERIFIED` と明記する。ロード中は `PRESENT_BUT_NOT_RENDERED` と表示。

完全な候補一覧・概念ID・全mesh ID・メンバー実名・system・chunk・頂点数は **W1_MESH_DIAGNOSTICS.json**。実アプリの「対象mesh JSON」でも現在のmanifestから出力できる。親概念と左右概念が同じmeshを参照する場合は描画セットを重複排除する。

## FACE

| 対象 | 収録/mesh | 描画・遮蔽・限界 |
|---|---|---|
| orbicularis oculi / orbicularis oris | 概念名・候補mesh未発見 | NOT_FOUND_IN_FIXED_MANIFEST。眼球運動筋を眼輪筋の代替としない |
| zygomaticus major / minor | 同上 | NOT_FOUND_IN_FIXED_MANIFEST |
| buccinator / frontalis | 同上 | NOT_FOUND_IN_FIXED_MANIFEST |
| temporalis / masseter（咀嚼筋） | 同上 | NOT_FOUND_IN_FIXED_MANIFEST |
| 左広頸筋 | FMA45740 / FJ1558 | PRESENT_VERIFIED（筋のみ画像）。顔面表情筋全体の代替ではない |
| 右広頸筋 | FMA45739 / FJ1587 | PRESENT_VERIFIED（筋のみ画像） |
| 左右眼瞼挙筋 | FMA49049 / FJ1306、FMA49048 / FJ1357 | 収録、頭部セットで描画。個別単独像・医学精度は未検証 |
| 眼球運動筋 | 12 mesh。例 FMA49051/FJ1294、FMA49050/FJ1345 | 収録、頭部セットで描画。表情筋とは分類を分ける |
| skull | FMA46565のうちskeletalに属する20 mesh | 頭蓋骨ON/OFFの実画像あり。元の概念43 elementsから骨系統だけを抽出 |

候補検索は指定英語名のcase-insensitive部分一致をconceptsに実行し、実partsのmuscular所属を確認する。8検索語は不一致、ヒットした親/左右概念を含め47診断行、重複排除した頭部周辺筋は18 mesh。これは全顔面筋の網羅性を示さない。固定manifest外の別名辞書や外部モデルにまで「存在しない」と一般化しない。

## VISCERA

| 対象実名 | 概念 | 全参照mesh数 / プリセット内数 | 観察 |
|---|---|---:|---|
| right lung | FMA7309 | 156 / 53 | 主に気管支・血管。肺実質全体の外形を確認できず。名称だけで完全な肺を表示したとしない |
| left lung | FMA7310 | 124 / 45 | 同上 |
| heart | FMA7088 | 83 / 17 | 心臓の形状が正面・斜め画像で見える。関連血管等を含む集合 |
| liver | FMA7197 | 60 / 15 | 尾状葉FJ2816と胆管等。完全な肝臓外形を確認できず、単なる遮蔽と決めつけない |
| stomach | FMA7148 | 1 / 1（FJ2564） | PRESENT_VERIFIED。胃の形状を正面・斜め画像で確認 |
| small intestine | FMA7200 | 56 / 56 | 集合の実形状を確認。独立臓器56個という意味ではない |
| large intestine | FMA7201 | 8 / 8 | 集合の実形状を確認。小腸概念とFJ2599を共有 |
| right kidney | FMA7204 | 1 / 1（FJ3147） | 収録・表示セット内。前面の他臓器による遮蔽の可能性あり、単独像は未取得 |
| left kidney | FMA7205 | 1 / 1（FJ3145） | 同上 |

プリセットはdigestive 97 / respiratory 119 / cardiac 23 / urinary 6、合計245 parts。筋肉・骨格・外皮を含めない。概念をIsolateした場合はその実elements全体を選ぶため、関連血管等も含む。詳細のmesh IDに実メンバー名を併記した。全臓器の完全性は未承認。

## DEEP TRUNK / MATERIAL

| 実名 | Concept | Mesh | 証拠 |
|---|---|---|---|
| right serratus posterior inferior | FMA13405 | FJ1541 | MATERIAL A/Bの単独像・左右ペア像 |
| left serratus posterior inferior | FMA13406 | FJ1541M | 左右ペアIsolate実画像 |
| right psoas major | FMA22342 | FJ1431 | 単独Isolate実画像・選択ID一致 |
| left psoas major | FMA22343 | FJ1431M | 深部セットで描画。W1単独Isolate未検証 |
| diaphragm | FMA13295 | FJ3131 | 単独Isolate実画像・選択ID一致 |
| right serratus posterior superior | FMA13403 | FJ1542 | 深部セットで描画。単独Isolate未検証 |
| left serratus posterior superior | FMA13404 | FJ1542M | 深部セットで描画。単独Isolate未検証 |
| 胸腰筋膜前・中・後層 | 該当なし | 該当なし | 3D形状未収録／将来の専門追加対象。Z-Anatomyは取り込まない |

識別色は教学上の区別用で組織の実色ではない。後面では下後鋸筋が深部の一部を覆う。分離や側面切替で観察できるが、画像近接から付着・張力・筋膜連続性を創作しない。

## 不変性

`node scripts/w1-verify.mjs --export` で2234一意mesh / 3432概念 / 15chunks、9つの確定anchor、manifestとモデルのGit差分なし、lockfile SHA一致を検査。既存法線・座標・ジオメトリ・FMA/FJ対応は変更なし。G0商用利用 / G4医学精度 / G5認証・会員公開は未承認。
