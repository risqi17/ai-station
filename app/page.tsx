import Image from 'next/image';
import styles from './page.module.css';
import toolsData from '../data/tools.json';

type Tool = {
  name: string;
  description: string;
  image: string;
  url: string;
};

type Category = {
  id: string;
  title: string;
  description: string;
  tools: Tool[];
};

const categories = toolsData.categories as Category[];

export default function HomePage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>AI Tools Library</h1>
        <p className={styles.subtitle}>
          Explore a curated collection of AI resources across two essential categories: tools for crafting
          captivating image prompts and platforms that supercharge your daily workflows.
        </p>
      </header>

      {categories.map((category) => (
        <section key={category.id} className={styles.categorySection}>
          <div className={styles.categoryHeader}>
            <h2 className={styles.categoryTitle}>{category.title}</h2>
            <p className={styles.categoryDescription}>{category.description}</p>
          </div>

          <div className={styles.cardGrid}>
            {category.tools.map((tool) => (
              <article key={tool.name} className={styles.card}>
                <div className={styles.cardImageWrapper}>
                  <Image src={tool.image} alt={tool.name} fill sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <h3 className={styles.cardTitle}>{tool.name}</h3>
                <p className={styles.cardDescription}>{tool.description}</p>
                <a className={styles.cardLink} href={tool.url} target="_blank" rel="noreferrer">
                  Visit {tool.name}
                </a>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
