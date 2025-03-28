'use client';
import { use, useState } from 'react';
import styles from './styles.module.css';

type LogType = '前日確認' | '出発' | '出勤' | '退勤';

export default function AttendancePage({ params }: { params: Promise<{ employeeId: string; assignmentId: string }> }) {
  const resolvedParams = use(params);
  const { employeeId, assignmentId } = resolvedParams;
  const [selectedLogType, setSelectedLogType] = useState<LogType>('出勤');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
  );
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const timestamp = new Date(`${selectedDate}T${selectedTime}`);
      
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId,
          logType: selectedLogType,
          timestamp: timestamp.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('打刻の登録に失敗しました');
      }

      setMessage('打刻が完了しました');
    } catch (error) {
      console.error('Error:', error);
      setMessage('打刻の登録に失敗しました');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>打刻ページ</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.logTypeContainer}>
            <div className={styles.logTypeLabel}>打刻種別:</div>
            <div className={styles.logTypeButtons}>
              {['前日確認', '出発', '出勤', '退勤'].map((type) => (
                <label key={type} className={styles.logTypeButton}>
                  <input
                    type="radio"
                    name="logType"
                    value={type}
                    checked={selectedLogType === type}
                    onChange={(e) => setSelectedLogType(e.target.value as LogType)}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioLabel}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date">日付:</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="time">時刻:</label>
            <input
              type="time"
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.button}>
            打刻する
          </button>
        </form>

        {message && (
          <p className={message.includes('失敗') ? styles.error : styles.success}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}