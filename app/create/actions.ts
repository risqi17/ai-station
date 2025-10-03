'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { Tool } from '../../lib/categories';
import { getCategories, writeCategories } from '../../lib/categories';

export type FormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  categoryId?: string;
};

const allowedMimeTypes = new Map<string, string>([
  ['image/png', '.png'],
  ['image/jpeg', '.jpg'],
  ['image/webp', '.webp'],
  ['image/svg+xml', '.svg']
]);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 60) || 'asset';
}

function fail(message: string): FormState {
  return {
    status: 'error',
    message
  };
}

export async function createToolAction(_: FormState, formData: FormData): Promise<FormState> {
  const categoryId = formData.get('categoryId');
  if (typeof categoryId !== 'string' || !categoryId) {
    return fail('Choose a destination category.');
  }

  const name = formData.get('name');
  if (typeof name !== 'string' || !name.trim()) {
    return fail('Enter a name for the tool or prompt.');
  }

  const description = formData.get('description');
  if (typeof description !== 'string' || !description.trim()) {
    return fail('Add a short description.');
  }

  const url = formData.get('url');
  if (typeof url !== 'string' || !url.trim()) {
    return fail('Provide a link to the tool.');
  }

  const promptValueRaw = formData.get('prompt');
  const promptValue = typeof promptValueRaw === 'string' ? promptValueRaw.trim() : '';

  if (categoryId === 'image-prompt' && !promptValue) {
    return fail('Prompt text is required for image prompts.');
  }

  const image = formData.get('image');

  if (!(image instanceof File) || image.size === 0) {
    return fail('Upload an image preview.');
  }

  const mimeType = image.type;
  const extensionFromMime = allowedMimeTypes.get(mimeType);
  let extension = path.extname(image.name).toLowerCase();

  if (!extension && extensionFromMime) {
    extension = extensionFromMime;
  }

  if (extension === '.jpeg') {
    extension = '.jpg';
  }

  const allowedExtensions = ['.png', '.jpg', '.webp', '.svg'];
  const isAllowedExtension = extension && allowedExtensions.includes(extension);

  if (!extensionFromMime && !isAllowedExtension) {
    return fail('Use a PNG, JPG, SVG, or WEBP image.');
  }

  if (!extension) {
    extension = extensionFromMime ?? '.png';
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const safeSlug = slugify(name.trim());
  const fileName = `${safeSlug}-${Date.now()}${extension}`;
  const filePath = path.join(uploadDir, fileName);
  const filePublicPath = `/uploads/${fileName}`;

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);
  } catch (error) {
    console.error('Failed to persist uploaded image', error);
    return fail('Unable to save the image. Try again.');
  }

  const categories = await getCategories();
  const category = categories.find((candidate) => candidate.id === categoryId);

  if (!category) {
    return fail('Unknown category selected.');
  }

  const trimmedName = name.trim();
  const newTool: Tool = {
    name: trimmedName,
    description: description.trim(),
    image: filePublicPath,
    url: url.trim()
  };

  if (promptValue) {
    newTool.prompt = promptValue;
  }

  category.tools.unshift(newTool);

  try {
    await writeCategories(categories);
  } catch (error) {
    console.error('Failed to update tools.json', error);
    return fail('Could not write to tools data.');
  }

  revalidatePath('/');
  revalidatePath(`/${categoryId}`);

  return {
    status: 'success',
    message: `${trimmedName} added to ${category.title}.`,
    categoryId
  };
}
