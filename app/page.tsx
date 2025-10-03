import Link from 'next/link';
import styles from './home.module.css';
import { getCategories } from '../lib/categories';

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>AI Tools Library</h1>
        <p className={styles.heroSubtitle}>
          Explore a curated collection of AI resources split across two focused tracks: tools for crafting evocative
          image prompts and platforms that supercharge daily workflows.
        </p>
        <div className={styles.ctaRow}>
          <Link className={styles.ctaLink} href="/image-prompt">
            Explore Image Prompts &gt;
          </Link>
          <Link className={styles.ctaLink} href="/tools">
            Explore AI Tools &gt;
          </Link>
        </div>
      </header>

      <section>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionEyebrow}>Jump in</p>
          <h2 className={styles.sectionTitle}>Pick a starting point</h2>
          <p className={styles.sectionSubtitle}>
            Each collection dives deep into hand-picked products, complete with quick overviews and direct links so you
            can evaluate them faster.
          </p>
        </div>

        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <Link key={category.id} className={styles.categoryCard} href={`/${category.id}`}>
              <h3 className={styles.categoryTitle}>{category.title}</h3>
              <p className={styles.categoryDescription}>{category.description}</p>
              <span className={styles.categoryLink}>View collection &gt;</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
