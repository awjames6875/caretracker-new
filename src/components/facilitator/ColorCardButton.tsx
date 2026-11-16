type ColorCard = 'GREEN' | 'YELLOW' | 'RED'

const colorStyles: Record<ColorCard, string> = {
	GREEN: 'border-emerald-600 bg-emerald-500 text-white',
	YELLOW: 'border-amber-500 bg-amber-400 text-slate-900',
	RED: 'border-rose-600 bg-rose-500 text-white',
}

type ColorCardButtonProps = {
	color: ColorCard
	label: string
	selected?: boolean
	onTap?: () => void
}

export function ColorCardButton({ color, label, selected = false, onTap }: ColorCardButtonProps) {
	const selectedStyles = selected ? 'ring-4 ring-offset-2 ring-blue-300' : ''

	return (
		<button
			type="button"
			onClick={onTap}
			className={`touch-target min-h-16 rounded-xl border-2 px-4 py-3 text-lg font-bold shadow-sm transition hover:brightness-105 ${colorStyles[color]} ${selectedStyles}`}
			aria-pressed={selected}
		>
			{label}
		</button>
	)
}
