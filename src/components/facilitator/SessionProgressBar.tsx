type SessionProgressBarProps = {
	completedBlocks: number
	totalBlocks: number
}

export function SessionProgressBar({ completedBlocks, totalBlocks }: SessionProgressBarProps) {
	const safeTotal = totalBlocks > 0 ? totalBlocks : 1
	const progressPercent = Math.min(100, Math.max(0, (completedBlocks / safeTotal) * 100))

	return (
		<section aria-label="Session progress" className="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
			<div className="flex items-center justify-between">
				<p className="text-base font-semibold text-slate-800">Today&apos;s progress</p>
				<p className="text-sm text-slate-600">
					{completedBlocks} of {totalBlocks} blocks
				</p>
			</div>
			<div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
				<div
					className="h-full rounded-full bg-blue-600 transition-all"
					style={{ width: `${progressPercent}%` }}
				/>
			</div>
		</section>
	)
}
