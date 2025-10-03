import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './create-page.module.css';
import { getCategories } from '../../lib/categories';
import { CreateToolForm } from './CreateToolForm';

export const metadata: Metadata = {
  title: 'Add New Tool - AI Tools Library',
  description:
    'Upload an image and collect the details for a new entry in the Image Prompt or AI Tools collections.'
};

export default async function CreatePage() {
  const categories = await getCategories();
  const categoryOptions = categories.map((category) => ({ id: category.id, title: category.title }));

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Manage</p>
        <h1 className={styles.title}>Create a new entry</h1>
        <p className={styles.subtitle}>
          Add fresh discovery to the library by pairing a cover image with the essential details, including prompts for
          inspiration and quick access links.
        </p>
        <Link className={styles.inlineLink} href="/">
          &larr; Back to overview
        </Link>
      </header>

      <CreateToolForm categories={categoryOptions} />
    </main>
  );
}
