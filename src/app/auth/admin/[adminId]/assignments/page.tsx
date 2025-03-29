//アサイン状況確認ページ
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import styles from './styles.module.css'

type Assignment = {
  employee: {
    name: string;
    role: '社員' | '契約社員' | 'バイト';
    hire_date: string;
  };
  location: {
    location_name: string;
  };
  work_date: string;
};

type Location = {
  location_id: number;
  location_name: string;
};

export default function AdminAssignmentsPage({ params }: { params: Promise<{ adminId: string }> }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [dates, setDates] = useState<{
    yesterday: string;
    today: string;
    tomorrow: string;
  }>();
  const { adminId } = use(params);

  useEffect(() => {
    // アサイン情報を取得
    fetch(`/api/auth/admin/${adminId}/assignments`)
      .then(response => response.json())
      .then(data => {
        setLocations(data.locations);
        setAssignments(data.assignments);
        setDates(data.dates);
      })
      .catch(err => {
        console.error('Error fetching assignments:', err);
        setError('アサイン情報の取得に失敗しました');
      });

    // 管理者情報を取得
    fetch(`/api/auth/admin/${adminId}`)
      .then(response => response.json())
      .then(data => {
        setName(data.name);
      })
      .catch(err => {
        console.error('Error fetching admin data:', err);
        setError('管理者情報の取得に失敗しました');
      });
  }, [adminId]);

  const getAssignmentsForDateAndLocation = (date: string, locationName: string) => {
    console.log('Target Date:', new Date(date));
    console.log('Available Assignments:', assignments.map(a => ({
      date: new Date(a.work_date),
      location: a.location.location_name
    })));
    
    return assignments.filter(a => {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      
      const assignmentDate = new Date(a.work_date);
      assignmentDate.setHours(0, 0, 0, 0);
      
      return (
        assignmentDate.getTime() === targetDate.getTime() &&
        a.location.location_name === locationName
      );
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getFinalReporter = (assignments: Assignment[]) => {
    if (assignments.length === 0) return null;
    
    // roleの優先順位を定義
    const rolePriority = {
      '社員': 1,
      '契約社員': 2,
      'バイト': 3,
    };

    // roleと入社日でソート
    return assignments.sort((a, b) => {
      const roleDiff = rolePriority[a.employee.role] - rolePriority[b.employee.role];
      if (roleDiff !== 0) return roleDiff;
      return new Date(a.employee.hire_date).getTime() - new Date(b.employee.hire_date).getTime();
    })[0];
  };

  const renderDateSection = (date: string, title: string) => (
    <div className={styles.dateSection}>
      <div className={styles.dateSectionHeader}>
        <h3>{title}</h3>
        <span className={styles.dateText}>（{formatDate(date)}）</span>
      </div>
      <div className={styles.locationsGrid}>
        {locations.map((location) => {
          const locationAssignments = getAssignmentsForDateAndLocation(date, location.location_name);
          const finalReporter = getFinalReporter(locationAssignments);
          
          return (
            <div key={location.location_id} className={styles.locationCard}>
              <h4>{location.location_name}</h4>
              <div className={styles.employeeList}>
                {locationAssignments.length > 0 ? (
                  locationAssignments.map((assignment, index) => (
                    <div 
                      key={index} 
                      className={`${styles.employee} ${
                        assignment.employee.name === finalReporter?.employee.name 
                          ? styles.finalReporter 
                          : ''
                      }`}
                    >
                      {assignment.employee.name}
                    </div>
                  ))
                ) : (
                  <div className={styles.noAssignment}>アサインなし</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (error) return <div className={styles.error}>{error}</div>;
  if (!dates) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>アサイン状況確認</h2>
        <p>管理者: {name}</p>
        
        {renderDateSection(dates.yesterday, '前日のアサイン')}
        {renderDateSection(dates.today, '本日のアサイン')}
        {renderDateSection(dates.tomorrow, '明日のアサイン')}
      </div>
    </div>
  );
}