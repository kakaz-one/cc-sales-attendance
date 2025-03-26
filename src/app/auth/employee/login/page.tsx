'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

export default function Page() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      console.log('id:', id);
      console.log('password:', password);
      const response = await fetch('/api/auth/employee/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId: id, password }),
      });

      const data = await response.json();
      console.log('API Response:', data); // デバッグ用ログ

      if (!response.ok) {
        setError(data.message);
        return;
      }

      // ログイン成功時の処理
      router.push(`/auth/employee/${data.employeeId}`);
    } catch (err) {
      console.error('Error during login:', err); // デバッグ用ログ
      setError('ログイン処理中にエラーが発生しました');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>従業員ログイン</h2>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="employeeId">
              従業員ID
            </label>
            <input
              id="employeeId"
              type="text"
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}
