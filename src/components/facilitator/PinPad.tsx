'use client'

import styles from '@/components/facilitator/pin-pad.module.css'

const PAD_ROWS = [
	['1', '2', '3'],
	['4', '5', '6'],
	['7', '8', '9'],
	['Clear', '0', 'Back'],
] as const

interface PinPadProps {
	onDigit: (digit: string) => void
	onBackspace: () => void
	onClear: () => void
}

export function PinPad({ onDigit, onBackspace, onClear }: PinPadProps) {
	return (
		<div className={styles.pad}>
			{PAD_ROWS.map((row) => (
				<div key={row.join('-')} className={styles.row}>
					{row.map((key) => {
						const isDigit = key >= '0' && key <= '9'
						const action = key === 'Clear' ? onClear : key === 'Back' ? onBackspace : () => onDigit(key)

						return (
							<button
								key={key}
								type="button"
								onClick={action}
								className={isDigit ? styles.digit : styles.action}
							>
								{key}
							</button>
						)
					})}
				</div>
			))}
		</div>
	)
}
