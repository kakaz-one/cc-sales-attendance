//従業員ごとのその月の案件一覧ページ
'use client';
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css'
import Link from 'next/link';
interface Assignment {
  assignmentId: number;
  workDate: string;
  locationName: string;
  plannedStartTime: string | null;
  plannedEndTime: string | null;
}

export default function EmployeeAssignmentsPage({ params }: { params: Promise<{ employeeId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { employeeId } = resolvedParams;
  const [name, setName] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 従業員情報の取得
        const employeeResponse = await fetch(`/api/auth/employee/${employeeId}`);
        if (!employeeResponse.ok) throw new Error('従業員情報の取得に失敗しました');
        const employeeData = await employeeResponse.json();
        setName(employeeData.name);

        // 案件一覧の取得
        const assignmentsResponse = await fetch(`/api/auth/employee/${employeeId}/assignments`);
        if (!assignmentsResponse.ok) throw new Error('案件一覧の取得に失敗しました');
        const assignmentsData = await assignmentsResponse.json();
        setAssignments(assignmentsData.assignments);
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '未設定';
    
    const date = new Date(dateString);
    // UTCに変換（9時間減算）
    const utcDate = new Date(date.getTime() - 9 * 60 * 60 * 1000);
    
    return utcDate.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className={styles.container}>読み込み中...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>案件一覧ページ</h2>
        <p>従業員氏名: {name}</p>
        <div className={styles.assignmentsList}>
          {assignments.length === 0 ? (
            <p>今月の案件はありません</p>
          ) : (
            assignments.map((assignment) => (
              <div key={assignment.assignmentId} className={styles.assignmentCard}>
                <h3>{assignment.locationName}</h3>
                <p>日付: {new Date(assignment.workDate).toLocaleDateString('ja-JP')}</p>
                <p>開始時間: {formatTime(assignment.plannedStartTime)}</p>
                <p>終了時間: {formatTime(assignment.plannedEndTime)}</p>
                <Link href={`/auth/employee/${employeeId}/assignments/${assignment.assignmentId}/attendance`}>
                  <button className={styles.button}>
                    打刻ページ
                  </button>
                </Link>
                <Link href={`/auth/employee/${employeeId}/assignments/${assignment.assignmentId}/sharing`}>
                  <button className={styles.button}>
                    情報共有ページ
                  </button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}