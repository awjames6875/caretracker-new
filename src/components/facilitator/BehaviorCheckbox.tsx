type BehaviorCheckboxProps = {
	label: string
	checked: boolean
	onChange: () => void
}

export function BehaviorCheckbox({ label, checked, onChange }: BehaviorCheckboxProps) {
	return (
		<button
			type="button"
			onClick={onChange}
			className={`touch-target flex min-h-14 w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-base font-medium transition ${
				checked ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-300 bg-white text-slate-800'
			}`}
			aria-pressed={checked}
		>
			<span
				className={`inline-flex h-6 w-6 items-center justify-center rounded border text-sm font-bold ${
					checked ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-400 bg-white text-slate-400'
				}`}
			>
				{checked ? '✓' : ''}
			</span>
			<span>{label}</span>
		</button>
	)
}
