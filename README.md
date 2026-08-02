# YouTube 中英文双语字幕 Chrome 扩展

这是一个 Chrome 浏览器扩展，可以在 YouTube 上显示中英文双语字幕，提升观看体验。

## 功能特性

✨ **主要功能：**
- 🌐 在 YouTube 视频上显示中英文双语字幕
- 🎚️ 支持中文、英文、双语三种模式切换
- 📏 可调整字幕字体大小（10px - 28px）
- 💾 自动保存用户设置
- 🎨 美观的字幕样式，支持暗黑模式
- 📱 响应式设计，支持各种屏幕尺寸

## 安装方法

### 方式一：本地开发者模式安装（推荐）

1. **打开 Chrome 扩展管理页面**
   - 在 Chrome 地址栏输入：`chrome://extensions/`
   - 或者：菜单 → 更多工具 → 扩展程序

2. **启用开发者模式**
   - 点击右上角的"开发者模式"开关

3. **加载扩展程序**
   - 点击"加载已解压的扩展程序"
   - 选择当前项目文件夹（包含 manifest.json 的目录）

4. **完成**
   - 扩展将出现在扩展列表中
   - 可以看到"YouTube 中英文双语字幕"扩展

### 方式二：打包安装

```bash
# 打包成 .crx 文件（可选）
# Chrome 会自动将其打包
```

## 使用方法

1. **访问 YouTube**
   - 打开任意 YouTube 视频
   - 确保视频有可用的字幕

2. **点击扩展图标**
   - 在地址栏右侧找到扩展图标
   - 点击打开控制面板

3. **调整设置**
   - **启用字幕**：开关控制字幕显示/隐藏
   - **语言选择**：选择中文、英文或双语显示
   - **字体大小**：调整字幕大小

4. **观看视频**
   - 字幕会自动跟随视频播放
   - 支持暂停、快进等操作

## 项目结构

```
youtube/
├── manifest.json           # Chrome 扩展配置
├── content-script.js       # 内容脚本（在页面中运行）
├── background.js           # 背景脚本（Service Worker）
├── popup.html              # 扩展弹窗 UI
├── popup.js                # 弹窗控制脚本
├── styles.css              # 字幕样式
├── images/                 # 扩展图标
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md               # 本文件
```

## 文件说明

| 文件 | 描述 |
|-----|------|
| `manifest.json` | Chrome 扩展元数据和权限配置 |
| `content-script.js` | 注入到 YouTube 页面的脚本，处理字幕获取和显示 |
| `background.js` | Service Worker，处理扩展生命周期和消息 |
| `popup.html` | 扩展弹出面板的 HTML 结构 |
| `popup.js` | 弹出面板的交互逻辑 |
| `styles.css` | 字幕容器的样式定义 |

## 技术实现

### 工作原理

1. **字幕获取**
   - 监听 YouTube 视频的 `TextTrack` 对象
   - 识别中文和英文字幕轨道
   - 监听 `cuechange` 事件获取实时字幕

2. **字幕显示**
   - 在视频播放器下方创建自定义字幕容器
   - 使用 CSS 进行样式控制
   - 支持 HTML5 TextTracks API

3. **与 UI 的通信**
   - 使用 `chrome.runtime.sendMessage` 进行跨脚本通信
   - 使用 `chrome.storage.local` 保存用户设置

### API 权限

```json
{
  "permissions": ["activeTab", "scripting", "storage"],
  "host_permissions": ["*://www.youtube.com/*", "*://youtube.com/*", "*://youtu.be/*"]
}
```

## 常见问题

### Q: 为什么没有显示字幕？
A: 
- 确保 YouTube 视频本身支持字幕
- 点击视频播放器的字幕按钮启用字幕
- 某些视频可能没有中文或英文字幕

### Q: 怎样切换字幕语言？
A: 点击扩展图标，在弹窗中选择"中文"、"英文"或"双语"选项。

### Q: 字幕位置能调整吗？
A: 当前版本字幕固定在视频下方。后续版本可能支持自定义位置。

### Q: 支持哪些语言？
A: 当前版本支持中英文双语。其他语言需要视频提供相应字幕轨道。

### Q: 如何卸载？
A: 在 `chrome://extensions/` 页面找到扩展，点击"删除"按钮。

## 版本历史

**v1.0.0** (2024)
- ✅ 基础中英文双语字幕显示
- ✅ 语言切换功能
- ✅ 字体大小调整
- ✅ 设置持久化

## 后续改进计划

- [ ] 支持更多语言对
- [ ] 自定义字幕位置和样式
- [ ] 字幕翻译功能（集成 API）
- [ ] 字幕下载功能
- [ ] 暗黑模式主题选择
- [ ] 快捷键支持

## 许可证

MIT License

## 反馈和贡献

如有问题或建议，欢迎提出 Issue 或 Pull Request。

## 免责声明

本扩展仅用于学习和研究目的。请遵守 YouTube 的服务条款和当地法律法规。

---

**开发说明：**

### 开发调试

1. 在 `chrome://extensions/` 启用"开发者模式"
2. 修改代码后点击"重新加载"按钮
3. 打开浏览器开发者工具（F12）查看日志

### 调试 Content Script

- 在任何 YouTube 页面按 F12 打开开发者工具
- 在 Console 中检查错误和日志

### 调试 Background Script

- 在 `chrome://extensions/` 页面找到扩展
- 点击"服务工作者"下的检查视图

## 技术支持

对于最新的 Chrome API 文档，请参考：
- [Chrome 扩展开发文档](https://developer.chrome.com/docs/extensions/)
- [HTML5 TextTrack API](https://developer.mozilla.org/en-US/docs/Web/API/TextTrack)