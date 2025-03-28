'use client';
import Link from 'next/link'
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css'

export default function AdminPage({ params }: { params: Promise<{ adminId: string }> }) {

  const router = useRouter();
  const { adminId } = use(params);
  const [name, setName] = useState('');

  useEffect(() => {
    // 管理者情報を取得するためのAPI呼び出し
    fetch(`/api/auth/admin/${adminId}`)
      .then(response => response.json())
      .then(data => setName(data.name))
      .catch(err => console.error('Error fetching employee data:', err));
  }, [adminId]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>管理者ページ</h2>
        <p>従業員氏名: {name}</p>
        <div className={styles.buttonContainer}>
          <Link href={`/auth/employee/${adminId}/assignments`}>
            <button className={styles.button}>
              案件一覧ページ
            </button>
          </Link>
          <Link href={`/auth/employee/${adminId}/shifts`}>
            <button className={styles.button}>
              シフト申請ページ
            </button>
          </Link>
          <Link href={`/auth/employee/${adminId}/performance`}>
            <button className={styles.button}>
              成績一覧ページ
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}