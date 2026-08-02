# 常见问题与故障排除 (FAQ)

## 目录
1. [安装相关](#安装相关)
2. [功能相关](#功能相关)
3. [显示相关](#显示相关)
4. [兼容性](#兼容性)
5. [开发调试](#开发调试)

---

## 安装相关

### Q1: 如何在 Chrome 中安装这个扩展？

**A:** 请按照以下步骤操作：

1. 打开 Chrome 并访问 `chrome://extensions/`
2. 在右上角打开"开发者模式"开关
3. 点击"加载已解压的扩展程序"
4. 选择项目文件夹（包含 manifest.json）
5. 完成！

详细图文教程请参考 [INSTALL.md](INSTALL.md)

### Q2: 提示"清单文件缺失或无法读取"是什么意思？

**A:** 这表示 Chrome 找不到 `manifest.json` 文件。

**解决方案：**
- 确保选择的是项目的根文件夹
- 确认文件夹中有 `manifest.json` 文件
- 尝试删除后重新加载

### Q3: 显示"需要权限"的错误？

**A:** 这是 Chrome Manifest V3 的安全机制。

**解决方案：**
- 点击扩展图标，按照提示授予权限
- 在 `chrome://extensions` 点击"详情"检查权限
- 确保有 YouTube 域名的访问权限

### Q4: 能否在其他浏览器上安装？

**A:** 可以，但支持情况不同：

| 浏览器 | 支持度 | 备注 |
|------|------|------|
| Chrome | ✅ 完全支持 | 推荐使用 |
| Edge (Chromium) | ✅ 支持 | 基于 Chromium，88+ 版本 |
| Opera | ⚠️ 部分支持 | 需要调整 |
| Vivaldi | ⚠️ 部分支持 | 兼容性可能有问题 |
| Firefox | ❌ 不支持 | 使用 WebExtensions API |

---

## 功能相关

### Q5: 字幕为什么不显示？

**A:** 可能的原因和解决方案：

**原因 1: 视频没有字幕**
- 检查视频播放器右下角是否有 CC（字幕）按钮
- 如果没有 CC 按钮，说明视频无字幕
- 解决：选择有字幕的视频

**原因 2: 字幕未启用**
- 点击视频播放器右下角的 CC 按钮
- 从下拉菜单选择语言
- 解决：确保至少选择一种语言

**原因 3: 扩展未启用**
- 点击工具栏的扩展图标
- 检查"启用字幕"开关是否打开
- 解决：打开开关

**原因 4: 页面未完全加载**
- 等待 2-3 秒
- 刷新页面（Cmd+R 或 Ctrl+R）
- 解决：重新加载

**原因 5: 脚本注入失败**
- 打开开发者工具（F12）
- 检查 Console 是否有错误
- 解决：尝试重新启用扩展或删除后重新安装

### Q6: 如何知道有多少个字幕轨道？

**A:** 你可以通过开发者工具检查：

1. 打开 YouTube 页面
2. 按 F12 打开开发者工具
3. 在 Console 中输入：
   ```javascript
   console.log(document.querySelector('video').textTracks);
   ```
4. 查看输出的 TextTrackList 对象
5. 检查每个 track 的 label 和 language 属性

### Q7: 我想要的语言组合（比如日中双语）能支持吗？

**A:** 当前版本固定支持中英文双语。

**后续计划：**
- 添加更多语言对支持
- 允许用户自定义语言对

**目前的替代方案：**
- 修改代码中的语言识别逻辑
- 参考下方"开发调试"部分

---

## 显示相关

### Q8: 字幕显示在屏幕上的位置可以改变吗？

**A:** 当前版本字幕位置固定在视频下方。

**原因：**
- 避免遮挡视频内容
- 在全屏模式下易于查看
- 符合 YouTube 原生字幕风格

**后续计划：**
- 添加位置自定义选项
- 支持用户拖动字幕位置

**目前的调整方法：**
修改 `styles.css` 中的字幕位置：

```css
#yt-bilingual-subtitles {
  bottom: 100px;  /* 改这个值 */
}
```

### Q9: 字幕的字体可以改变吗？

**A:** 可以，在 `styles.css` 中修改：

```css
.subtitle-line {
  font-family: 'Microsoft YaHei', Arial, sans-serif;  /* 改这个 */
  font-size: 16px;  /* 改这个 */
}
```

### Q10: 全屏时字幕显示不了？

**A:** 这通常是 HTML5 全屏 API 的限制。

**解决方案：**

**方式 1：使用剧院模式**
- YouTube 视频右下角有剧院模式按钮（隔壁 CC 和全屏）
- 在剧院模式下字幕能正常显示
- 推荐使用

**方式 2：修改样式处理全屏**
在 `styles.css` 添加：

```css
#yt-bilingual-subtitles {
  position: fixed;  /* 改为 fixed */
  z-index: 2147483647;  /* 最高层级 */
}
```

### Q11: 字幕会遮挡视频内容吗？

**A:** 设计上已考虑这一点。

**字幕位置：**
- 放在视频播放器下方
- 不会遮挡视频本身
- 在正常播放和全屏播放中都清晰可见

**如果被遮挡：**
- 检查是否使用了 YouTube 的剧院模式
- 调整字体大小
- 修改 `styles.css` 中的 `bottom` 值

---

## 兼容性

### Q12: 支持哪些 YouTube 网址？

**A:** 扩展支持所有 YouTube 网址：

```
✅ youtube.com
✅ www.youtube.com
✅ youtu.be (短链接)
✅ youtube.com/watch?v=...
✅ youtube.com/playlist?...
✅ youtube.com/results (搜索结果)
```

### Q13: YouTube Premium/YouTube Music 能用吗？

**A:**
- ✅ YouTube Premium：支持
- ⚠️ YouTube Music：不支持（音乐应用没有字幕）
- ✅ YouTube TV：支持

### Q14: 在 YouTube 直播上能用吗？

**A:** 只有在直播有实时字幕时才能显示。

**直播字幕要求：**
- 直播主需要启用实时字幕
- 字幕轨道需要可用
- 扩展会自动检测和显示

### Q15: 扩展与其他 YouTube 扩展有冲突吗？

**A:** 通常不会，但某些情况可能有问题。

**已测试兼容的扩展：**
- YouTube Vanced
- Video DownloadHelper
- Tampermonkey

**可能冲突的扩展：**
- 其他字幕扩展（修改同一个 DOM）
- 页面修改器

**测试冲突的方法：**
1. 禁用其他扩展
2. 启用本扩展
3. 测试功能
4. 逐个启用其他扩展
5. 找出冲突的扩展

---

## 开发调试

### Q16: 如何在本地调试？

**A:** 参考以下步骤：

1. **启用开发者模式调试日志**

打开 `content-script.js`，添加：
```javascript
console.log('YouTube 双语字幕扩展已启用');
```

2. **打开开发者工具查看日志**

在 YouTube 页面按 F12：
- Console 标签 → 查看日志
- Network 标签 → 查看网络请求
- Elements 标签 → 查看 DOM 元素

3. **检查字幕容器**

在 Console 中输入：
```javascript
document.querySelector('#yt-bilingual-subtitles')
```

### Q17: 如何修改语言识别逻辑？

**A:** 编辑 `content-script.js` 中的 `processTracks()` 函数：

```javascript
function processTracks() {
  const video = document.querySelector('video');
  if (!video || video.textTracks.length === 0) return;

  for (let i = 0; i < video.textTracks.length; i++) {
    const track = video.textTracks[i];
    const label = track.label || '';
    const language = track.language || '';

    // 修改这里的条件判断
    if (label.includes('日本語') || language === 'ja') {
      japaneseTrack = track;
    }
    // ...继续添加其他语言
  }
}
```

### Q18: 如何添加新功能？

**A:** 基本步骤：

1. **修改 popup.html** - 添加 UI 元素
2. **修改 popup.js** - 添加事件监听
3. **修改 content-script.js** - 实现功能逻辑
4. **修改 background.js** - 处理消息（如需要）
5. **在 `chrome://extensions` 刷新** 查看变化

**示例：添加字幕背景颜色选项**

1. popup.html 中添加：
```html
<div class="setting-group">
  <label class="setting-label">背景颜色</label>
  <select id="bgColor">
    <option value="dark">深色</option>
    <option value="light">浅色</option>
  </select>
</div>
```

2. popup.js 中添加：
```javascript
document.getElementById('bgColor').addEventListener('change', (e) => {
  chrome.storage.local.set({ bgColor: e.target.value });
  // 发送消息到 content script
});
```

3. content-script.js 中处理：
```javascript
case 'changeBgColor':
  if (subtitlesContainer) {
    if (request.bgColor === 'light') {
      subtitlesContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    }
  }
  break;
```

### Q19: 如何提交拉取请求？

**A:** 如果你做了改进，欢迎贡献：

```bash
# 1. Fork 项目
# 2. 创建特性分支
git checkout -b feature/new-feature

# 3. 提交更改
git commit -am 'Add new feature'

# 4. 推送到远程
git push origin feature/new-feature

# 5. 创建 Pull Request
```

### Q20: 如何报告 Bug？

**A:** 请提供以下信息：

- [ ] Chrome/浏览器版本
- [ ] 扩展版本
- [ ] 重现步骤
- [ ] 预期结果
- [ ] 实际结果
- [ ] 错误截图或日志
- [ ] 浏览器控制台错误（F12 → Console）

**示例 Bug 报告：**

```
标题: 全屏模式下字幕不显示

环境:
- Chrome 版本: 120.0.6099.129
- 扩展版本: 1.0.0
- 系统: macOS 14.2

重现步骤:
1. 打开 YouTube 视频
2. 点击全屏按钮
3. 观察字幕

预期结果:
字幕应该在全屏模式下显示

实际结果:
字幕消失了

附加信息:
F12 Console 中没有错误
```

---

## 更多帮助

- 📖 [安装指南](INSTALL.md)
- 📝 [README](README.md)
- ✅ [测试清单](TEST-CHECKLIST.md)
- 🔧 [项目配置](manifest.json)

---

**最后更新:** 2024 年
**版本:** 1.0.0

如有其他问题，欢迎反馈！
