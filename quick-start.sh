#!/bin/bash
# 快速启动脚本 - 帮助快速打开Chrome扩展管理页面

echo "🚀 YouTube 双语字幕 Chrome 扩展"
echo "================================"
echo ""
echo "正在为您打开 Chrome 扩展管理页面..."
echo ""

# 检查系统平台
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "chrome://extensions/"
    echo "✓ 已打开 chrome://extensions/ 页面"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    google-chrome "chrome://extensions/" &
    echo "✓ 已打开 chrome://extensions/ 页面"
else
    # Windows 或其他
    start chrome://extensions/
    echo "✓ 已打开 chrome://extensions/ 页面"
fi

echo ""
echo "接下来的步骤："
echo "1. 确保已启用 '开发者模式'（右上角开关）"
echo "2. 点击 '加载已解压的扩展程序'"
echo "3. 选择当前文件夹"
echo ""
echo "项目路径: $(pwd)"
echo ""
echo "更多帮助，请查看 INSTALL.md 文件"
