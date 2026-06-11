# VoxCanvas Lab

七牛云 x XEngineer 第四批次作品，选题二：AI 语音绘图工具。

VoxCanvas Lab 是一款纯语音控制的浏览器绘图工具。用户启动麦克风后，通过自然语言说出绘图意图，系统会在本地完成语音识别结果解析、复杂指令拆解、Canvas 绘制与语音反馈。核心目标是低延迟、低成本、可解释地完成“语音到绘图操作”的闭环。

## 快速运行

```bash
cd qiniu-xengineer-voice-draw
python3 -m http.server 5178
```

打开：

```text
http://localhost:5178
```

Chrome / Edge 上可使用 Web Speech API。首次点击 `Start Mic` 时浏览器会请求麦克风权限。

## 可用语音指令示例

- `draw a sunset background with mountains and a river`
- `draw a red circle at center radius 90`
- `draw a blue house on the left`
- `draw five yellow stars at the top`
- `write hello near the bottom`
- `make a forest with three trees and a moon`
- `画一个蓝天背景，有三朵白云和四朵粉色花`
- `在左边画蓝色房子`
- `在下方写你好`
- `clear canvas`
- `undo`
- `save image`

## 作品亮点

- 纯语音绘图链路：麦克风输入、语音识别、语义解析、操作队列、Canvas 渲染。
- 复杂指令拆解：例如“sunset background with mountains and a river”会拆成背景、太阳、山脉、河流等多个绘制动作。
- 容错解析：支持同义词、颜色别名、数字词、位置词，中英文关键词可混合识别，并在解析失败时给出可操作提示。
- 成本控制：默认不调用云端大模型，不上传音频和画布，页面内展示云调用次数和成本状态。
- 可验证实现：`app-core.mjs` 是可测试的纯解析层，`tests/parser-smoke.mjs` 覆盖主要指令。

## 项目结构

```text
.
├── index.html
├── styles.css
├── app.js
├── app-core.mjs
├── docs/
│   ├── design.md
│   └── demo-script.md
├── submission/
│   ├── demo/
│   │   ├── narration.txt
│   │   └── voxcanvas-demo.webm
│   └── submit-info.md
└── tests/
    └── parser-smoke.mjs
```

## 本地检查

```bash
npm run check
```

## 设计文档

见 [docs/design.md](docs/design.md)。

## Demo 视频

公开视频：[https://files.catbox.moe/tzdm5n.webm](https://files.catbox.moe/tzdm5n.webm)。

仓库本地副本路径：`submission/demo/voxcanvas-demo.webm`。

录屏展示了复杂指令拆解、基础图形、组合场景、文字绘制和撤销。旁白文本见 [submission/demo/narration.txt](submission/demo/narration.txt)，录制脚本见 [docs/demo-script.md](docs/demo-script.md)。
