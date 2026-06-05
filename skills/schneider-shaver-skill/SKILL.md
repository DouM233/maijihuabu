---
name: shaver-style-skill
description: Generate standardized visual-style prompts for shaver/razor product photography. This is a category-level style framework covering KV hero shots, usage images, detail shots, portable/travel scenes, function explanation images, and accessory display images. The skill defines the lighting, composition, background, camera, model, and quality systems — but NEVER describes specific product color, material, blade count, or structural details. Those must be filled from the user's own product reference images. Use when the user needs to produce ecommerce-ready prompts for any shaver/razor product at any brand. The skill works in call mode (no reference images) and outputs modular analysis, Chinese prompt, English prompt, negative prompt, adjustable variables, and consistency checks.
---

# Shaver Style Skill — 剃须刀品类通用视觉风格框架

这是剃须刀/电动剃须刀品类的**通用视觉风格模板系统**，不限品牌、不限机型、不限产品外观。

**核心约束：本技能不包含任何产品特定描述。** 颜色、材质、刀头数量、机身结构、品牌 logo 位置等全部由用户提供的产品白底图决定。技能只定义「这张图应该怎么拍」——场景类型、灯光体系、背景家族、构图规则、人物设定、质量标准和负面约束。

## 使用方式

1. 用户指定需要的画面类型（KV英雄图 / 使用图 / 细节图 / 便携出行图 / 功能说明图 / 配件展示图）
2. 用户提供产品白底图作为参考（产品外观事实来源）
3. 技能根据画面类型输出标准化提示词
4. 用户将提示词 + 产品白底图一并输入 `buddy-cloud.py image` 进行参考图生图

## 画面类型预设族

按画面商业任务分为六大类：

- `KV英雄图`: 白底极简英雄图, 黑蓝科技英雄图, 红黑性能英雄图
- `使用图`: 白底顺滑湿剃图, 黑底高效剃须图, 科技贴合剃须图
- `细节图`: 内部结构爆炸图, 刀头结构说明图, 刀头贴合动效图, 刀网微距纹理图, 材质触感细节图, 机身工艺细节图
- `便携/出行场景图`: 旅行收纳图, 车载出行图
- `功能说明图`: 防水冲洗说明图, 沉浸防水说明图, 充电续航说明图
- `配件展示图`: 配件组合展示图, 配件清单说明图

## 文件导航

- `QUICK_START.md` — 新手快速入门指南（推荐先读）
- `references/brand-style-guide.md` — 品牌视觉规则、硬锁清单、画面类型预设描述
- `references/call-mode.md` — 无参考图时直接调用预设的完整中文模板
- `references/prompt-output-template.md` — 标准化输出格式
- `references/negative-prompts.md` — 可复用失败模式负面词库
- `references/image-analysis-checklist.md` — 产品参考图分析清单（逆向模式用）
- `examples/` — 各画面类型的完整示例（KV英雄图、使用图、细节图等）
- `IMPROVEMENT_PLAN.md` — 改进计划文档

## 工作流

### 调用模式（call mode）—— 默认

当用户没有提供产品参考图且想要标准化提示词时：

1. 确认产品名称和需要的画面类型
2. 从预设族中选择最匹配的模板
3. 产品描述留空或使用占位符 `[产品名]`，材质颜色结构全部由用户提供
4. 锁定品牌视觉规则（人物/服装/灯光/构图/质量）
5. 输出标准化 6 段提示词包

### 逆向分析模式（reverse-engineering mode）

当用户提供了产品白底图时：

1. 分析产品可见事实（外形/材质/颜色/比例/关键结构）
2. 将分析结果填入模板中的产品占位符处
3. 输出完整 6 段提示词包

## 核心规则

- **产品描述永远来自用户提供的参考图，技能模板不预设**
- 优先准确性而非装饰性描述
- 不发明产品结构、logo、文字、材质
- 不把产品描述化简为"高级""精致"等空洞词汇
- 输出保持模块化，便于后续结合参考图生图使用
- 无参考图时切换到调用模式，产品描述标记为待填入

## 必输出章节

1. 画面分析摘要（如无参考图则标记产品信息来源）
2. 中文 Prompt
3. English Prompt
4. 负面 Prompt
5. 可调变量
6. 一致性检查

## 一致性检查必须包含

- 产品外形基于参考图（非技能预设）
- 材质基于参考图（非技能预设）
- 品牌风格保持稳定
- 无虚构 logo/文字
- 无多余道具

## 禁止漂移方向

- Midjourney / Stable Diffusion 特定语法
- 通用 AI 赞美词
- 与可见事实脱钩的营销文案
- 产品特定描述（颜色/材质/刀头数/结构）混入模板
