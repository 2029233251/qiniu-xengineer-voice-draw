# PR 拆分计划

远程仓库创建后，建议按以下粒度开 PR，保持开发过程清晰。

## PR 1: Initialize voice drawing web studio

功能描述：

搭建 VoxCanvas Lab 静态 Web 应用骨架，包含 HTML 结构、响应式 CSS、基础工具栏、Canvas 区域、右侧动作面板和 favicon。

实现思路：

使用原生 HTML/CSS，不引入构建工具，降低启动成本。视觉风格采用画室控制台与工程草图结合的方向，保证评委打开页面即可看到可用工具而不是营销落地页。

测试方式：

使用 `python3 -m http.server 5178` 启动，访问 `http://localhost:5178`，确认页面可加载且无控制台 404。

## PR 2: Add local semantic command parser

功能描述：

新增本地语义解析器，将自然语言指令转换为结构化绘图动作，支持颜色、数量、位置、场景和编辑命令。

实现思路：

在 `app-core.mjs` 中实现纯函数解析层，不依赖 DOM，便于单元测试。复杂指令按场景关键词拆解为多个动作，例如 sunset、mountains、river。

测试方式：

运行 `npm run check`，覆盖 sunset、circle、stars、forest、text、clear 等核心指令。

## PR 3: Implement canvas execution and speech controls

功能描述：

新增 Canvas 绘图执行器、Web Speech API 语音识别、语音反馈、动作栈、事件日志、撤销/重做和 PNG 导出。

实现思路：

`app.js` 负责 UI 状态与 Canvas 渲染；语音识别只负责拿到 transcript，实际解析统一进入 `CommandEngine`，避免语音与绘图逻辑耦合。

测试方式：

浏览器打开页面，点击命令 chip 模拟语音输入，确认画布、动作栈、置信度、延迟和事件日志同步更新。

## PR 4: Document design and submission plan

功能描述：

补充 README、设计文档、demo 脚本和提交字段建议。

实现思路：

设计文档逐项回应赛题要求：计划支持的指令、最终实现的能力、未完成原因、复杂指令拆解和运营成本控制。

测试方式：

检查 README 能独立说明运行方式；检查 `docs/design.md` 覆盖赛题硬性要求。

## PR 5: Add demo narration and submission notes

功能描述：

补充 demo 旁白文本、README demo 链接占位和提交说明。

实现思路：

将演示材料保存在 `submission/demo/`，录屏和旁白音频不进 Git 仓库，避免仓库过大；README 仅保留最终公开视频链接。

测试方式：

确认 `submission/demo/narration.txt` 可用于录制或 TTS 旁白；确认 `submission/submit-info.md` 包含作品简介、技术栈、仓库地址和视频地址占位。
