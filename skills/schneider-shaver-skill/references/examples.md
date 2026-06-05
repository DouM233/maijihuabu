# Examples

These examples show the intended output style.

## Example Index

Use these examples as a preset-selection quick reference:

- `Example 0`: call mode without images
- `Example 0.1`: KV英雄图 preset selection
- `Example 0.2`: 使用图 preset selection
- `Example 0.3`: 细节图 preset selection
- `Example 0.4`: non-detail-image boundary
- `Example 0.5`: 便携/出行场景图 preset selection
- `Example 0.6`: 功能说明图 preset selection
- `Example 0.7`: 配件展示图 preset selection
- `Example 1`: single hero product image
- `Example 2`: product in use
- `Example 3`: multiple reference images

### Validated Output Examples (examples/ directory)

The `examples/` directory contains complete 6-section prompt packages for specific products. These serve as gold-standard output references:

- `examples/call-mode-kv-hero-white.md` — Call mode (no reference image), 白底极简英雄图
- `examples/gemini-kv-hero-white.md` — Reverse-engineering mode, 施耐德Gemini 白底极简英雄图
- `examples/gemini-kv-hero-dark-blue.md` — Reverse-engineering mode, 施耐德Gemini 黑蓝科技英雄图
- `examples/gemini-usage-wet-shave-white.md` — Reverse-engineering mode, 施耐德Gemini 白底顺滑湿剃图
- `examples/gemini-detail-foil-macro.md` — Reverse-engineering mode, 施耐德Gemini 刀网微距纹理图

When a shot type is unclear, compare the user's image or request against the closest examples before choosing a template.

## Example 0: Call mode without images

Input:
- Product name
- Shot type
- Usage scenario
- Image ratio

Expected output traits:
- no image analysis claims
- explicit preset choice
- modular Chinese and English prompts
- negative prompt tuned to the shot type
- consistency check still included
- Chinese prompt can follow the template skeleton directly

## Example 0.1: KV英雄图预设选择

Input:
- single-image KV hero shot
- white background product cover

Expected preset:
- 白底极简英雄图

Input:
- single-image KV hero shot
- dark atmospheric technology look

Expected preset:
- 黑蓝科技英雄图

Input:
- single-image KV hero shot
- red-black performance tone

Expected preset:
- 红黑性能英雄图

## Example 0.2: 使用图预设选择

Input:
- single-image usage shot
- white clean wet-shave look with visible foam

Expected preset:
- 白底顺滑湿剃图

Input:
- single-image usage shot
- dark background with efficient, decisive shaving tone

Expected preset:
- 黑底高效剃须图

Input:
- single-image usage shot
- dark technology atmosphere with emphasis on face-contour fit

Expected preset:
- 科技贴合剃须图

## Example 0.3: 细节图预设选择

Input:
- single-image detail shot
- exploded internal layers with motor emphasis

Expected preset:
- 内部结构爆炸图

Input:
- single-image detail shot
- enlarged foil-head arrangement with explanation of long and short blades

Expected preset:
- 刀头结构说明图

Input:
- single-image detail shot
- enlarged foil head with arrows showing floating fit and contour following

Expected preset:
- 刀头贴合动效图

Input:
- single-image detail shot
- extreme macro of foil mesh and center cutter

Expected preset:
- 刀网微距纹理图

Input:
- single-image detail shot
- close-up of comfort ring, texture, or tactile surface behavior

Expected preset:
- 材质触感细节图

Input:
- single-image detail shot
- close-up of body shell, logo, charging port, or metal edge finish

Expected preset:
- 机身工艺细节图

## Example 0.4: 非细节图边界

Input:
- product placed in suitcase with travel copy

Expected preset:
- 旅行收纳图

Input:
- product placed on car seat or car interior surface

Expected preset:
- 车载出行图

Expected rule:
- do not classify these as 细节图

## Example 0.5: 便携/出行场景图预设选择

Input:
- product placed in suitcase, on folded clothing, or inside a travel packing context

Expected preset:
- 旅行收纳图

Input:
- product placed on a car center armrest, leather seat, door pocket edge, or console area with no people

Expected preset:
- 车载出行图

## Example 0.6: 功能说明图预设选择

Input:
- product held under faucet or directly rinsed in sink context

Expected preset:
- 防水冲洗说明图

Input:
- product shown under water or crossing the water surface with waterproof claim

Expected preset:
- 沉浸防水说明图

Input:
- product placed on charging dock or shown with charge-related use moment

Expected preset:
- 充电续航说明图

## Example 0.7: 配件展示图预设选择

Input:
- product shown with gift bag, package box, dock, cable, and full accessory set

Expected preset:
- 配件组合展示图

Input:
- product and all included items arranged with numbered markers or labeled list logic

Expected preset:
- 配件清单说明图

Input:
- product placed on car seat or center armrest in a business-travel context

Expected preset:
- 车载出行图

## Example 1: Single hero product image

Input:
- One white-background product hero image with centered shaver.

Expected analysis focus:
- product shape
- material finish
- camera angle
- clean commercial framing

Expected output traits:
- concise analysis summary
- Chinese prompt and English prompt aligned to the visible image
- negative prompt removes clutter and hallucinated text
- consistency check confirms product shape and brand style

## Example 2: Product in use

Input:
- One European male model image where the shaver touches the lower face or neck.

Expected analysis focus:
- product-to-skin contact
- model pose
- hand placement
- background simplicity

Expected output traits:
- mark face visibility as fact, not assumption
- describe the usage relation precisely
- keep the product dominant

## Example 3: Multiple reference images

Input:
- Three or more product images from the same brand set.

Expected analysis focus:
- shared product shape
- shared color system
- shared background family
- shared lighting logic
- shared commercial tone

Expected output traits:
- identify stable brand style first
- list variable shot-specific elements second
- produce one standardized prompt language pattern
