'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PinPad } from '@/components/facilitator/PinPad'
import styles from '@/app/login/facilitator-login.module.css'

function todayValue() {
	const today = new Date()
	const year = today.getFullYear()
	const month = `${today.getMonth() + 1}`.padStart(2, '0')
	const day = `${today.getDate()}`.padStart(2, '0')
	return `${year}-${month}-${day}`
}

export function FacilitatorLogin() {
	const router = useRouter()
	const [fullName, setFullName] = useState('')
	const [sessionDate, setSessionDate] = useState(todayValue())
	const [pin, setPin] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [helperMessage, setHelperMessage] = useState('')

	const addDigit = (digit: string) => {
		setPin((current) => (current.length < 4 ? `${current}${digit}` : current))
		setErrorMessage('')
	}

	const removeDigit = () => {
		setPin((current) => current.slice(0, -1))
	}

	const clearPin = () => {
		setPin('')
	}

	const signIn = async () => {
		if (!fullName.trim() || pin.length !== 4) {
			setErrorMessage('Enter a name and 4 digits.')
			return
		}

		setIsLoading(true)
		setErrorMessage('')
		await new Promise((resolve) => setTimeout(resolve, 300))
		router.push('/mvp/facilitator')
	}

	return (
		<div className={styles.card}>
			<div>
				<p className={styles.eyebrow}>Worker sign in</p>
				<h2 className={styles.title}>Ready for today?</h2>
				<p className={styles.subtitle}>Enter your name, pick the date, and add your 4-digit PIN.</p>
			</div>

			<div className={styles.form}>
				<label>
					<div className={styles.fieldLabelRow}>
						<span className={styles.fieldLabel}>Full name</span>
					</div>
					<input
						type="text"
						value={fullName}
						onChange={(event) => setFullName(event.target.value)}
						placeholder="Enter your full name"
						className={styles.input}
					/>
				</label>

				<label>
					<div className={styles.fieldLabelRow}>
						<span className={styles.fieldLabel}>Session date</span>
					</div>
					<input
						type="date"
						value={sessionDate}
						onChange={(event) => setSessionDate(event.target.value)}
						className={styles.input}
					/>
				</label>

				<div>
					<div className={styles.fieldLabelRow}>
						<span className={styles.fieldLabel}>4-digit PIN</span>
						<button
							type="button"
							onClick={clearPin}
							className={styles.clearButton}
						>
							Clear
						</button>
					</div>
					<div className={styles.pinDisplay}>
						{pin.padEnd(4, '_')}
					</div>
					<PinPad onDigit={addDigit} onBackspace={removeDigit} onClear={clearPin} />
				</div>

				{errorMessage ? (
					<p className={styles.error}>
						{errorMessage}
					</p>
				) : null}

				{helperMessage ? <p className={styles.helper}>{helperMessage}</p> : null}

				<button
					type="button"
					onClick={signIn}
					disabled={isLoading}
					className={styles.submit}
				>
					{isLoading ? 'Opening your day...' : 'Sign in'}
				</button>
			</div>

			<div className={styles.footer}>
				<button
					type="button"
					onClick={() => setHelperMessage('Registration comes next. Use your saved worker name for now.')}
					className={styles.footerAction}
				>
					New worker? Register here
				</button>
				<Link href="/" className={styles.footerLink}>
					Team lead view
				</Link>
			</div>
		</div>
	)
}
