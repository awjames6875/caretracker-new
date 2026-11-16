import type { Metadata } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import type { ReactNode } from 'react'
import '@/styles/globals.css'

const bodyFont = Manrope({
	subsets: ['latin'],
	variable: '--font-body',
})

const displayFont = Fraunces({
	subsets: ['latin'],
	variable: '--font-display',
})

export const metadata: Metadata = {
	title: 'CareTracker',
	description: 'Simple behavior logs for busy staff',
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={`${bodyFont.variable} ${displayFont.variable}`}>{children}</body>
		</html>
	)
}
