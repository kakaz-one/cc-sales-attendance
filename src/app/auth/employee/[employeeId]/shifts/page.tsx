//従業員のシフト申請ページ
'use client';
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css'

export default function EmployeeShiftsPage({ params }: { params: Promise<{ employeeId: string }> }) {

  const router = useRouter();
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
        <h2>シフト申請ページ</h2>
        <p>従業員氏名: {name}</p>
        <div>
        
        </div>
      </div>
    </div>
  )
}