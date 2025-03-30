//各従業員の各案件の情報共有ページ。

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

interface CardBenefit {
  benefit_id: number;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date | null;
  is_limited_stock: boolean;
  note: string | null;
  location: {
    location_name: string;
  };
}

export default function SharingPage() {
  const params = useParams();
  const [benefits, setBenefits] = useState<CardBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const response = await fetch(
          `/api/auth/employee/${params.employeeId}/assignments/${params.assignmentId}/sharing`
        );
        
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        
        const data = await response.json();
        setBenefits(data.benefits);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, [params.employeeId, params.assignmentId]);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>クレジットカード入会特典一覧</h1>
      <div className={styles.benefitsList}>
        {benefits.map((benefit) => (
          <div key={benefit.benefit_id} className={styles.benefitCard}>
            <div className={styles.locationName}>
              <span className={styles.label}>店舗:</span> {benefit.location.location_name}
            </div>
            <h2 className={styles.benefitTitle}>{benefit.title}</h2>
            <div className={styles.benefitContent}>
              <div className={styles.benefitDescription}>
                <span className={styles.label}>特典内容:</span>
                <p>{benefit.description}</p>
              </div>
              <div className={styles.benefitDetails}>
                <div className={styles.dateInfo}>
                  <p>
                    <span className={styles.label}>開始日:</span>{' '}
                    {new Date(benefit.start_date).toLocaleDateString('ja-JP')}
                  </p>
                  {benefit.end_date && (
                    <p>
                      <span className={styles.label}>終了日:</span>{' '}
                      {new Date(benefit.end_date).toLocaleDateString('ja-JP')}
                    </p>
                  )}
                </div>
                {benefit.is_limited_stock && (
                  <p className={styles.limitedStock}>
                    <span className={styles.warningIcon}>⚠</span> 数量限定
                  </p>
                )}
                {benefit.note && (
                  <div className={styles.note}>
                    <span className={styles.label}>備考:</span>
                    <p>{benefit.note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
