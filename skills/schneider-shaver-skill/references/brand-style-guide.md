# Brand Style Guide — 剃须刀品类通用视觉框架

本指南定义剃须刀品类电商图片的通用视觉规则体系。**产品外观（颜色/材质/结构/刀头数量）不作为预设，全部由用户提供的产品白底图决定。**

## 目的

本技能提供的是一个可复用的**场景+灯光+构图+人物+质量**框架。产品描述永远来自用户参考图，技能不预设任何品牌或机型。

## 硬锁清单

以下维度作为品类级硬锁，不随品牌变化：

- camera angle family（镜头角度家族）
- lighting direction（灯光方向体系）
- background type（背景类型）
- composition logic（构图逻辑）
- commercial use intent（商业用途意图）
- model identity（人物设定，如有）
- quality standard（质量标准）

以下维度**不作为硬锁**，由用户参考图提供：
- product shape（产品外形）
- material finish（材质表面处理）
- product color（产品颜色）
- logo placement（logo 位置）
- blade count（刀头数量）
- structural details（机身结构细节）

## What to compare

When multiple images are provided, compare:

- same product versus variant product
- same material versus different finish
- same background family versus different scene
- same camera angle family versus different framing
- same commercial tone versus different selling purpose

## Style inference rules

- Use only visible evidence as the base.
- Mark inferred style terms as inference, not fact.
- Do not default to broad words like premium, elegant, or realistic unless they are tied to a visible feature.
- Describe style through concrete visual behavior such as high-key studio light, matte plastic surface, centered hero framing, or shallow depth of field.

## Consistency priorities

1. Product accuracy
2. Brand style consistency
3. Commercial readability
4. Prompt usability

## Shot Type Map

Use this map before choosing a preset:

- `KV英雄图`: single hero image for ecommerce cover or brand visual
- `使用图`: model or hand usage image showing shave action, foam, skin contact, or face fit
- `细节图`: close-up technical evidence image focused on one structure, texture, material, or mechanism
- `便携/出行场景图`: portability scene for travel, commuting, car cabin, or carry context
- `功能说明图`: explanatory image that makes one function claim immediately understandable
- `配件展示图`: box contents, accessory set, packaging completeness, or numbered accessory list

Do not choose by background alone. Choose by the commercial job of the image first, then use background and styling as secondary cues.

## 统一人物设定

当画面需要成年男性人物时，默认使用以下人物基线：

- 欧美成年男性
- 年龄感约 25-35 岁
- 身形修长匀称，不过度健身夸张
- 面部轮廓清晰，下颌线明确
- 五官立体但不过度攻击性
- 中短发，偏分或向后梳理，发丝整洁，有轻微自然光泽
- 气质冷静、克制、干净、精致，偏都市轻商务
- 表情以自然、专注、轻微自信为主，不夸张大笑，不强情绪表演

默认不要使用：

- 亚洲少年感男模作为默认人设
- 粗犷硬汉风
- 夸张肌肉型健身男模
- 蓬乱长发或夸张卷发
- 街头潮流感或强娱乐化气质

## 统一服装设定

当画面需要服装时，默认使用以下服装基线：

- 黑色高级衬衫
- 深灰或炭灰深色上装
- 黑色高领
- 白衬衫
- 浅米色或沙色西装
- 其它品牌允许的中性色极简轻商务服装

服装规则：

- 优先低饱和中性色
- 面料平整、干净、简洁
- 无夸张图案
- 无潮牌标识
- 无复杂配饰
- 无强运动风

## 统一灯光设定

所有模板默认遵守以下灯光基线：

- 光线首先服务产品可读性与材质真实性
- 金属/高光边缘清楚，但不能过曝
- 暗部保留层次，不能死黑
- 皮肤不能脏灰，不能塑料感
- 白底体系优先高键柔光或定向棚拍光
- 深色体系优先侧前方主光、轮廓光或受控氛围光
- 科技感光效只能辅助解释功能，不能压过产品主体

## 统一负面方向

所有模板默认继承以下负面方向：

- no hallucinated logo/text
- no invented structure
- no extra buttons or parts
- no plastic-looking metal
- no cluttered background
- no floating product
- no cartoon or cheap CGI look
- no text-heavy collage layout
- no face dominating the frame when product should be primary

## KV英雄图预设

当用户需要单张KV英雄图时，使用以下预设。

### 白底极简英雄图

- White or near-white background
- Single product or product plus minimal hand usage
- Clean high-key studio light
- Strong product readability
- Product appearance from user reference image only
- Minimal or no environmental props
- Best for: standard hero cover, clean ecommerce main image

### 黑蓝科技英雄图

- Deep blue, black, or dark gradient background
- Controlled rim light or glow accents
- Product presented as a premium technology object
- Product appearance from user reference image only
- Strong contrast and cinematic separation
- Best for: futuristic premium positioning, tech-led hero shot

### 红黑性能英雄图

- Black and red contrast system
- Strong performance and power language
- Product shown with stronger structural emphasis
- Product appearance from user reference image only
- Bold commercial tone
- Best for: feature-led hero shot, stronger sales emphasis

## 使用图预设

当用户需要“人物正在使用剃须刀”的单张卖点图时，使用以下预设。

### 白底顺滑湿剃图

- White or light gray clean studio background
- Visible shaving foam and clear product-to-skin contact
- Product appearance from user reference image only
- Bright, clean, controlled wet-shave commercial look
- Focus on smoothness, comfort, and clean foam texture
- Best for: detail-page usage image, wet-shave comfort proof

### 黑底高效剃须图

- Black or charcoal dark background
- Stronger directional lighting and clearer jawline separation
- Product appearance from user reference image only
- Low-clutter, efficient, decisive shaving performance tone
- Focus on speed, power, and clean cutting efficiency
- Best for: performance-led usage image, stronger functional proof

### 科技贴合剃须图

- Dark neutral or deep blue-black technology background
- Controlled rim light or subtle light bands around face contour
- Product appearance from user reference image only
- Product-to-face fit is the main evidence point
- Focus on contour following, skin contact, and precision structure
- Best for: fit-led usage image, technology-driven detail-page visual

## 细节图预设

当用户需要“单一技术卖点的局部证据图”时，使用以下预设。

### 内部结构爆炸图

- Exploded internal structure along the product axis
- Product appearance and internal structure from user reference only
- Focus on motor, transmission, internal layers, or power logic
- Dark background with controlled technical glow allowed
- Best for: motor power, internal engineering proof, technical breakdown

### 刀头结构说明图

- Enlarged foil-head structure with clear blade arrangement
- Product appearance and blade layout from user reference image only
- Focus on blade combination and shaving logic
- Annotation lines or point markers are allowed
- Best for: structural explanation, blade logic, shaving principle proof

### 刀头贴合动效图

- Enlarged foil-head close-up with motion or fit-direction cues
- Product appearance and head structure from user reference image only
- Blue arrows or controlled motion accents can be used
- Focus on floating head movement, contour following, and face fit
- Best for: floating-head proof, fit-led functional explanation

### 刀网微距纹理图

- Extreme macro close-up of foil mesh and center cutter
- Product appearance and mesh pattern from user reference image only
- Minimal environment, almost abstract precision framing
- Focus on texture precision, sharpness, and machining quality
- Best for: micro-detail proof, precision and sharpness perception

### 材质触感细节图

- Close-up of texture, comfort ring, or touch-sensitive surface
- Product material and texture from user reference image only
- Hand proximity is allowed if it supports tactile interpretation
- Focus on comfort, smoothness, and skin-friendly material behavior
- Best for: comfort proof, sensitive-skin story, tactile surface detail

### 机身工艺细节图

- Close-up of body shell, logo, charging interface, edge, or surface finish
- Product exterior details from user reference image only
- Strong material readability with restrained composition
- Focus on build quality, edge treatment, and precision machining
- Single close-up frame only; avoid grids, split panels, divider lines, or multiple detail tiles
- A fingertip may lightly touch the body surface when it helps show scale or tactile finish
- Best for: build-quality proof, body material, industrial finish

## 便携/出行场景图预设

当用户需要“产品在差旅、通勤、车内等便携使用语境中的单张场景图”时，使用以下预设。

### 旅行收纳图

- Product placed in luggage, on folded clothing, travel pouch area, or boarding context
- Product appearance from user reference image only
- Focus on portability, packing ease, and compact carry logic
- Clean travel composition with restrained props
- Best for: business trip, travel carry, compact storage story

### 车载出行图

- Product placed inside a car cabin as a no-people still life
- Product appearance from user reference image only
- Focus on commute carry, business travel readiness, and "ready before departure" convenience
- Car seat, center armrest, door pocket, console edge, window light, or cabin framing allowed
- No model, no hands, no face, no active shaving action; the product itself must carry the scene
- Best for: in-car carry, commute readiness, business travel static placement

## 功能说明图预设

当用户需要“把某个功能点直接讲清楚”的单张说明图时，使用以下预设。

### 防水冲洗说明图

- Product shown under running water, near sink, or in rinse-cleaning context
- Focus on waterproof rating, direct rinsing, and easy cleaning
- Clean bathroom or neutral wash area allowed
- Best for: IPX7, rinse wash, wet-dry use explanation

### 沉浸防水说明图

- Product shown partially or fully under water, preferably held by one hand below the water surface
- Focus on full-body washability, water resistance, wet-dry confidence, and a more dramatic immersion proof moment
- Clear horizontal waterline, underwater hand, large foreground product, bubbles, droplets, and water refraction allowed
- Avoid flat floating-product compositions; the hand-product-water relationship should create the visual impact
- Best for: full-body wash proof, immersion-style waterproof explanation, underwater handheld proof image

### 充电续航说明图

- Product shown on charging base, with cable, or in charging moment
- Focus on fast charge, long battery life, and charging convenience
- Desk, dock, cable, and clean lifestyle-functional surface allowed
- Best for: battery life, quick-charge, dual charging mode explanation

## 配件展示图预设

当用户需要“说明随机配件、包装组成、礼盒完整度或清单式配件展示”的单张图时，使用以下预设。

### 配件组合展示图

- Product shown with packaging, dock, cable, brush, manual, carry bag, or accessory set
- Product appearance from user reference image only
- Focus on included items, gift-box completeness, and premium unboxing impression
- Can be more atmospheric, but product must stay central
- Use controlled directional studio lighting: the tabletop must show a clearly visible oval or circular pool of light under and around the product, product and nearby fabric are noticeably brighter, light falls off quickly toward darker edges, with subtle rim light and no visible light beams
- Surface should align with reference: deep red velvet or red suede-like fabric tabletop, not concrete or industrial floor
- Best for: box contents, premium packaging, accessory completeness

### 配件清单说明图

- Product and accessories arranged in a numbered or clearly listed composition
- Product appearance from user reference image only
- Focus on item-by-item clarity and what is included in the box
- Number markers, labels, or guide text allowed
- Best for: included parts list, packaging checklist, accessory explanation

## 便携场景图边界

以下类型不要归入细节图：

- travel packing scene
- business trip carry scene
- car interior carry scene
- portability story with luggage, seats, or commuting context

这些应视为便携/出行场景图，而不是局部技术证据图。

## 预设选择规则

- Use the lightest preset that still matches the reference style.
- If the brand already uses white-background main KV images, default to 白底极简英雄图.
- If the brand reference is dark and atmospheric, default to 黑蓝科技英雄图.
- If the brand reference is aggressive or performance-led, default to 红黑性能英雄图.
- If the usage image needs to emphasize foam comfort and clean wet shaving, default to 白底顺滑湿剃图.
- If the usage image needs to emphasize fast, decisive shaving performance, default to 黑底高效剃须图.
- If the usage image needs to emphasize contour fit and precision contact, default to 科技贴合剃须图.
- If the image must show internal engineering layers or motor logic, default to 内部结构爆炸图.
- If the image must explain blade arrangement or long-short blade logic, default to 刀头结构说明图.
- If the image must show floating movement or contour-following behavior, default to 刀头贴合动效图.
- If the image must show foil mesh precision or cutter micro texture, default to 刀网微距纹理图.
- If the image must show tactile surface behavior or comfort texture, default to 材质触感细节图.
- If the image must show shell material, logo, edge, or metal machining, default to 机身工艺细节图.
- If the image must show packing, luggage, folded clothing, or business-trip carry context, default to 旅行收纳图.
- If the image must show car interior carry, commute readiness, or no-people in-car placement context, default to 车载出行图.
- If the image must explain rinsing, sink washing, or IPX7 cleaning convenience, default to 防水冲洗说明图.
- If the image must explain underwater washability or full-body waterproof proof, default to 沉浸防水说明图.
- If the image must explain charging, battery life, or dock/cable usage, default to 充电续航说明图.
- If the image must show premium packaging, included accessories, and overall box-content completeness, default to 配件组合展示图.
- If the image must clearly list each included item with markers or labels, default to 配件清单说明图.

## 预设锁定规则

When a preset is selected, keep its core visual logic stable:

- background family
- light direction
- product scale
- composition density
- commercial tone

细节图额外锁定：

- single selling point per frame
- partial close-up instead of full-product completeness
- structure or material readability first
- minimal or no lifestyle environment
- controlled technical accents only when they explain function

便携/出行场景图额外锁定：

- product remains the scene anchor
- props support portability rather than overwhelm the frame
- scene must feel clean, ordered, and business-appropriate
- avoid turning the image into generic lifestyle photography

功能说明图额外锁定：

- one core function claim per frame
- product plus function relation must be immediately readable
- helper elements are allowed only if they explain the function
- scene can exist, but explanation must stay primary
- do not let it drift into pure detail shot or pure lifestyle shot

配件展示图额外锁定：

- included items must match the actual package set
- product remains the visual anchor even when multiple accessories are shown
- arrangement must feel orderly, premium, and easy to scan
- 配件组合展示图需要明确的局部定向棚拍光：桌面上必须出现可辨认的椭圆形或圆形受光灯斑，产品站在灯斑中心，产品和近处绒布明显更亮，灯斑边缘柔和但清楚，向四周快速衰减成暗部；不要只有整体柔光，不要整张图平均照亮，也不要出现可见光柱或体积光
- 配件组合展示图默认使用红色丝绒/绒面布料台面，不要水泥地面、工业地台或粗糙石材质感
- avoid turning the composition into clutter or generic flat-lay noise

## Do not assume

- hidden structure（不可见的结构）
- extra buttons（额外按键）
- invisible branding（不可见的品牌标识）
- unshown texture details（未展示的纹理细节）
- unconfirmed props（未确认的道具）
- product color（产品颜色——来自参考图）
- product material（产品材质——来自参考图）
- blade count（刀头数量——来自参考图）
- body finish（机身表面处理——来自参考图）
