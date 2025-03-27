'use client';
import { use } from 'react';
import styles from './styles.module.css';

export default function AttendancePage({ params }: { params: Promise<{ employeeId: string; assignmentId: string }> }) {
  const resolvedParams = use(params);
  const { employeeId, assignmentId } = resolvedParams;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>打刻ページ</h2>
      </div>
    </div>
  );
}