import Link from 'next/link'

export default function NotFound() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
			<div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
				<h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
				<p className="mt-2 text-slate-600">Let&apos;s go back to home.</p>
				<Link
					href="/"
					className="mt-4 inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-600 px-5 text-base font-semibold text-white"
				>
					Go home
				</Link>
			</div>
		</main>
	)
}
