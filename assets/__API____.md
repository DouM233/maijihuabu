# OpenClaw gpt-image-2 API 完整使用指南

> **一读完就能上手**：文生图 + 图生图，所有参数、格式、技巧一目了然
> **最后更新**：2026-05-22

---

## 一、接口总览

| | 文生图 | 图生图 |
|------|------|------|
| **模型** | `gpt-image-2` | `gpt-image-2` |
| **地址** | `http://www.taikuaila.cn/v1/images/generations` | `http://www.taikuaila.cn/v1/images/edits` |
| **方法** | POST application/json | POST multipart/form-data |
| **认证** | Bearer Token | Bearer Token |
| **核心区别** | 只需 prompt，无参考图 | 需要 prompt + 参考图 |

---

## 二、请求格式

### 2.1 Headers

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json  # 仅文生图需要
```

### 2.2 文生图请求体（JSON body）

```json
{
    "model": "gpt-image-2",
    "prompt": "你的提示词",
    "size": "1024x1024",
    "n": 1
}
```

> ⚠️ 文生图必须用 **JSON body**（`Content-Type: application/json`），`n` 传整数。
> 如果用 multipart/form-data，`n` 会被转成字符串导致 500 错误。

### 2.3 图生图请求体

```python
files = {
    'model': (None, 'gpt-image-2'),
    'prompt': (None, '你的提示词'),
    'image': ('reference.png', 图片二进制数据, 'image/png'),
    'size': (None, '1024x1024'),
    'n': (None, '1')
}
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | ✅ | 固定 `gpt-image-2` |
| `prompt` | string | ✅ | 提示词，英文/中文均可，结构化写法效果最佳 |
| `image` | file | 图生图必填 | 参考图片二进制，支持 PNG/JPG/WEBP |
| `size` | string | ❌ | 尺寸枚举值，默认 `"auto"` |
| `n` | string/int | ❌ | 生成数量，默认 `1` |

### 2.4 新站特有参数

| 字段 | 类型 | 枚举值 | 说明 |
|------|------|--------|------|
| `size` | string | `"auto"`, `"1024x1024"`, `"1536x1024"`, `"1024x1536"` | 图片尺寸，默认 `"auto"` |
| `quality` | string | `"low"`, `"high"` | 生成质量，影响细节和速度 |
| `moderation` | string | `"auto"` | 内容审核，默认开启 |

**尺寸参数速查**：

| size 值 | 方向 | 说明 |
|---------|------|------|
| `auto` | 默认 | 自动选择最佳比例 |
| `1024x1024` | 正方 | 1:1 方形，适合商品主图、头像 |
| `1536x1024` | 横版 | 3:2 横向，适合横幅、视频封面、Banner |
| `1024x1536` | 竖版 | 2:3 竖向，适合人像摄影、社交媒体 |

**旧站比例映射对照**：

| 旧站 aspect_ratio | 新站 size |
|-------------------|-----------|
| `1:1` | `1024x1024` |
| `16:9` | `1536x1024` |
| `9:16` | `1024x1536` |
| `3:4` | `1024x1536` |
| `4:3` | `1536x1024` |

---

## 三、响应格式

```json
{
    "created": 1778805770,
    "data": [
        {
            "b64_json": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        }
    ],
    "background": "opaque",
    "output_format": "png",
    "size": "1024x1024",
    "quality": "low",
    "usage": {
        "total_tokens": 232,
        "input_tokens": 36,
        "output_tokens": 196
    }
}
```

**响应字段说明**：

| 字段 | 说明 |
|------|------|
| `data[0].b64_json` | Base64 编码的图片数据，需解码保存 |
| `background` | 背景类型 `"opaque"` 或 `"transparent"` |
| `output_format` | 输出格式 `"png"` |
| `size` | 实际生成尺寸 |
| `quality` | 实际使用质量 |
| `usage` | Token 用量统计 |

**重要**：不再返回 `url` 和 `revised_prompt`，图片数据在 `b64_json` 中。

### 3.1 Base64 图片解码保存

```python
import base64
import json

response = requests.post(API_URL, headers=headers, json=payload, timeout=180)
result = response.json()

# 解码 Base64 图片
b64_data = result['data'][0]['b64_json']
image_bytes = base64.b64decode(b64_data)

# 保存为图片文件
with open('output.png', 'wb') as f:
    f.write(image_bytes)

print(f"Token 用量: {result['usage']}")
```

---

## 四、完整代码示例

### 4.1 文生图

```python
import requests
import base64

API_KEY = "YOUR_API_KEY"
API_URL = "http://www.taikuaila.cn/v1/images/generations"

PROMPT = """
BEAUTY EDITORIAL, a silver IPL hair removal device on white marble surface,
warm studio lighting, soft shadows, soft box diffused,
8K photorealistic commercial quality.
NO text NO logos NO numbers.
"""

payload = {
    'model': 'gpt-image-2',
    'prompt': PROMPT,
    'size': '1024x1024',
    'n': 1
}

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

response = requests.post(API_URL, headers=headers, json=payload, timeout=180)

if response.status_code == 200:
    result = response.json()
    
    # 解码 Base64 图片
    b64_data = result['data'][0]['b64_json']
    image_bytes = base64.b64decode(b64_data)
    
    with open('output.png', 'wb') as f:
        f.write(image_bytes)
    
    print(f"生成成功！尺寸: {result['size']}, Token: {result['usage']}")
else:
    print(f"错误 {response.status_code}: {response.text}")
```

### 4.2 图生图

```python
import requests
import base64

API_KEY = "YOUR_API_KEY"
API_URL = "http://www.taikuaila.cn/v1/images/edits"
IMAGE_PATH = "reference.png"

PROMPT = """
COMMERCIAL LIFESTYLE PHOTOGRAPHY, a handsome young Asian man in his late 20s
shaving with a silver triple-head electric shaver in front of a bathroom mirror.

MODEL:
- Clean-shaven Asian male, sharp jawline, confident expression
- White towel draped around shoulders
- Holding the silver triple-head shaver against his jaw

SCENE:
- Modern minimalist bathroom with warm lighting
- Subtle mirror reflection in background
- Clean white marble countertop

LIGHTING:
- Warm frontal key light 4000K, soft box diffused
- Gentle rim light on jawline and shaver
- Healthy natural skin tone

COMPOSITION:
- 1024x1024 square, close-up framing from chest up
- 85mm f/2.8, shallow depth of field
- 8K photorealistic commercial quality

FORBIDDEN:
- NO text NO logos NO numbers NO words anywhere
- NO cold blue skin tone
- NO over-smooth plastic skin
"""

with open(IMAGE_PATH, 'rb') as f:
    image_data = f.read()

files = {
    'model': (None, 'gpt-image-2'),
    'prompt': (None, PROMPT),
    'image': ('reference.png', image_data, 'image/png'),
    'size': (None, '1024x1024'),
    'n': (None, '1')
}

headers = {'Authorization': f'Bearer {API_KEY}'}
response = requests.post(API_URL, headers=headers, files=files, timeout=180)

if response.status_code == 200:
    result = response.json()
    
    # 解码 Base64 图片
    b64_data = result['data'][0]['b64_json']
    image_bytes = base64.b64decode(b64_data)
    
    with open('output.png', 'wb') as f:
        f.write(image_bytes)
    
    print(f"生成成功！尺寸: {result['size']}, Token: {result['usage']}")
else:
    print(f"错误 {response.status_code}: {response.text}")
```

---

## 五、提示词编写规范

### 5.1 推荐结构

```
[整体氛围] + [主体描述] + [场景环境] + [构图要求] + [光线设定] + [画质要求] + [禁止事项]
```

### 5.2 结构化分段写法（强烈推荐）

将提示词按模块分段，每段用大写标题标注：

```
COMMERCIAL LIFESTYLE PHOTOGRAPHY, warm atmosphere.

MODEL POSE:
- Young East Asian man, late 20s
- Sharp jawline, confident expression
- Holding silver triple-head shaver against jaw
- White towel draped around shoulders

PRODUCT (HERO):
- Silver and black triple-head electric shaver
- Black floating head with circular foil
- Silver metallic body with power button

SCENE:
- Modern minimalist bathroom
- White marble countertop
- Subtle mirror reflection in background

LIGHTING:
- Warm frontal key light 4000K
- Soft diffused, gentle rim light
- Healthy natural skin tone

COMPOSITION:
- 1024x1024 square, close-up from chest up
- 85mm f/2.8, shallow DOF
- 8K commercial photography quality

FORBIDDEN:
- NO text numbers logos words
- NO cold blue skin tone
- NO over-smooth plastic skin
```

### 5.3 关键技巧

| 技巧 | 说明 | 示例 |
|------|------|------|
| **大写强调** | 关键要求用全大写 | `NO text`, `MUST be`, `CRITICAL` |
| **结构化分段** | 用空行 + 大写标题分模块 | `LIGHTING:`, `COMPOSITION:` |
| **正反面约束** | 同时写要什么和不要什么 | `BOTH arms on table` + `FORBIDDEN: arms folded` |
| **具体数值** | 避免模糊词，用精确参数 | `4000K`, `85mm`, `f/2.8` |
| **物理描述** | 描述光线方向、材质反光 | `specular highlights on metallic surface` |
| **禁止文字** | 商业图必加 | `NO text NO logos NO numbers anywhere` |

### 5.4 常见错误

| ❌ 错误 | ✅ 正确 |
|---------|---------|
| "高级感" | "warm studio lighting, shallow DOF, 8K quality" |
| "精致" | "sharp focus on product, specular metallic highlights" |
| "既看镜头又低头" | 只选一个方向，不矛盾描述 |
| "一些产品" | "one silver triple-head shaver" |

---

## 六、卖点光效提示词模板

电商产品图可直接套用以下光效：

| 光效类型 | 提示词片段 |
|----------|------------|
| 放射状暖光 | `radial warm glow emanating from product center, golden light rays` |
| 冷调功能光 | `cool blue-white functional LED glow on product surface, tech aesthetic` |
| 透明可视化 | `transparent housing revealing internal components, dual-color LED glow` |
| 水流路径光 | `luminous water flow path highlighted with blue-cyan glow` |
| 环形加热光 | `circular infrared heating ring, warm red-orange glow` |
| 半透明沸腾光 | `semi-transparent chamber showing bubbling water, warm amber glow from below` |

**光效提示词框架**：

```
[风格] → [主体+光效] → [环境] → [构图] → [景别] → [光影细节]
```

示例：
```
COMMERCIAL PRODUCT SHOT → silver IPL device with radial warm glow from center →
white marble surface → centered composition → close-up product hero shot →
soft box lighting with rim light accent
```

---

## 七、分组与成本优化

### 7.1 分组类型

| 分组 | 补全价格 | 特点 |
|------|---------|------|
| **default（推荐）** | $30/1M tokens | 性价比均衡，稳定可靠 |
| **限时特价分组** | $18/1M tokens | 价格最低，但可能随时下线 |
| **纯AZ分组** | $45/1M tokens | 偏贵，不推荐 |

### 7.2 省钱建议

- ✅ **推荐锁定 default 分组**：补全 $30/1M tokens，比纯AZ便宜 33%
- ⚠️ **限时特价分组**：最便宜但不稳定，适合尝鲜或非关键任务
- ❌ **纯AZ分组**：成本较高，除非有特殊需求否则不推荐

### 7.3 Token 用量查看

响应中的 `usage` 字段包含详细用量：

```json
"usage": {
    "total_tokens": 232,
    "input_tokens": 36,
    "output_tokens": 196
}
```

- `input_tokens`：输入提示词的 token 消耗
- `output_tokens`：生成图片的 token 消耗
- `total_tokens`：总消耗

---

## 八、常见问题速查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| **400 错误** | size 格式错误 | 只用枚举字符串如 `'1024x1024'`，不要用 `'1:1'` |
| **500 n字段类型错误** | 文生图用了 multipart，n 变成字符串 | 文生图改用 JSON body，`n` 传整数 |
| **图片全黑/损坏** | Base64 解码失败 | 检查 `b64_json` 字段是否存在，确保网络返回完整 |
| **图里有文字** | 提示词没禁止 | 末尾加 `NO text NO Chinese English words numbers logos typography anywhere!` |
| **姿态不对** | 描述不精确 | 用结构化写法 + FORBIDDEN 正反面约束 |
| **肤色发蓝** | 光线色温描述缺失 | 加 `warm frontal light 4000K-4500K, healthy skin tone` |
| **图片模糊** | 缺画质指令 | 加 `8K photorealistic, sharp focus, 85mm f/2.8` |
| **返回 data 空** | 生成失败 | 检查提示词长度，避免矛盾描述，重试 |

---

## 九、调用前检查清单

- [ ] API Key 已配置且有效（见 `./SECRET.md`）
- [ ] 文生图 → `http://www.taikuaila.cn/v1/images/generations` + `gpt-image-2`
- [ ] 图生图 → `http://www.taikuaila.cn/v1/images/edits` + `gpt-image-2`
- [ ] 图生图有参考图片路径正确
- [ ] size 用枚举字符串如 `"1024x1024"`
- [ ] 提示词包含：主体 + 场景 + 光线 + 构图 + 禁止事项
- [ ] 超时设置 ≥ 180 秒
- [ ] 响应解析使用 `base64.b64decode()` 替代 `requests.get(url)`

---

*v1.2 | 2026-05-22 | 更新至新站 taikuaila.cn，响应改为 Base64 格式*
