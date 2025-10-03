import { promises as fs } from 'fs';
import path from 'path';

export type Tool = {
  name: string;
  description: string;
  image: string;
  url: string;
  prompt?: string;
};

export type Category = {
  id: string;
  title: string;
  description: string;
  tools: Tool[];
};

type ToolsFileShape = {
  categories: Category[];
};

export const toolsDataPath = path.join(process.cwd(), 'data', 'tools.json');

async function readToolsFile(): Promise<ToolsFileShape> {
  const fileContents = await fs.readFile(toolsDataPath, 'utf8');
  return JSON.parse(fileContents) as ToolsFileShape;
}

export async function getCategories(): Promise<Category[]> {
  const data = await readToolsFile();
  return data.categories;
}

export async function getCategoryById(categoryId: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((category) => category.id === categoryId);
}

export async function writeCategories(categories: Category[]): Promise<void> {
  const json = `${JSON.stringify({ categories }, null, 2)}\n`;
  await fs.writeFile(toolsDataPath, json, 'utf8');
}
