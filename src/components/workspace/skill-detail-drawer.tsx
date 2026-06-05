"use client";

import * as React from "react";
import Image from "next/image";
import { Check, Copy, FileText, Wand2, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { PromptTemplate } from "@/lib/skillsData";

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

type SceneTemplate = {
  id: string;
  name: string;
  desc: string;
  prompt: string;
};

function extractSceneTemplates(template?: PromptTemplate | null): SceneTemplate[] {
  if (!template) return [];

  const matches = [...template.prompt.matchAll(/^## 内部模板\s*(\d+)?[：:]\s*(.+)$/gm)];
  const scenes: SceneTemplate[] = [];

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const next = matches[index + 1];
    const start = (match.index ?? 0) + match[0].length;
    const negativeStart = template.prompt.indexOf("\n## 负面约束", start);
    const end = next?.index ?? (negativeStart === -1 ? template.prompt.length : negativeStart);
    const prompt = template.prompt.slice(start, end).replace(/\n---\n?/g, "").trim();

    if (!prompt) continue;

    scenes.push({
      id: `${template.id}-scene-${index + 1}`,
      name: match[2].trim(),
      desc: "来自当前 Skill 大包的内部模板。选择它后，会和本次需求一起交给 Skill 补全节点。",
      prompt,
    });
  }

  if (scenes.length > 0) return scenes;

  return [{
    id: `${template.id}-bundle`,
    name: "完整 Skill 大包",
    desc: "当前 Skill 没有拆出独立内部模板，将使用整个 Skill 规则包参与补全。",
    prompt: template.prompt,
  }];
}

function getSkillDescription(template?: PromptTemplate | null) {
  if (!template) return "选择一个 Skill 后，这里会展示它的大包规则和内部模板。";

  const firstMeaningfulLine = template.prompt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("#"));

  return firstMeaningfulLine?.slice(0, 160) || `${template.styleName} 的完整 Skill 规则包。`;
}

export function SkillDetailDrawer({
  open,
  onOpenChange,
  template,
  onApply,
  onFillPrompt,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  template?: PromptTemplate | null;
  onApply: () => void;
  onFillPrompt?: (sceneName: string, scenePrompt: string) => void;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  const skillTitle = template?.styleName || "Skill 详情";
  const skillDescription = getSkillDescription(template);
  const sceneTemplates = React.useMemo(() => extractSceneTemplates(template), [template]);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const handleCopy = async () => {
    const text = sceneTemplates.map((t) => `${t.name}\n${t.prompt}`).join("\n\n---\n\n");
    await navigator.clipboard.writeText(text || template?.prompt || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-[640px] border-l border-border bg-background p-0 sm:max-w-[640px]">
        <SheetTitle className="sr-only">{skillTitle}</SheetTitle>
        <ScrollArea className="h-full">
          <div className="pb-8">
            <div className="relative">
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                  {CAROUSEL_IMAGES.map((src, i) => (
                    <CarouselItem key={src}>
                      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        <Image
                          src={src}
                          alt={`Skill 示例图 ${i + 1}`}
                          fill
                          unoptimized
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

              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {CAROUSEL_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => api?.scrollTo(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === current ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
                    )}
                  />
                ))}
              </div>

              <SheetClose className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50">
                <X className="h-3.5 w-3.5" />
              </SheetClose>
            </div>

            <div className="px-6 pt-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-foreground">{skillTitle}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{skillDescription}</p>
                  {template && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {template.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    onClick={handleCopy}
                    variant="outline"
                    className="h-8 gap-1.5 rounded-lg border-border/60 bg-card px-3 text-xs font-medium text-foreground hover:bg-secondary"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "已复制" : "复制内部模板"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={onApply}
                    className="h-8 gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    应用此 Skill
                  </Button>
                </div>
              </div>
            </div>

            <div className="px-6 pt-6">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">内部模板库</h3>
                <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {sceneTemplates.length} 个
                </span>
              </div>
              <Accordion type="multiple" className="space-y-2">
                {sceneTemplates.map((tpl, idx) => (
                  <AccordionItem key={tpl.id} value={tpl.id} className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
                    <AccordionTrigger className="px-4 py-3 text-xs font-semibold text-foreground hover:bg-secondary/40 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <span className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-muted-foreground">
                          {idx + 1}
                        </span>
                        <span className="text-left">{tpl.name}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3">
                      <p className="mb-2 text-[11px] text-muted-foreground">{tpl.desc}</p>
                      <div className="max-h-48 overflow-y-auto rounded-lg bg-secondary/50 p-3">
                        <p className="whitespace-pre-wrap text-[11px] leading-relaxed text-foreground/80">{tpl.prompt}</p>
                      </div>
                      {onFillPrompt && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onFillPrompt(tpl.name, tpl.prompt);
                          }}
                          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary/10 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-primary/20"
                        >
                          <Wand2 className="h-3 w-3" />
                          使用此内部模板生成
                        </button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {template?.negativePrompt && (
              <div className="px-6 pt-6">
                <h3 className="mb-3 text-sm font-bold text-foreground">负面约束</h3>
                <div className="max-h-36 overflow-y-auto rounded-xl border border-border/50 bg-card p-3 text-[11px] leading-relaxed text-muted-foreground">
                  {template.negativePrompt}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
