# 通用剃须刀 — 白底极简英雄图 Call Mode 示例

> 此示例演示**调用模式（call mode）**：用户未提供产品参考图，仅指定产品名和画面类型，技能基于预设模板直接输出标准化提示词包。产品外观描述使用占位符。

## 1. Image Analysis Summary (画面分析摘要)

- **Product**: [用户提供的剃须刀产品名]
- **Product appearance source**: 待用户填入 — 产品外观、颜色、材质和结构严格与用户参考图保持一致
- **Camera Angle**: 3/4 front-top view (品类默认)
- **Lighting**: Clean high-key diffused studio light (品类默认)
- **Background**: Pure white seamless studio (品类默认)
- **Composition**: Centered hero, product occupies 70-80% of frame, vertical 4:5
- **Commercial Use**: E-commerce main listing image / brand hero visual

## 2. Chinese Prompt (中文提示词)

```text
全局氛围锁定：
这张图必须像白底极简棚拍摄的单张KV英雄图。整体是高亮度、纯净、克制的商业棚拍感，不能像生活方式场景，不能像复杂海报拼版，不能有多余氛围元素。

画面定位：
高端电商KV英雄图，[产品名] 作为单张主视觉产品，适合淘宝/JD主图或品牌主视觉延展。画面要像品牌封面页，不是功能拼版页。

人物设定：
单手持握展示，仅露出一只干净的男性手部，手指自然握持机身中段，无完整人物出镜。

产品设定：
[产品名]。产品外观、颜色、材质和结构严格与用户参考图保持一致。
产品位置：居中偏上，刀头朝上，手柄朝下，轻微 3/4 前侧角度展示。
产品露出：90-95% 可见，刀头和机身主体完整露出，手部握持区域局部遮挡手柄中段。
硬性要求：产品不能悬空（需手部持握），不能被手遮挡刀头和 logo 区域，不能偏离画面中心，不能让手比产品更抢眼。

环境设定：
白底无环境，纯白无缝背景纸或白色影棚，最多保留极少量棚拍空间感。不要办公室，不要家居，不要多余道具，不要出现解释性文字元素。

灯光设定：
默认沿用统一灯光设定。主光从正前方偏左侧照入，为高键柔光或定向棚拍光。产品金属质感必须真实呈现，不能过曝不能死黑。阴影柔和干净，落在产品右下方白底上。

构图设定：
竖版 4:5，单张英雄图构图，产品居中偏上，主体占画面 70-80%，上方和两侧保留足够留白给电商标题区。单张独立主视觉，不要多模块拼图，不要边框分栏。

质量锁定：
8K RAW 写实商业摄影质感，真实金属材质表面，产品边缘清晰，手部皮肤真实无 AI 塑料感，白底干净无杂色。

负面词：
默认继承统一负面词基线，并额外避免：多栏拼版、多图拼接、信息图表、杂乱道具、产品悬空无支撑、产品太小、文字过多、背景跑偏、生活方式场景、过曝、阴影过重、手部抢戏、面部出镜。
```

## 3. English Prompt

```text
GLOBAL TONE LOCK: This image must feel like a clean, minimal, high-key white studio KV hero shot. Pure white seamless background, bright commercial lighting, no lifestyle elements, no collage layout, no decorative props.

COMMERCIAL KV HERO SHOT — [Product Name] as a single-product hero image for e-commerce main listing or brand visual. Clean editorial quality for Taobao or JD platform.

MODEL (hand only):
Clean adult male hand, natural skin tone, fingers gently gripping the mid-section of the shaver handle. No full body, no face, no lifestyle context. Hand stays secondary to the product.

PRODUCT:
[Product Name]. Product appearance, color, material, and structure strictly match user reference image.
Placement: Centered upper portion of frame, head pointing up, handle pointing down, slight 3/4 front-side angle.
Visibility: 90-95% visible, foil head and main body fully exposed, hand partially covers mid-handle.
Hard rule: Product must be held (not floating), hand must not cover the foil head, logo area, or power button. Product must stay dominant in frame.

ENVIRONMENT:
Pure white seamless studio background. No office, no home, no props, no text elements. Clean commercial white studio.

LIGHTING:
Default unified lighting. High-key diffused studio lighting from front-left primary, soft fill from right. Product metal surface reads as real material — not mirror-bright, not flat. Soft clean shadow falling to lower-right on white surface.

COMPOSITION:
Vertical 4:5, single KV hero composition, product centered-upper, subject occupies 70-80% of frame, generous white space at top and sides for e-commerce text overlay. Single independent hero visual, no collage, no borders, no panel splits.

QUALITY LOCK:
8K RAW photorealistic commercial photography. Real metal surface, clear product structure, real human hand skin texture, no AI smoothing, no plastic feel, no cartoon render, no 3D CGI look.

NEGATIVE:
daylight, overexposed room, cool blue tones, plastic texture, cluttered kitchen, cartoon render, weak product visibility, floating product without support, hand dominating the frame, face in frame, metallic surface turning mirror-reflective, collage layout, text-heavy design, lifestyle scene, multiple product panels, overexposure, heavy shadows, blurry, low resolution, distorted product shape, wrong logo, fake text, extra buttons, extra parts, incorrect material, incorrect color
```

## 4. Negative Prompt (负面提示词)

```text
hallucinated logo, fake text, invented structure, extra buttons, extra parts, incorrect material, incorrect color, broken proportions, warped edges, floating product, duplicated product, cluttered background, unrelated props, off-brand lighting, mixed visual language, cartoon, CGI, plastic look, oversaturated colors, unreadable product, hidden product, face dominating the frame, text-heavy collage, over-retouched skin, exaggerated cyber neon, daylight, overexposed white background, harsh flash, cool blue shadows, collage layout, multi-panel, lifestyle scene, office, home, kitchen, bathroom
```

## 5. Adjustable Variables (可调变量)

| 变量 | 当前值 | 可选值 |
|------|--------|--------|
| background | pure white studio | dark gradient / light gray gradient |
| camera angle | 3/4 front-top | front-facing / side profile / top-down |
| lighting | high-key diffused from front-left | directional rim light / low-key moody |
| image ratio | 4:5 vertical | 3:4 vertical / 1:1 square / 16:9 horizontal |
| usage scenario | hero product only | with hand usage / in travel context |
| hand presence | single hand holding | no hand (product standalone) |

## 6. Consistency Check (一致性检查)

- [x] Product shape: 待用户参考图填入
- [x] Material: 待用户参考图填入
- [x] Color: 待用户参考图填入
- [x] Brand style preserved: 占位符标记，无虚构
- [x] No hallucinated logo/text: 仅使用占位符 [产品名]
- [x] No unnecessary props: White studio, no extras
- [x] No conflicting instructions: All blocks aligned to single clean hero shot

> **注意**：本示例为调用模式（call mode），产品外观信息待用户提供参考图后填入。技能模板不预设任何产品颜色、材质、刀头数量或结构。