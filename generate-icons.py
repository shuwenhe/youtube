#!/usr/bin/env python3
"""
生成 Chrome 扩展图标的 Python 脚本
无需 ImageMagick，只需要 PIL/Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("请先安装 Pillow: pip install Pillow")
    exit(1)

def create_icon(size):
    """创建指定大小的图标"""
    # 创建深灰色背景
    img = Image.new('RGB', (size, size), color='#1f1f1f')
    draw = ImageDraw.Draw(img)
    
    # 绘制红色圆圈
    margin = int(size * 0.1)
    draw.ellipse(
        [margin, margin, size - margin, size - margin],
        outline='#ff0000',
        width=max(1, int(size * 0.08))
    )
    
    # 绘制 CC 文本（Closed Caption）
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", int(size * 0.4))
    except:
        font = ImageFont.load_default()
    
    text = "CC"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - int(size * 0.05)
    
    draw.text((x, y), text, fill='white', font=font)
    
    # 添加中文标记
    try:
        zh_font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", int(size * 0.2))
    except:
        zh_font = font
    
    zh_text = "双"
    bbox = draw.textbbox((0, 0), zh_text, font=zh_font)
    zh_width = bbox[2] - bbox[0]
    x = (size - zh_width) // 2
    y = size - int(size * 0.3)
    
    draw.text((x, y), zh_text, fill='#ff0000', font=zh_font)
    
    return img

# 生成三个尺寸的图标
sizes = [16, 48, 128]
print("生成 Chrome 扩展图标...")

for size in sizes:
    icon = create_icon(size)
    filename = f'images/icon{size}.png'
    icon.save(filename)
    print(f"✓ 已生成: {filename} ({size}x{size})")

print("\n✓ 所有图标生成完成！")
print("可以现在安装到 Chrome 了。")
