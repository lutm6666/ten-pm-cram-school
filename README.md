# 晚上十點下課

補習班打工人的一個晚上。一款 3D 網頁小遊戲，靈感來自晶圓廠打工遊戲 fab24hr，把場景換成台灣的補習班。

打開 `index.html` 就能玩，不用安裝。手機、電腦都可以。

## 玩法

- 選一個位子：**數學老師**、**櫃台班導**或**補習班主任**。三個位子是同一個晚上，看到的事情不一樣。
- 從 17:20 撐到晚上十點。跟著頭上有紅色「！」的人走，或按「帶我去」。
- 時鐘會走。每件事都有期限，遲到會有後果。
- 頭上有黃色「？」的人有支線；地上閃著「✦」的東西可以撿；有「i」的地方可以看說明。
- 每一輪會隨機發生兩件事，例如地震、停電、下雨、外送珍奶。
- 三個位子都玩過，會解鎖「一個月後」。

操作：WASD／方向鍵或點地板走路，E 互動。手機有方向鍵。

## 內容

| | 數量 |
|---|---|
| 職業線 | 3 條，每條 11–12 個場景，各有 6–7 種結局 |
| 小遊戲 | 9 個：修卡紙、批考卷、擦白板、暖身搶答、安撫家長、電話分流、點名、續班名單、排班表 |
| 支線 | 11 條 |
| 撿到的東西 | 12 樣 |
| 隨機事件 | 6 種 |
| 成就 | 15 個 |

## 專案結構

```
src/
  common.js        人物、名詞、說明點、跨線記憶
  world.js         3D 樓層、人物模型與動作、尋路
  life.js          學生上下課、NPC 日常動作、對話泡泡、特效
  atmos.js         夜景、環境音、鐘聲、雨
  minis.js         小遊戲
  events.js        隨機事件
  ach.js           成就
  line_teacher.js  數學老師線
  line_yun.js      櫃台班導線
  line_boss.js     補習班主任線
  items.js         撿到的東西
  sides.js         支線
  engine.js        遊戲流程、對話、介面、存檔
  boot.js          啟動
  style.css / shell.html
build.py           把 src 打包成單一的 index.html
index.html         打包好的遊戲
tests/             自動遊玩測試
```

3D 使用 [three.js r128](https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js)（CDN 載入）。

## 建置

```bash
python3 build.py                          # 產生 index.html
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

測試用 `tests/stub.js` 取代 three.js，所以只能驗證遊戲邏輯，不會檢查實際畫面。畫面請用手機或瀏覽器實際打開確認。

## 說明

補習班、人物、數字與情節都是虛構的遊戲設定，不代表任何一家補習班。
