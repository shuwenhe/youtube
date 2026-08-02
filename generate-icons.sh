#!/bin/bash
# 生成 Chrome 扩展图标的脚本

# 确保有 ImageMagick 安装
if ! command -v convert &> /dev/null; then
    echo "请先安装 ImageMagick："
    echo "macOS: brew install imagemagick"
    echo "Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "CentOS: sudo yum install ImageMagick"
    exit 1
fi

echo "生成图标文件..."

# 从 SVG 生成不同尺寸的 PNG 图标
convert -background none -size 16x16 images/icon.svg -resize 16x16 images/icon16.png
convert -background none -size 48x48 images/icon.svg -resize 48x48 images/icon48.png
convert -background none -size 128x128 images/icon.svg -resize 128x128 images/icon128.png

echo "✓ 已生成图标文件："
echo "  - images/icon16.png (16x16)"
echo "  - images/icon48.png (48x48)"
echo "  - images/icon128.png (128x128)"

# 验证文件
if [ -f "images/icon16.png" ] && [ -f "images/icon48.png" ] && [ -f "images/icon128.png" ]; then
    echo "✓ 所有图标文件已成功创建！"
    ls -lh images/icon*.png
else
    echo "✗ 图标生成失败，请检查 ImageMagick 是否正确安装"
    exit 1
fi
