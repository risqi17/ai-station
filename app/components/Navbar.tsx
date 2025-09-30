'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const links = [
  { href: '/', label: 'Overview' },
  { href: '/image-prompt', label: 'Image Prompt' },
  { href: '/tools', label: 'AI Tools' }
];

export function Navbar() {
  const pathname = usePathname();
  const normalizedPath = pathname?.replace(/\/+$/, '') || '/';

  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav} aria-label="Primary">
        <ul className={styles.navList}>
          {links.map((link) => {
            const normalizedHref = link.href === '/' ? link.href : link.href.replace(/\/+$/, '');
            const isActive = normalizedPath === normalizedHref;
            const linkClassName = isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

            return (
              <li key={link.href}>
                <Link className={linkClassName} href={link.href}>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
