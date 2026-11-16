type BlockHeaderProps = {
	blockNumber: number
	title: string
	minutes: number
	billingCode: string
	isActive?: boolean
}

export function BlockHeader({
	blockNumber,
	title,
	minutes,
	billingCode,
	isActive = false,
}: BlockHeaderProps) {
	return (
		<div
			className={`rounded-lg border p-4 ${
				isActive ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white'
			}`}
		>
			<p className="text-sm font-medium text-slate-600">Block {blockNumber}</p>
			<h3 className="mt-1 text-xl font-bold text-slate-900">{title}</h3>
			<p className="mt-1 text-sm text-slate-700">
				{minutes} min • {billingCode}
			</p>
		</div>
	)
}
