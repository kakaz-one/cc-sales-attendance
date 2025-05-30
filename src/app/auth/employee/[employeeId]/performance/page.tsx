//各従業員の個人の成績を表示するページ
'use client';
import { use, useState, useEffect } from 'react';
import styles from './styles.module.css'

export default function EmployeePerformancePage({ params }: { params: Promise<{ employeeId: string }> }) {

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
        <h2>成績一覧ページ</h2>
        <p>従業員氏名: {name}</p>
        <div>
        
        </div>
      </div>
    </div>
  )
}