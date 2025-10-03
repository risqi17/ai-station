import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from '../category-page.module.css';
import { CategoryContent } from '../components/CategoryContent';
import { getCategories, getCategoryById } from '../../lib/categories';

type CategoryPageProps = {
  params: {
    categoryId: string;
  };
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map(({ id }) => ({ categoryId: id }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryById(params.categoryId);

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested collection could not be located.'
    };
  }

  return {
    title: `${category.title} - AI Tools Library`,
    description: category.description
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryById(params.categoryId);

  if (!category) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Collection</p>
        <h1 className={styles.title}>{category.title}</h1>
        <p className={styles.subtitle}>{category.description}</p>
      </header>

      <CategoryContent tools={category.tools} />

      <div className={styles.footerCta}>
        <Link className={styles.backLink} href="/">
          &larr; Back to overview
        </Link>
      </div>
    </main>
  );
}
