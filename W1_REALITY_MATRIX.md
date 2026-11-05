# W1 Reality Matrix

固定ソース: `1c38bf35c254a891200d3cedecfd57abebe83d8d`。設計審査用、医療的精度・商用利用・認証公開は未承認。

機械可読の全対象実名・FMA/FJ・parts名は `W1_MESH_DIAGNOSTICS.json`。収録判定と実描画確認は別。描画対象として送信されたことは画面内で遮蔽されず見えることを保証しない。遮蔽は自動判定せずUNVERIFIEDとする。

|領域|対象|概念 / mesh|収録・描画証拠|制約|
|---|---|---|---|---|
|FACE|orbicularis oculi / oris, zygomaticus major / minor, buccinator, frontalis, temporalis, masseter|実名候補検索で該当なし|NOT_FOUND_IN_FIXED_MANIFEST|名称照合の結果であり、別名を含む網羅的解剖監査ではない|
|FACE|platysma、levator palpebrae superioris、眼球運動筋|全IDはJSON。重複排除18 meshes|頭蓋骨ON/OFFで実キャプチャ取得|眼球運動筋を表情筋として扱わない。個別全18件の視覚検証は未実施|
|FACE|skull|skeletal所属20 meshes、全IDはJSON|頭蓋骨切替の視覚証拠あり|頭蓋骨非表示と遮蔽の厳密判定は同義ではない|
|VISCERA|肺、心臓、肝臓、胃、大小腸、左右腎臓|9概念、全FMA/FJはJSON|digestive 97 / respiratory 119 / cardiac 23 / urinary 6 partsを対象に正面・斜め表示取得|parts数は臓器数ではない。肺は主に気管支・血管、肝臓は尾状葉・胆管・血管等。完全な外形を保証しない。各臓器の個別Isolateは未検証|
|DEEP TRUNK|右下後鋸筋|FMA13405 / FJ1541|A/Bと左右ペアの描画証拠あり|形状・付着の医学的精度未検証|
|DEEP TRUNK|左下後鋸筋|FMA13406 / FJ1541M|左右ペアの描画証拠あり|同上|
|DEEP TRUNK|右大腰筋|FMA22342 / FJ1431|個別Isolateの描画証拠あり|同上|
|DEEP TRUNK|左大腰筋|FMA22343 / FJ1431M|一覧・集合表示、manifest対応確認|個別Isolate未検証|
|DEEP TRUNK|横隔膜|FMA13295 / FJ3131|個別Isolateの描画証拠あり|同上|
|DEEP TRUNK|左右上後鋸筋|FMA13403 / FJ1542、FMA13404 / FJ1542M|一覧・集合表示、manifest対応確認|個別Isolate未検証|
|DEEP TRUNK|胸腰筋膜三層|対象meshなし|3D形状未収録／将来の専門追加対象|架空モデルを追加していない|

`HIDDEN_BUT_PRESENT`は現在の表示セット外、`PRESENT_BUT_NOT_RENDERED`はロード中、`MESH_MISSING`は概念に対する実part欠如を表す。ロード後の遮蔽と医学的精度はUNVERIFIED。個々の対象を実際に観察せず `PRESENT_BUT_OCCLUDED` と断定していない。
