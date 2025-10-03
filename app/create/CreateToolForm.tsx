'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import styles from './create-page.module.css';
import { createToolAction } from './actions';
import { initialFormState } from './formState';

type Option = {
  id: string;
  title: string;
};

type CreateToolFormProps = {
  categories: Option[];
};

export function CreateToolForm({ categories }: CreateToolFormProps) {
  const [state, formAction] = useFormState(createToolAction, initialFormState);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} className={styles.form} action={formAction}>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="categoryId">
          Category
        </label>
        <select className={styles.select} id="categoryId" name="categoryId" required defaultValue="">
          <option value="" disabled>
            Choose a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.fieldGrid}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="name">
            Name
          </label>
          <input className={styles.input} id="name" name="name" type="text" required placeholder="Enter a tool name" />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="url">
            URL
          </label>
          <input className={styles.input} id="url" name="url" type="url" required placeholder="https://example.com" />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="description">
          Description
        </label>
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          id="description"
          name="description"
          rows={4}
          required
          placeholder="Describe how this tool helps or what the prompt delivers"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="prompt">
          Prompt
        </label>
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          id="prompt"
          name="prompt"
          rows={5}
          placeholder="Paste the prompt text used to create the image"
        />
        <p className={styles.fieldHint}>Required when saving to Image Prompt Inspiration.</p>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="image">
          Image Upload
        </label>
        <input className={styles.input} id="image" name="image" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" required />
        <p className={styles.fieldHint}>PNG, JPG, SVG, or WEBP. 2 MB max recommended.</p>
      </div>

      {state.status === 'error' && state.message ? (
        <p className={styles.errorMessage} role="alert">
          {state.message}
        </p>
      ) : null}

      {state.status === 'success' && state.message ? (
        <p className={styles.successMessage} role="status">
          {state.message}{' '}
          {state.categoryId ? (
            <Link className={styles.inlineLink} href={`/${state.categoryId}`}>
              View collection
            </Link>
          ) : null}
        </p>
      ) : null}

      <div className={styles.actionsRow}>
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className={styles.submitButton} type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save entry'}
    </button>
  );
}

