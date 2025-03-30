'use client';
import Link from 'next/link'
import { use, useState, useEffect } from 'react';
import styles from './styles.module.css'

export default function EmployeePage({ params }: { params: Promise<{ employeeId: string }> }) {

  const { employeeId } = use(params);
  const [name, setName] = useState('');

  useEffect(() => {
    // 従業員情報を取得するためのAPI呼び出し
    fetch(`/api/auth/employee/${employeeId}`)
      .then(response => response.json())
      .then(data => setName(data.name))
      .catch(err => console.error('Error fetching employee data:', err));
  }, [employeeId]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>従業員ページ</h2>
        <p>従業員氏名: {name}</p>
        <div className={styles.buttonContainer}>
          <Link href={`/auth/employee/${employeeId}/assignments`}>
            <button className={styles.button}>
              案件一覧ページ
            </button>
          </Link>
          <Link href={`/auth/employee/${employeeId}/shifts`}>
            <button className={styles.button}>
              シフト申請ページ
            </button>
          </Link>
          <Link href={`/auth/employee/${employeeId}/performance`}>
            <button className={styles.button}>
              成績一覧ページ
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}