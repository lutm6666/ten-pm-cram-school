# 國中線時序、入場與物件朝向修正

日期：2026-10-13。分支：`art-overhaul-phase2`。基準：`3ce4d3b55b5da8bab32c171bc030fcd18d72c4a7`。不合併 main。

問題依據是「新項目盤點」最新兩張截圖：18:02 主任室出現「大家鑽到桌子底下」的地震結果；18:13 國中置物區出現緊貼的入場隊列。另檢查前一則指出的櫃子朝向與入口消失。

## 原因與修正

- 國中線在 j_room 後的 18:00 備課時段可抽到地震。openStep 原本花兩分鐘，結果出現在 18:02 是正常的遊戲時鐘；真正的矛盾是所有地點共用「全班躲桌下」的文字、人物沒有掩護動作，以及先描述地震已停才讓玩家選應對。
- 地震現在依玩家所在區域、同區域四單位內實際在場的人決定描述。晃動中的對話先讓玩家選擇；掩護選項使玩家與附近角色蹲低護頭，結果確認後才恢复姿勢。對話期間暫停入場及環境巡走；返回主頁、重新開始與續玩會清理暫時姿勢。三個選項的數值效果維持原樣。
- 原入場排程在劇情跳時後只間隔 0.1–0.12 秒釋放角色，背景角色共用入口、速度與路徑，沒有動態碰撞。實際抽樣可出現角色座標完全相同。原本已有腿部動畫，因此不是完全缺少動畫程式。
- 入口現在至少隔 1.6 真實秒放行，入口附近有人則等待；背景生依遊戲到班時刻排序，速度略有差異。腳步相位由實際移動距離推進，停下讓行時停止步進。前方角色過近時讓行或繞路，受桌角阻擋時重新尋路，最後一段只允許進入自己的椅子。沒有路徑時不再直接瞬移到目的地。
- 排隊中的主線 NPC 保留目的地導航，但抵達前仍不可互動。18:30 既有坐定補進度與 C 班九人檢查保留。18:10 手機籃文字改為同學陸續放入，避免宣稱還沒到齊時已有八支手機。
- 國中置物櫃門面改朝西側置物區；B/C 班教材櫃、自習室書櫃朝室內；冰箱朝休息室中央。修正尺寸軸而非讓整排櫃子超出原占地。入口牆留出門洞、補門框與門檻，把招生牌移至門框上方；C 班門洞補門柱與門檻。

## 實際瀏覽器與截圖

使用 Playwright Chromium 129、真正 Three.js r128 / WebGL，桌面 1280×800，窄螢幕 375、390、430×844。修正前讀取上述完整基準 commit 的 index.html，修正後讀取本分支重新建置的 index.html。瀏覽器錯誤陣列皆空。

地震重現從角色選單開始，實際按「帶我去」走到影印機及主任室、閱讀對話與選擇。唯一事件夾具是把該輪隨機事件固定為備課地震，沒有傳送或跳步取得 18:02 結果。

入場壓力測試另明確設定遊戲時鐘為 18:13、凍結遊戲時鐘、調整玩家位置與鏡頭，觀察六十秒真實移動，避免 18:30 坐定補進度掩蓋入場缺陷。因此這組截圖是可重複的瀏覽器情境，不冒稱全程人工遊玩。之後實際以 UI 導航完成阿翔交手機與 C 班開課。

| 項目 | 修正前 | 修正後 |
|---|---|---|
| 18:02 地震 | [前](phase2-regression-evidence/before-quake-1802.png) | [後](phase2-regression-evidence/after-quake-1802.png) |
| 入場隊列 | [前](phase2-regression-evidence/before-arrival-queue.png) | [後](phase2-regression-evidence/after-arrival-queue.png) |
| 置物櫃朝向 | [前](phase2-regression-evidence/before-lockers.png) | [後](phase2-regression-evidence/after-lockers.png) |
| 主入口 | [前](phase2-regression-evidence/before-entrance.png) | [後](phase2-regression-evidence/after-entrance.png) |

入場抽樣檢查：背景角色間距至少 0.64（實測約 0.66 或更大），有腿部步态，未穿牆；七名 C 班背景生都坐定、阿翔及子晴到定點，沒有殘留行走路徑。另測對向會車、桌角脫困、停止時步態相位不推進，以及上課地震三種選項及姿勢清理。

## 建置與 Playwright

- `build.py` 正式頁與 stub 測試頁建置、`git diff --check` 通過。
- consistency：到場、可互動、安親八人、18:20 交接、C 班九人與坐定通過。
- play2：第一天 teacher 0、yun 1、boss 2、care 0/2、jh 0/1，以及第二天 teacher 1、yun 2、boss 0、care 1、jh 2，均到結局且無瀏覽器錯誤。
- play3：teacher+yun+boss 1，包含支線、三條線結局與一個月後入口通過。
- resume：步驟、時鐘、日誌恢復一致、結局完成、結束後無續玩入口通過。extras：閒聊、加班小遊戲、設定通過。
- 加長自動測試的 NPC 等候窗口，使測試能等自然進場；仍須真正抵達才成功。play3 與 resume 補上結局和錯誤斷言，並處理 NPC 暫時巡走、對話結束後直接到結算的情況，沒有移除到場判定。

重跑實際 WebGL 回歸：先 `npm install`、`npx playwright install chromium`、`python3 build.py`，再 `npm run test:phase2`。第一次會下載 Three.js；可用 `THREE_FILE` 指定已下載的檔案，`OUT` 指定證據輸出目錄。修正前可指定 `TAG=before` 與 `BASELINE_REF=3ce4d3b55b5da8bab32c171bc030fcd18d72c4a7`。Windows 本次以已安裝 Python 路徑及 PowerShell 環境變數執行相同測試矩陣。

## 尚未驗證

沒有實體 iPhone、Safari、Android、真實觸控、雙指操作或行動 GPU 效能驗收；窄螢幕 Chromium 不能替代這些結果。没有逐條人工玩完所有職業／選項或所有 NPC 姿勢與視角。GitHub Actions 與遠端預覽結果須以推送後對應修正 SHA 的執行結果確認。
