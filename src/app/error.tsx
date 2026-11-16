'use client'

type ErrorProps = {
	error: Error
	reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
	return (
		<main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
			<div className="w-full max-w-lg rounded-xl border border-rose-200 bg-white p-6 shadow-sm">
				<h1 className="text-2xl font-bold text-rose-700">Something went wrong</h1>
				<p className="mt-2 text-slate-700">Please try again.</p>
				<p className="mt-3 break-words rounded bg-slate-100 p-3 text-sm text-slate-600">{error.message}</p>
				<button
					type="button"
					onClick={reset}
					className="mt-4 min-h-12 rounded-lg bg-blue-600 px-5 text-base font-semibold text-white"
				>
					Try again
				</button>
			</div>
		</main>
	)
}
