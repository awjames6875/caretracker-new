'use client'

import { FacilitatorLogin } from '@/app/login/FacilitatorLogin'
import styles from '@/app/login/login.module.css'

const features = [
	{
		title: 'Daily activity ideas',
		description: 'See the plan fast and keep the group moving.',
	},
	{
		title: 'Quick daily notes',
		description: 'Save what you saw without slowing down.',
	},
	{
		title: 'Simple billing support',
		description: 'Keep each block tied to the right code.',
	},
]

export default function LoginPage() {
	return (
		<main className={styles.page}>
			<div className={styles.shell}>
				<section className={styles.hero}>
					<div className={styles.heroGlowA} />
					<div className={styles.heroGlowB} />
					<div className={styles.heroInner}>
						<div>
							<div className={styles.brandRow}>
								<div className={styles.brandMark}>BB</div>
								<div>
									<p className={styles.brandName}>Body &amp; Brain</p>
									<p className={styles.brandSub}>Daycare program</p>
								</div>
							</div>

							<p className={styles.eyebrow}>CareTracker</p>
							<h1 className={styles.headline}>A calmer way to run the day.</h1>
							<p className={styles.subcopy}>Open the plan, pick a child, and save what happened in a few fast taps.</p>
						</div>

						<div className={styles.featureGrid}>
							{features.map((feature, index) => (
								<div key={feature.title} className={styles.featureCard}>
									<div className={styles.featureIcon}>0{index + 1}</div>
									<h2 className={styles.featureTitle}>{feature.title}</h2>
									<p className={styles.featureText}>{feature.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className={styles.panel}>
					<FacilitatorLogin />
				</section>
			</div>
		</main>
	)
}
