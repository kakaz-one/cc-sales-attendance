'use client';
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { use } from 'react';
import styles from './styles.module.css'

export default function AdminPage({ params }: { params: Promise<{ adminId: string }> }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { adminId } = use(params);

  useEffect(() => {
    // 管理者情報を取得するためのAPI呼び出し
    fetch(`/api/auth/admin/${adminId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('管理者情報の取得に失敗しました');
        }
        return response.json();
      })
      .then(data => {
        setName(data.name);
      })
      .catch(err => {
        console.error('Error fetching admin data:', err);
        setError('管理者情報の取得に失敗しました');
      });
  }, [adminId]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>管理者ページ</h2>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <p>管理者氏名: {name}</p>
        )}
        <div className={styles.buttonContainer}>
          <Link href={`/auth/admin/${adminId}/assignments`}>
            <button className={styles.button}>
              アサイン状況確認ページ
            </button>
          </Link>
          <Link href={`/auth/admin/${adminId}/performance`}>
            <button className={styles.button}>
              従業員成績一覧ページ
            </button>
          </Link>
          <Link href={`/auth/admin/${adminId}/payroll/employee`}>
            <button className={styles.button}>
              従業員（バイト）給与明細ページ
            </button>
          </Link>
          <Link href={`/auth/admin/${adminId}/employees`}>
            <button className={styles.button}>
              従業員一覧ページ
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}