# 晚上十點下課

補習班打工人的一個晚上。一款 3D 網頁小遊戲，靈感來自晶圓廠打工遊戲 fab24hr，把場景換成台灣的補習班。

打開 `index.html` 就能玩，不用安裝。手機、電腦都可以。

## 玩法

- 選一個位子：**數學老師**、**櫃台班導**或**補習班主任**。三個位子是同一個晚上，看到的事情不一樣。
- 從 17:20 撐到晚上十點。跟著頭上有紅色「！」的人走，或按「帶我去」。
- 上下課照時鐘：18:30 上課、19:50 下課、20:05 上第二節、21:15 下課，鐘一響學生就會移動。
- 時鐘會走。每件事都有期限，遲到會有後果。認真把東西撿齊時間是夠的，到處閒晃才會遲到。
- 頭上有黃色「？」的人有支線；地上有金色星星在閃的地方有東西可以撿，上課前、上課中、下課、下課後出現的東西都不一樣；有「i」的地方可以看說明。
- 每一輪會隨機發生兩件事，例如地震、停電、下雨、外送珍奶。
- 走到重要人物旁邊可以「聊聊」，主線對話結束時也可以按「多聊幾句」。可以點選問題，也可以自己打字問（會用關鍵字找最接近的一題）；回答會隨上課前、上課中、下課、放學後改變。第一次跟某人聊會有一點小影響。
- 十點前後還有延遲下班的事：沒人接的學生、深夜的家長群組、主任的「五分鐘就好」……要不要加班自己決定，加班時間會記在結算裡。
- 三個位子都玩過，會解鎖「一個月後」。

右上角「設定」可以調音樂、環境音、音效的音量，時間流速（悠閒／標準／緊湊）、拖曳靈敏度、鏡頭距離和字體大小。

玩完可以產生「成績卡」圖片分享。GitHub Pages 版可以「加到主畫面」，像 App 一樣全螢幕開啟，玩過一次之後沒網路也能開。

操作：WASD／方向鍵或點地板走路，E 互動。拖曳畫面可以轉視角（上下拖改俯角），雙指或滾輪縮放，Q/R 旋轉，「⟲」讓視角歸位。手機有方向鍵。

## 內容

| | 數量 |
|---|---|
| 職業線 | 3 條，每條 11–12 個場景，各有 6–7 種結局 |
| 小遊戲 | 12 個：修卡紙、批考卷、擦白板、暖身搶答、安撫家長、電話分流、點名、續班名單、排班表、巡樓關燈、回群組訊息、陪學生等家長 |
| 支線 | 11 條 |
| 撿到的東西 | 16 樣，依時段出現，部分只有特定職業撿得到 |
| 隨機事件 | 6 種，另有 6 種延遲下班事件 |
| 閒聊 | 9 個人物，48 個問題，回答隨時段變化 |
| 成就 | 18 個 |

## 專案結構

```
src/
  common.js        人物、名詞、說明點、跨線記憶
  world.js         3D 樓層、人物模型與動作、尋路
  life.js          學生上下課、NPC 日常動作、對話泡泡、特效
  atmos.js         夜景、環境音、鐘聲、雨
  minis.js         小遊戲
  events.js        隨機事件
  overtime.js      延遲下班事件與加班小遊戲
  chats.js         跟人物閒聊
  ach.js           成就
  line_teacher.js  數學老師線
  line_yun.js      櫃台班導線
  line_boss.js     補習班主任線
  items.js         撿到的東西
  sides.js         支線
  engine.js        遊戲流程、對話、介面、存檔
  settings.js      設定（音量、時間流速、視角、字體）
  share.js         成績卡、PWA 註冊
  boot.js          啟動
  style.css / shell.html
build.py           把 src 打包成單一的 index.html
index.html         打包好的遊戲
manifest.webmanifest、sw.js、assets/   主畫面圖示、分享預覽圖、離線快取
tests/             自動遊玩測試
```

3D 使用 [three.js r128](https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js)（CDN 載入）。

## 建置

```bash
python3 build.py                          # 產生 index.html（GitHub Pages 用，含手機 viewport 設定）
python3 build.py --artifact https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js artifact.html  # 給 Claude 頁面用
python3 build.py stub.js tests/test.html  # 產生測試用頁面（用替身取代 three.js）
```

## 測試

測試會用 Playwright 開瀏覽器，自動跑完三條職業線、檢查每個目標都走得到、小遊戲能完成、能玩到結局，也會測中途存檔和「一個月後」。

```bash
npm install
npx playwright install chromium
npm test
```

每次 push 和 PR，GitHub Actions 都會自動跑一次（`.github/workflows/test.yml`）。

測試用 `tests/stub.js` 取代 three.js，所以只能驗證遊戲邏輯。實際畫面由另一個 workflow（`.github/workflows/screenshots.yml`）用真的 three.js 在手機與桌面尺寸截圖，推到 `ci-screenshots` 分支。

## 說明

補習班、人物、數字與情節都是虛構的遊戲設定，不代表任何一家補習班。
