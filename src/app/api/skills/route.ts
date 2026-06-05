import { NextResponse } from 'next/server';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PromptTemplate {
  id: string;
  category: string;
  subCategory: string;
  visualStyle: string;
  styleName: string;
  prompt: string;
  coverUrl: string | null;
  negativePrompt: string;
  tags: string[];
}

interface CategoryNode {
  label: string;
  children?: CategoryNode[];
  templateIds?: string[];
  icon?: string;
}

interface SkillMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  visualStyle: string;
  tags: string[];
  icon: string;
}

const ALLOWED_REFERENCE_FILES = new Set([
  'prompt-templates-zh.md',
  'prompt-templates.md',
  'call-mode.md',
  'negative-prompts.md',
]);

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'skill';
}

function parseFrontmatter(markdown: string) {
  if (!markdown.startsWith('---')) return { data: {} as Record<string, string>, body: markdown };
  const end = markdown.indexOf('\n---', 3);
  if (end === -1) return { data: {} as Record<string, string>, body: markdown };

  const raw = markdown.slice(3, end).trim();
  const body = markdown.slice(end + 4).trim();
  const data: Record<string, string> = {};

  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    data[match[1]] = match[2].replace(/^["']|["']$/g, '').trim();
  }

  return { data, body };
}

function inferSkillMeta(folderName: string, skillMarkdown: string): SkillMeta {
  const { data, body } = parseFrontmatter(skillMarkdown);
  const id = slugify(data.name || folderName);
  const name = data.name || folderName;
  const description = data.description || body.split(/\r?\n/).find((line) => line.trim()) || name;
  const lowered = `${folderName} ${name} ${description}`.toLowerCase();

  if (lowered.includes('massage')) {
    return {
      id,
      name,
      description,
      category: '健康按摩',
      subCategory: '按摩坐垫靠垫床垫',
      visualStyle: '暗暖生活方式',
      tags: ['按摩', '暗暖', '电商', '生活方式'],
      icon: 'heart',
    };
  }

  if (lowered.includes('shaver') || lowered.includes('razor')) {
    return {
      id,
      name,
      description,
      category: '个护电器',
      subCategory: '剃须刀鼻毛修剪器',
      visualStyle: '剃须刀商业摄影',
      tags: ['剃须刀', '个护', '电商', '商业摄影'],
      icon: 'sparkles',
    };
  }

  return {
    id,
    name,
    description,
    category: '外部 Skill',
    subCategory: name,
    visualStyle: '外部 Skill',
    tags: ['外部Skill'],
    icon: 'sparkles',
  };
}

function extractFencedText(section: string) {
  const fences = [...section.matchAll(/```(?:text|md|markdown)?\s*([\s\S]*?)```/gi)];
  if (fences.length > 0) {
    return fences.map((match) => match[1].trim()).filter(Boolean).join('\n\n');
  }
  return section.trim();
}

function parseHeadingTemplates(markdown: string) {
  const matches = [...markdown.matchAll(/^##\s+(.+)$/gm)];
  const templates: Array<{ title: string; prompt: string }> = [];

  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const next = matches[i + 1];
    const title = match[1].trim();
    const start = (match.index ?? 0) + match[0].length;
    const end = next?.index ?? markdown.length;
    const section = markdown.slice(start, end).trim();
    const prompt = extractFencedText(section);

    if (prompt.length < 80) continue;
    if (!/模板|完整|KV|Prompt|图|场景|hero|usage|detail/i.test(title)) continue;

    templates.push({ title: title.replace(/^模板\s*\d+\s*[：:]\s*/, ''), prompt });
  }

  return templates;
}

function parseExampleTemplate(fileName: string, markdown: string) {
  const chinesePromptMatch = markdown.match(/##\s*2\.\s*Chinese Prompt[\s\S]*?```(?:text)?\s*([\s\S]*?)```/i);
  const prompt = chinesePromptMatch?.[1]?.trim() || extractFencedText(markdown);
  if (prompt.length < 80) return null;

  return {
    title: fileName.replace(/\.md$/i, '').replace(/[-_]+/g, ' '),
    prompt,
  };
}

function buildSkillBundlePrompt(
  meta: SkillMeta,
  skillMarkdown: string,
  templates: Array<{ title: string; prompt: string }>,
  negativePrompt: string
) {
  const templateLibrary = templates.length
    ? templates
        .map((template, index) => [
          `## 内部模板 ${index + 1}：${template.title}`,
          template.prompt,
        ].join('\n'))
        .join('\n\n---\n\n')
    : '此 Skill 未提供独立模板，请优先遵循 SKILL.md 的规则。';

  return [
    `# Skill 大包：${meta.name}`,
    '',
    '你正在使用的是一个完整 Skill 包。下面的 SKILL.md、内部模板库和负面约束必须作为同一个技能整体理解，不要把内部模板当作独立 Skill。',
    '',
    '## SKILL.md',
    skillMarkdown.trim(),
    '',
    '## 内部模板库',
    templateLibrary,
    '',
    '## 负面约束',
    negativePrompt.trim() || '无',
  ].join('\n');
}

async function readTextIfExists(filePath: string) {
  try {
    return await readFile(filePath, 'utf8');
  } catch {
    return '';
  }
}

async function loadSkillFolder(root: string, folderName: string) {
  const skillPath = path.join(root, folderName);
  const entryStat = await stat(skillPath);
  if (!entryStat.isDirectory()) return [];

  const skillMarkdown = await readTextIfExists(path.join(skillPath, 'SKILL.md'));
  if (!skillMarkdown) return [];

  const meta = inferSkillMeta(folderName, skillMarkdown);
  const negativePrompt = await readTextIfExists(path.join(skillPath, 'references', 'negative-prompts.md'));
  const rawTemplates: Array<{ title: string; prompt: string }> = [];

  const referencesPath = path.join(skillPath, 'references');
  try {
    const referenceFiles = await readdir(referencesPath);
    for (const fileName of referenceFiles) {
      if (!ALLOWED_REFERENCE_FILES.has(fileName)) continue;
      const content = await readTextIfExists(path.join(referencesPath, fileName));
      rawTemplates.push(...parseHeadingTemplates(content));
    }
  } catch {
    // A skill can be valid with only SKILL.md.
  }

  const examplesPath = path.join(skillPath, 'examples');
  try {
    const exampleFiles = (await readdir(examplesPath)).filter((fileName) => fileName.endsWith('.md'));
    for (const fileName of exampleFiles) {
      const content = await readTextIfExists(path.join(examplesPath, fileName));
      const parsed = parseExampleTemplate(fileName, content);
      if (parsed) rawTemplates.push(parsed);
    }
  } catch {
    // Examples are optional.
  }

  return [{
    id: slugify(folderName),
    category: meta.category,
    subCategory: meta.subCategory,
    visualStyle: meta.visualStyle,
    styleName: meta.name,
    prompt: buildSkillBundlePrompt(meta, skillMarkdown, rawTemplates, negativePrompt),
    coverUrl: null,
    negativePrompt,
    tags: [...new Set([...meta.tags, meta.subCategory])],
  }] satisfies PromptTemplate[];
}

function buildCategoryTree(templates: PromptTemplate[]): CategoryNode[] {
  const categoryMap = new Map<string, { icon: string; children: Map<string, string[]> }>();

  for (const template of templates) {
    const icon = template.category === '健康按摩' ? 'heart' : 'sparkles';
    if (!categoryMap.has(template.category)) {
      categoryMap.set(template.category, { icon, children: new Map() });
    }

    const category = categoryMap.get(template.category)!;
    const ids = category.children.get(template.subCategory) ?? [];
    ids.push(template.id);
    category.children.set(template.subCategory, ids);
  }

  return [...categoryMap.entries()].map(([label, data]) => ({
    label,
    icon: data.icon,
    children: [...data.children.entries()].map(([childLabel, templateIds]) => ({
      label: childLabel,
      templateIds,
    })),
  }));
}

export async function GET() {
  const root = process.env.SKILLS_ROOT?.trim();
  if (!root) {
    return NextResponse.json({ templates: [], categoryTree: [], root: null, error: 'SKILLS_ROOT is not configured' });
  }

  try {
    const entries = await readdir(root);
    const templateGroups = await Promise.all(entries.map((entry) => loadSkillFolder(root, entry)));
    const templates = templateGroups.flat();

    return NextResponse.json({
      templates,
      categoryTree: buildCategoryTree(templates),
      root,
      count: templates.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        templates: [],
        categoryTree: [],
        root,
        error: error instanceof Error ? error.message : 'Failed to load skills',
      },
      { status: 500 }
    );
  }
}
