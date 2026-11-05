# W1 Visual Comparisons

2026-11-05 / 設計審査用。実ブラウザから取得した画像のみ。画像10枚は別添 `W1-review-bundle.zip` の `images/` に保存。生成画像・外部3Dモデルなし。

## 実キャプチャ

|画像|確認対象|
|---|---|
|w1-face-ready.png|FACE: 頭蓋骨と実在する18頭頸部筋meshの表示セット|
|w1-face-muscles.png|FACE: 同じ視点で頭蓋骨OFF。目周囲の筋と広頸筋を表示|
|w1-viscera-front.png|VISCERA: 外皮・骨格・表層筋OFFの正面|
|w1-viscera-oblique.png|VISCERA: 同セットの斜め|
|w1-trunk-back.png|DEEP TRUNK: 7構造の後面、識別色|
|w1-psoas-isolated.png|右大腰筋 FJ1431 の選択・Isolate|
|w1-trunk-pair-confirmed.png|左右下後鋸筋 FJ1541 / FJ1541M のペア選択・Isolate|
|w1-diaphragm-isolated.png|横隔膜 FJ3131 の選択・Isolate|
|w1-material-a.png|FJ1541 BASELINE|
|w1-material-b.png|同一FJ1541 MATERIAL TEST|

FACE/VISCERA/A/Bの画像取得後、カメラ復元処理と説明文を追加。VISCERAは全表示対象を収める初期フレーミングにも変更。これらの画像は取得時点の実装証拠で、最終版の全ピクセル一致を示すものではない。DEEP TRUNKのペア・横隔膜画像はその後取得。

## A/B条件

同じFJ1541、頂点・法線・形状は変更なし。カメラ固定。実キャプチャのカメラ座標とtargetを比較し一致を確認。筋の色・光源・露出1.12は同一。BASELINE: roughness 0.53 / metalness 0.08 / envMapIntensity 1.0。TEST: 0.82 / 0 / 0.45。筋線維の復元ではない。優劣・医学的精度は未承認。

画面内「現在の3D比較画像を保存」でセッション内に画像を並べ、PNGとカメラ条件JSONを個別に保存できる。対象ID・カメラ・FOV・aspect・drawCalls・triangles・pixelRatio・chunk数を記録する。永続サーバ保存は未実装。

## 動作結果と制約

- 1439×1176、light、開発Vite、WebGL2 / SwiftShaderの実ブラウザ。
- 4シーンへの切替、15 chunkロード完了、FACEの頭蓋骨切替、VISCERA正面/斜め、材質A/B、右大腰筋と横隔膜Isolate、下後鋸筋ペア選択を確認。
- 画像保存ボタンから実画像が追加されることを確認。ダウンロード全操作のE2E検証は未実施。
- 選択IDはFMA/FJ対応と照合。全対象のクリック操作・カメラ復元・全身復帰・全プリセットの完全回帰は未完了。
- 最後の横隔膜キャプチャは保存済み。その後の側面操作中にブラウザコマンドが失敗し、追加画像取得は停止。側面最終確認と390pxモバイル検証はBLOCKED/未実施。
- 初回ロード完了待機はタイムアウトしたが、後続チェックで全15 chunkロード済みを確認。正確な総ロード時間・GPU FPS・実機性能は未測定。バッチ実装は維持され、部分表示でも全chunkをロードする。性能改善を実証したとは扱わない。
- 型検査・ビルド・manifest回帰はPASS。これらは視覚・医学的検証の代替ではない。

## 審査状態

4画面の試作は実装済み。完全な動作検証PASSではない。G0/G4/G5未承認。本番公開せず設計審査で停止。
