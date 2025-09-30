'use client';

import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import Image from 'next/image';
import styles from '../category-page.module.css';
import type { Tool } from '../../lib/categories';

type ToolGridProps = {
  tools: Tool[];
};

type ActiveToolState = Tool | null;
type CopyStatus = 'idle' | 'copied' | 'error';

export function ToolGrid({ tools }: ToolGridProps) {
  const [activeTool, setActiveTool] = useState<ActiveToolState>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!activeTool) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveTool(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTool]);

  useEffect(() => {
    setCopyStatus('idle');
    if (activeTool) {
      closeButtonRef.current?.focus();
    }
  }, [activeTool]);

  const handleCardClick = (tool: Tool) => {
    setActiveTool(tool);
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setActiveTool(null);
    }
  };

  const handleCopyPrompt = async () => {
    if (!activeTool?.prompt) {
      return;
    }

    try {
      await navigator.clipboard.writeText(activeTool.prompt);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      setCopyStatus('error');
    }
  };

  return (
    <>
      <div className={styles.cardGrid}>
        {tools.map((tool) => {
          const actionLabel = tool.prompt ? 'View prompt' : 'View details';

          return (
            <button
              key={tool.name}
              type="button"
              className={`${styles.card} ${styles.cardButton}`}
              onClick={() => handleCardClick(tool)}
              aria-haspopup="dialog"
            >
              <div className={styles.cardImageWrapper}>
                <Image src={tool.image} alt={tool.name} fill sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <h2 className={styles.cardTitle}>{tool.name}</h2>
              <p className={styles.cardDescription}>{tool.description}</p>
              <span className={styles.cardLink}>{actionLabel}</span>
            </button>
          );
        })}
      </div>

      {activeTool && (
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tool-modal-title"
          onClick={handleBackdropClick}
        >
          <div className={styles.modalContent}>
            <button
              ref={closeButtonRef}
              type="button"
              className={styles.modalClose}
              onClick={() => setActiveTool(null)}
              aria-label="Close dialog"
            >
              x
            </button>

            <div className={styles.modalImageWrapper}>
              <Image
                src={activeTool.image}
                alt={activeTool.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <h2 id="tool-modal-title" className={styles.modalTitle}>
              {activeTool.name}
            </h2>

            <p className={styles.modalDescription}>{activeTool.description}</p>

            {activeTool.prompt && (
              <div className={styles.modalPromptSection}>
                <div className={styles.modalPrompt}>
                  {activeTool.prompt}
                </div>
                <div className={styles.modalPromptActions}>
                  <button type="button" className={styles.copyButton} onClick={handleCopyPrompt}>
                    Copy prompt
                  </button>
                  <span className={styles.copyFeedback} role="status" aria-live="polite">
                    {copyStatus === 'copied' ? 'Copied!' : copyStatus === 'error' ? 'Copy failed' : ''}
                  </span>
                </div>
              </div>
            )}

            <a
              className={styles.modalLink}
              href={activeTool.url}
              target="_blank"
              rel="noreferrer"
            >
              Visit {activeTool.name}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default ToolGrid;

