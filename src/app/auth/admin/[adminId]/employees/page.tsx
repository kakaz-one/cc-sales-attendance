//従業員一覧ページ(管理者権限の有無も表示)
'use client';
import { useState, useEffect } from 'react';
import { use } from 'react';
import styles from './styles.module.css'

interface Employee {
  employee_id: number;
  name: string;
  role: 'バイト' | '社員' | '契約社員';
  is_admin: boolean;
}

export default function AdminEmployeesPage({ params }: { params: Promise<{ adminId: string }> }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState('');
  const { adminId } = use(params);

  useEffect(() => {
    // 従業員情報を取得するためのAPI呼び出し
    fetch('/api/auth/admin/${adminId}/employees')
      .then(response => {
        if (!response.ok) {
          throw new Error('従業員情報の取得に失敗しました');
        }
        return response.json();
      })
      .then(data => {
        setEmployees(data);
      })
      .catch(err => {
        console.error('Error fetching employees data:', err);
        setError('従業員情報の取得に失敗しました');
      });
  }, [adminId]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>従業員一覧</h2>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <div className={styles.employeeList}>
            <div className={styles.header}>
              <span>名前</span>
              <span>役割</span>
              <span>管理者権限</span>
            </div>
            {employees.map((employee) => (
              <div key={employee.employee_id} className={styles.employeeRow}>
                <span>{employee.name}</span>
                <span>{employee.role}</span>
                <span>{employee.is_admin ? '有り' : '無し'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}