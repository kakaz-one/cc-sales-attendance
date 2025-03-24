import Link from 'next/link'
import styles from './page.module.css'

export default function Page() {
  return (
    <div className={styles.container}>
      <h1>ユーザー種別選択</h1>
      <div className={styles.buttonContainer}>
        <Link href="/auth/admin/login">
          <button className={styles.button}>
            管理者
          </button>
        </Link>
        <Link href="/auth/employee/login">
          <button className={styles.button}>
            従業員選択
          </button>
        </Link>
      </div>
    </div>
  )
}