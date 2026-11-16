'use client'

import { useEffect, useMemo, useState } from 'react'

type CodeSummary = {
	code: string
	observationsCount: number
	totalMinutes: number
}

type PartnerSummary = {
	partnerId: string
	partnerName: string
	observationsCount: number
	totalMinutes: number
	codeSummary: CodeSummary[]
}

type BillingReportResponse = {
	totals: {
		totalMinutes: number
		totalHours: number
		totalObservations: number
	}
	codeSummary: CodeSummary[]
	byPartner: PartnerSummary[]
}

function formatDateValue(date: Date) {
	const year = date.getFullYear()
	const month = `${date.getMonth() + 1}`.padStart(2, '0')
	const day = `${date.getDate()}`.padStart(2, '0')
	return `${year}-${month}-${day}`
}

function defaultStartDate() {
	const date = new Date()
	date.setDate(date.getDate() - 6)
	return formatDateValue(date)
}

export default function ReportsPage() {
	const [startDate, setStartDate] = useState(defaultStartDate)
	const [endDate, setEndDate] = useState(formatDateValue(new Date()))
	const [partnerId, setPartnerId] = useState('')
	const [report, setReport] = useState<BillingReportResponse | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const partnerOptions = useMemo(() => {
		if (!report) {
			return []
		}
		return report.byPartner.map((partner) => ({ id: partner.partnerId, name: partner.partnerName }))
	}, [report])

	const loadReport = async () => {
		setLoading(true)
		setError('')

		const searchParams = new URLSearchParams({
			startDate,
			endDate,
		})
		if (partnerId) {
			searchParams.set('partnerId', partnerId)
		}

		try {
			const response = await fetch(`/api/reports/billing?${searchParams.toString()}`)
			if (!response.ok) {
				throw new Error('Could not load report')
			}

			const data = (await response.json()) as BillingReportResponse
			setReport(data)
		} catch {
			setError('Could not load report. Try again.')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		void loadReport()
	}, [])

	return (
		<main className="min-h-screen bg-slate-50 p-6 md:p-10">
			<div className="mx-auto max-w-6xl space-y-6">
				<section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
					<h1 className="text-2xl font-bold text-slate-900">Billing reports</h1>
					<p className="mt-2 text-slate-600">See billable totals by code and partner for a date range.</p>

					<div className="mt-5 grid gap-3 md:grid-cols-4">
						<label className="space-y-2">
							<span className="text-sm font-semibold text-slate-700">Start date</span>
							<input
								type="date"
								value={startDate}
								onChange={(event) => setStartDate(event.target.value)}
								className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
							/>
						</label>

						<label className="space-y-2">
							<span className="text-sm font-semibold text-slate-700">End date</span>
							<input
								type="date"
								value={endDate}
								onChange={(event) => setEndDate(event.target.value)}
								className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
							/>
						</label>

						<label className="space-y-2">
							<span className="text-sm font-semibold text-slate-700">Partner</span>
							<select
								value={partnerId}
								onChange={(event) => setPartnerId(event.target.value)}
								className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
							>
								<option value="">All partners</option>
								{partnerOptions.map((partner) => (
									<option key={partner.id} value={partner.id}>
										{partner.name}
									</option>
								))}
							</select>
						</label>

						<div className="flex items-end">
							<button
								type="button"
								onClick={() => void loadReport()}
								disabled={loading}
								className="min-h-12 w-full rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
							>
								{loading ? 'Loading...' : 'Run report'}
							</button>
						</div>
					</div>

					{error ? <p className="mt-4 text-sm font-semibold text-rose-700">{error}</p> : null}
				</section>

				{report ? (
					<>
						<section className="grid gap-4 md:grid-cols-3">
							<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
								<p className="text-sm font-semibold text-slate-600">Total minutes</p>
								<p className="mt-2 text-3xl font-bold text-slate-900">{report.totals.totalMinutes}</p>
							</div>
							<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
								<p className="text-sm font-semibold text-slate-600">Total hours</p>
								<p className="mt-2 text-3xl font-bold text-slate-900">{report.totals.totalHours}</p>
							</div>
							<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
								<p className="text-sm font-semibold text-slate-600">Total entries</p>
								<p className="mt-2 text-3xl font-bold text-slate-900">{report.totals.totalObservations}</p>
							</div>
						</section>

						<section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
							<h2 className="text-lg font-bold text-slate-900">By billing code</h2>
							<div className="mt-4 overflow-x-auto">
								<table className="min-w-full border-collapse text-left text-sm">
									<thead>
										<tr className="border-b border-slate-200 text-slate-600">
											<th className="py-2">Code</th>
											<th className="py-2">Entries</th>
											<th className="py-2">Minutes</th>
										</tr>
									</thead>
									<tbody>
										{report.codeSummary.map((row) => (
											<tr key={row.code} className="border-b border-slate-100">
												<td className="py-2 font-semibold text-slate-800">{row.code}</td>
												<td className="py-2 text-slate-700">{row.observationsCount}</td>
												<td className="py-2 text-slate-700">{row.totalMinutes}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</section>

						<section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
							<h2 className="text-lg font-bold text-slate-900">By partner</h2>
							<div className="mt-4 space-y-4">
								{report.byPartner.map((partner) => (
									<article key={partner.partnerId} className="rounded-lg border border-slate-200 p-4">
										<div className="flex flex-wrap items-center justify-between gap-3">
											<h3 className="text-base font-bold text-slate-900">{partner.partnerName}</h3>
											<p className="text-sm font-semibold text-slate-700">
												{partner.totalMinutes} min ({partner.observationsCount} entries)
											</p>
										</div>
										<ul className="mt-2 flex flex-wrap gap-2">
											{partner.codeSummary.map((code) => (
												<li key={code.code} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
													{code.code}: {code.totalMinutes} min
												</li>
											))}
										</ul>
									</article>
								))}
							</div>
						</section>
					</>
				) : null}
			</div>
		</main>
	)
}
