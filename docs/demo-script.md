# Demo 视频脚本

## 片头

展示页面，说明作品选题是“AI 语音绘图工具”。强调用户启动麦克风后，不需要鼠标和键盘，通过语音完成绘图。

## 演示 1：复杂场景拆解

语音输入：

```text
draw a sunset background with mountains and a river
```

展示点：

- 页面显示识别文本。
- 动作队列出现 background、sun、mountains、river。
- Canvas 一次生成夕阳、山脉和河流。
- 延迟和置信度同步更新。

## 演示 2：数量、颜色、位置

语音输入：

```text
draw five yellow stars at the top
```

展示点：

- 系统识别数量 five。
- 星星出现在上方区域。
- 动作栈记录多次 star 操作。

## 演示 3：对象绘制

语音输入：

```text
draw a blue house on the left
```

展示点：

- 识别颜色 blue。
- 识别位置 left。
- 绘制房屋图形。

## 演示 4：文字与编辑

语音输入：

```text
write hello near the bottom
```

随后输入：

```text
undo
```

展示点：

- 文字被画到画布下方。
- undo 可以撤销最近一步。

## 结尾

展示右侧 Cost 状态，说明当前版本不调用云端模型，默认云调用次数为 0。说明未来可以接入大模型作为解析失败时的 fallback，而不是每条指令都调用，从而控制运营成本。
