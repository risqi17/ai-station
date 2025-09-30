import toolsData from '../data/tools.json';

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

export const categories = toolsData.categories as Category[];

export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find((category) => category.id === categoryId);
}
