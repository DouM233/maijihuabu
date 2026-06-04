"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Wand2,
  Copy,
  Check,
  Palette,
  Paintbrush,
  Box,
  User,
  Lamp,
  Aperture,
  Eye,
  FileText,
  ChevronRight,
  X,
} from "lucide-react";

/* ─── 数据 ─── */
const CAROUSEL_IMAGES = [
  "/skills/carousel-1.jpg",
  "/skills/carousel-2.jpg",
  "/skills/carousel-3.jpg",
  "/skills/carousel-4.jpg",
  "/skills/carousel-5.jpg",
  "/skills/carousel-6.jpg",
  "/skills/carousel-7.jpg",
  "/skills/carousel-8.jpg",
];

const STYLE_DNA = [
  {
    id: "tone",
    icon: Palette,
    title: "核心色调",
    content: [
      "三种互补的照明强度",
      "低照度：日落/黄昏/暖夜室内 - 温暖琥珀色，昏暗亲切",
      "中照度：办公/工作/早晨 - 柔和自然光，干净高效",
      "高照度：明亮清晰/产品纯底 - 干净专业，适合细节",
      "温暖琥珀色基调整体统一三种情绪场景",
    ],
  },
  {
    id: "color",
    icon: Paintbrush,
    title: "颜色系统",
    content: [
      "环境色系：焦糖棕 #9C6644 / 太妃棕 #7F5539 / 胡桃木 #5C4033 / 燕麦米 #D4C4B0",
      "产品色系：薄荷绿 #B8D4B8 / 鼠尾草绿 #9CAF88",
      "两种系统之间必须始终保持清晰对比",
    ],
  },
  {
    id: "product",
    icon: Box,
    title: "产品规则",
    content: [
      "蝴蝶结轮廓：对称流线，柔软圆润，8-10cm厚度",
      "颜色：薄荷绿/鼠尾草绿主体 + 深绿色(#2D5016)滚边/包边",
      "控制面板：带LED背光（弱光场景下可见）",
      "露出比例：清晰轮廓60-70%，融入场景30-40%",
    ],
  },
  {
    id: "model",
    icon: User,
    title: "模特标准",
    content: [
      "欧洲白人女性，25-32岁，身材纤细，放松姿态",
      "发型变体：松散波浪低马尾 / 自然凌乱松散波浪 / 利落高马尾",
      "服装家族：缎面睡衣（香槟色/奶油白）/ 焦糖西装外套 / 奶油色高领毛衣",
    ],
  },
  {
    id: "environment",
    icon: Lamp,
    title: "环境锚点",
    content: [
      "客厅：焦糖天鹅绒沙发、胡桃木边桌、暖色落地灯、百叶窗",
      "卧室：奶油色亚麻床品、暖木床头柜、微弱床头灯",
      "办公：胡桃木办公桌、极简主义桌面、自然窗光、都市天际线",
      "微光之夜：弱化一切背景元素，产品发光为主角",
    ],
  },
  {
    id: "lighting",
    icon: Aperture,
    title: "灯光与相机",
    content: [
      "光线方向：单侧暖光（左上或右上），强琥珀棕色阴影，高对比度",
      "产品光：缎面柔和高光 + 清晰材质纹理",
      "镜头：85mm等效，中画幅质感，浅景深但不完全虚化",
      "画幅：竖版3:4或4:5，产品正面或3/4微俯视角",
    ],
  },
];

const SCENE_TEMPLATES = [
  {
    id: "t1",
    name: "沙发日落腰靠主视觉",
    desc: "低照度暖夜客厅，模特半躺沙发，产品作为视觉焦点",
    prompt:
      "欧洲白人女性25-32岁，穿着香槟色缎面睡衣，松散波浪低马尾，在焦糖天鹅绒沙发上半躺放松。一个薄荷绿色的蝴蝶结轮廓腰靠垫放在她背后，深绿色包边清晰可见，8-10cm厚度感。暖色落地灯从左侧投射柔和琥珀光，强琥珀棕色阴影，高对比度。背景有胡桃木边桌和微弱百叶窗光线。85mm等效镜头，竖版4:5，产品正面视角，清晰轮廓70%露出。",
  },
  {
    id: "t2",
    name: "居家办公腰靠图",
    desc: "中照度办公场景，模特使用腰靠保持正确坐姿",
    prompt:
      "欧洲白人女性25-32岁，穿着焦糖色西装外套，自然凌乱松散波浪发，坐在胡桃木办公桌前保持正确坐姿。一个鼠尾草绿色的蝴蝶结轮廓腰靠垫放在办公椅后背，深绿色包边清晰可见。自然窗光从右侧进入，干净高效的柔和光线。极简主义桌面，都市天际线隐约可见。85mm等效镜头，竖版3:4，3/4微俯视角。",
  },
  {
    id: "t3",
    name: "亲子夜间放松图",
    desc: "微光夜景，母亲与孩子在床上阅读，腰靠提供支撑",
    prompt:
      "欧洲白人女性25-32岁，穿着奶油色高领毛衣，利落高马尾，在床上与孩子一起阅读绘本。一个薄荷绿色的蝴蝶结轮廓腰靠垫放在她背后支撑腰部。微弱床头灯从左侧投射极柔和的琥珀光，背景极度弱化。高ISO微颗粒感，亲密温馨氛围。85mm等效镜头，竖版4:5，产品融入场景40%露出。",
  },
  {
    id: "t4",
    name: "颈部热敷按摩图",
    desc: "产品特写，展示颈部热敷和按摩功能",
    prompt:
      "特写镜头：一个薄荷绿色的蝴蝶结轮廓颈部按摩仪佩戴在欧洲白人女性颈部，深绿色包边清晰可见。LED指示灯微弱发光，显示工作状态。单侧暖光从左上投射，清晰展现材质纹理和缎面柔和高光。深棕色纯色背景。85mm等效微距，竖版3:4，产品正面视角。",
  },
  {
    id: "t5",
    name: "追剧宅家放松图",
    desc: "低照度客厅，模特窝在沙发追剧，腰靠提供舒适支撑",
    prompt:
      "欧洲白人女性25-32岁，穿着香槟色缎面睡衣，松散波浪低马尾，窝在焦糖天鹅绒沙发里追剧。一个鼠尾草绿色的蝴蝶结轮廓腰靠垫放在她背后，深绿色包边清晰可见。电视屏幕发出极柔和的冷蓝光对比。暖色落地灯从右侧投射，强琥珀棕色阴影。85mm等效镜头，竖版4:5，氛围感构图。",
  },
  {
    id: "t6",
    name: "高俯视腿上/腹部使用图",
    desc: "高角度俯拍，展示产品在腿上或腹部的使用方式",
    prompt:
      "高角度俯拍：欧洲白人女性25-32岁，穿着奶油色亚麻家居服，坐在床上。一个薄荷绿色的蝴蝶结轮廓按摩仪放在她腹部，深绿色包边清晰可见。自然窗光均匀柔和，阴影极弱。奶油色亚麻床品和暖木床头柜作为环境。85mm等效镜头，俯视60度角，竖版3:4。",
  },
  {
    id: "t7",
    name: "慢回弹材质特写图",
    desc: "微距特写，展示慢回弹记忆棉材质特性",
    prompt:
      "微距特写：手指按压薄荷绿色记忆棉材质表面，展示慢回弹特性。深绿色包边在画面边缘隐约可见。材质纹理清晰，气孔结构细腻。单侧硬光从左上投射，强调纹理和立体感。深棕色纯色背景。100mm等效微距，竖版3:4。",
  },
  {
    id: "t8",
    name: "腰部贴合对比拼图",
    desc: "左右对比，展示使用腰靠前后的腰部支撑差异",
    prompt:
      "左右分屏对比拼图：左侧展示没有腰靠时腰部悬空的不良坐姿；右侧展示使用鼠尾草绿色蝴蝶结轮廓腰靠后腰部完全贴合支撑的正确坐姿。同一位欧洲白人女性25-32岁，穿着相同服装。中照度办公环境，自然窗光。整体画面干净专业，适合电商详情页。",
  },
  {
    id: "t9",
    name: "短版快试模板",
    desc: "精简版提示词，用于快速验证效果",
    prompt:
      "薄荷绿色蝴蝶结轮廓腰靠垫，深绿色包边，欧洲白人女性25岁，焦糖天鹅绒沙发，暖琥珀色单侧光，竖版4:5。",
  },
];

const REVIEW_RULES = [
  { label: "风格稳定性", desc: "暖调/琥珀/产品色系统一，无冷白或荧光干扰" },
  { label: "产品可读性", desc: "轮廓/包边/露出比例符合规则，不模糊变形" },
  { label: "卖点清晰度", desc: "支撑/热敷/材质回弹/亲子 relief 至少传达一个" },
  { label: "最小修正原则", desc: "只改失败点，不动工作元素" },
];

/* ─── 组件 ─── */
export function SkillDetailDrawer({
  open,
  onOpenChange,
  onApply,
  onFillPrompt,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onApply: () => void;
  onFillPrompt?: (sceneName: string, scenePrompt: string) => void;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const handleCopy = async () => {
    const text = SCENE_TEMPLATES.map((t) => `${t.name}\n${t.prompt}`).join("\n\n---\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-[640px] border-l border-border bg-background p-0 sm:max-w-[640px]"
      >
        <SheetTitle className="sr-only">暗色调按摩枕 Skill 详情</SheetTitle>
        <ScrollArea className="h-full">
          <div className="pb-8">
            {/* ─── 轮播图 ─── */}
            <div className="relative">
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                  {CAROUSEL_IMAGES.map((src, i) => (
                    <CarouselItem key={i}>
                      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        <Image
                          src={src}
                          alt={`示例图 ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="640px"
                          priority={i === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-3 h-8 w-8 border-none bg-black/30 text-white hover:bg-black/50 hover:text-white" />
                <CarouselNext className="right-3 h-8 w-8 border-none bg-black/30 text-white hover:bg-black/50 hover:text-white" />
              </Carousel>

              {/* 指示器 */}
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {CAROUSEL_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === current ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
                    )}
                  />
                ))}
              </div>

              {/* 关闭按钮 */}
              <SheetClose className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50">
                <X className="h-3.5 w-3.5" />
              </SheetClose>
            </div>

            {/* ─── 标题与操作 ─── */}
            <div className="px-6 pt-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-foreground">
                    暗色调按摩枕
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    为淘宝/JD创造高端电商生活方式图片。低照度暖琥珀色调，薄荷绿/鼠尾草绿产品，欧洲模特，日落/黄昏/暖夜室内场景。
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    onClick={handleCopy}
                    variant="outline"
                    className="h-8 gap-1.5 rounded-lg border-border/60 bg-card px-3 text-xs font-medium text-foreground hover:bg-secondary"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "已复制" : "复制提示词"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={onApply}
                    className="h-8 gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    应用此模板
                  </Button>
                </div>
              </div>
            </div>

            {/* ─── 风格DNA ─── */}
            <div className="px-6 pt-6">
              <div className="mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">风格 DNA</h3>
              </div>
              <Accordion type="multiple" defaultValue={["tone"]} className="space-y-2">
                {STYLE_DNA.map((item) => {
                  const Icon = item.icon;
                  return (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm"
                    >
                      <AccordionTrigger className="px-4 py-3 text-xs font-semibold text-foreground hover:no-underline hover:bg-secondary/40 [&[data-state=open]>svg]:rotate-180">
                        <span className="flex items-center gap-2.5">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                            <Icon className="h-3.5 w-3.5 text-primary" />
                          </span>
                          {item.title}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3">
                        <ul className="space-y-1.5 pl-9">
                          {item.content.map((line, i) => (
                            <li
                              key={i}
                              className="text-xs leading-relaxed text-muted-foreground"
                            >
                              {line}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>

            {/* ─── 场景模板 ─── */}
            <div className="px-6 pt-6">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">场景模板库</h3>
                <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {SCENE_TEMPLATES.length} 个
                </span>
              </div>
              <Accordion type="multiple" className="space-y-2">
                {SCENE_TEMPLATES.map((tpl, idx) => (
                  <AccordionItem
                    key={tpl.id}
                    value={tpl.id}
                    className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm"
                  >
                    <AccordionTrigger className="px-4 py-3 text-xs font-semibold text-foreground hover:no-underline hover:bg-secondary/40 [&[data-state=open]>svg]:rotate-180">
                      <span className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-muted-foreground">
                          {idx + 1}
                        </span>
                        <span className="text-left">{tpl.name}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3">
                      <p className="mb-2 text-[11px] text-muted-foreground">
                        {tpl.desc}
                      </p>
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-[11px] leading-relaxed text-foreground/80">
                          {tpl.prompt}
                        </p>
                      </div>
                      {onFillPrompt && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onFillPrompt(tpl.name, tpl.prompt);
                          }}
                          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary/10 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-primary/20"
                          title="将此场景模板注入到右侧聊天输入区"
                        >
                          <Wand2 className="h-3 w-3" />
                          使用此场景生成
                        </button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* ─── 审核规则 ─── */}
            <div className="px-6 pt-6">
              <div className="mb-3 flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">审核与迭代</h3>
              </div>
              <div className="space-y-2">
                {REVIEW_RULES.map((rule, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-border/50 bg-card p-3 shadow-sm"
                  >
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-primary/30">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {rule.label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {rule.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
