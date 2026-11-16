'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from '@/components/facilitator/observation-modal.module.css'

type WatchGroup = {
	title: string
	items: string[]
}

type SelectedChild = {
	id: string
	name: string
	initials: string
}

type ActivityInfo = {
	block: number
	name: string
	code: string
}

interface ObservationModalProps {
	open: boolean
	activity: ActivityInfo
	selectedChildren: SelectedChild[]
	saving: boolean
	onClose: () => void
	onSave: (payload: {
		observedBehaviors: string[]
		outcome: 'positive' | 'neutral' | 'challenging'
		notes: string
		isBreakthrough: boolean
	}) => Promise<void>
}

const WATCH_BY_BLOCK: Record<number, WatchGroup[]> = {
	1: [
		{ title: 'Kind words', items: ['Said hello to the group', 'Answered a question', 'Asked for help'] },
		{ title: 'Getting settled', items: ['Joined the group fast', 'Stayed in the space', 'Followed the first direction'] },
	],
	2: [
		{ title: 'Listening', items: ['Looked at the speaker', 'Waited for a turn', 'Followed directions'] },
		{ title: 'Trying the skill', items: ['Tried the activity', 'Used calm hands', 'Stayed with the task'] },
	],
	3: [
		{ title: 'Body control', items: ['Joined the movement game', 'Finished the movement', 'Used safe body space'] },
		{ title: 'Playing with others', items: ['Played with a peer', 'Took turns', 'Cheered for someone else'] },
	],
	4: [
		{ title: 'Reset tools', items: ['Took a deep breath', 'Used a calm tool', 'Came back when ready'] },
		{ title: 'Simple choices', items: ['Picked one good choice', 'Asked for space', 'Stayed calm with support'] },
	],
	5: [
		{ title: 'Group play', items: ['Shared materials', 'Stayed in the station', 'Asked a peer to join'] },
		{ title: 'Practice time', items: ['Tried the skill again', 'Used kind words', 'Waited for the next turn'] },
	],
	6: [
		{ title: 'Wrap-up', items: ['Shared one thought', 'Named a good moment', 'Finished the day calmly'] },
		{ title: 'Looking ahead', items: ['Said goodbye', 'Followed the close-out step', 'Left the space ready'] },
	],
}

export function ObservationModal({ open, activity, selectedChildren, saving, onClose, onSave }: ObservationModalProps) {
	const watchGroups = useMemo(() => WATCH_BY_BLOCK[activity.block] ?? WATCH_BY_BLOCK[1], [activity.block])
	const [selectedItems, setSelectedItems] = useState<string[]>([])
	const [outcome, setOutcome] = useState<'positive' | 'neutral' | 'challenging'>('positive')
	const [notes, setNotes] = useState('')
	const [isBreakthrough, setIsBreakthrough] = useState(false)

	useEffect(() => {
		if (!open) {
			setSelectedItems([])
			setOutcome('positive')
			setNotes('')
			setIsBreakthrough(false)
		}
	}, [open])

	if (!open) {
		return null
	}

	const toggleItem = (item: string) => {
		setSelectedItems((current) =>
			current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]
		)
	}

	return (
		<div className={styles.overlay}>
			<div className={styles.card}>
				<div className={styles.head}>
					<div>
						<p className={styles.eyebrow}>Log observation</p>
						<h2 className={styles.title}>{activity.name}</h2>
						<p className={styles.subtitle}>This will save a note for {selectedChildren.length} child{selectedChildren.length === 1 ? '' : 'ren'}.</p>
					</div>
					<button type="button" onClick={onClose} className={styles.close}>
						Close
					</button>
				</div>

				<div className={styles.chips}>
					{selectedChildren.map((child) => (
						<span key={child.id} className={styles.chip}>
							<span className={styles.chipAvatar}>{child.initials}</span>
							{child.name}
						</span>
					))}
				</div>

				<div className={styles.groupList}>
					{watchGroups.map((group) => (
						<section key={group.title} className={styles.group}>
							<h3 className={styles.groupTitle}>{group.title}</h3>
							<div className={styles.items}>
								{group.items.map((item) => {
									const checked = selectedItems.includes(item)
									return (
										<button
											key={item}
											type="button"
											onClick={() => toggleItem(item)}
											className={checked ? styles.itemOn : styles.item}
										>
											<span>{item}</span>
											<span>{checked ? 'On' : 'Tap'}</span>
										</button>
									)
								})}
							</div>
						</section>
					))}
				</div>

				<div className={styles.grid}>
					<label>
						<span className={styles.label}>How did it go?</span>
						<select
							value={outcome}
							onChange={(event) => setOutcome(event.target.value as 'positive' | 'neutral' | 'challenging')}
							className={styles.select}
						>
							<option value="positive">Went well</option>
							<option value="neutral">Needed a little help</option>
							<option value="challenging">Needed a break</option>
						</select>
					</label>

					<label className={styles.bright}>
						<input
							type="checkbox"
							checked={isBreakthrough}
							onChange={(event) => setIsBreakthrough(event.target.checked)}
						/>
						<div>
							<p className={styles.brightTitle}>Bright spot</p>
							<p className={styles.brightText}>Mark this if the child had a standout win.</p>
						</div>
					</label>
				</div>

				<label className={styles.notes}>
					<span className={styles.label}>Notes</span>
					<textarea
						value={notes}
						onChange={(event) => setNotes(event.target.value)}
						rows={4}
						placeholder="Add a short note if it helps."
						className={styles.textarea}
					/>
				</label>

				<div className={styles.footer}>
					<div className={styles.meta}>
						<p>Activity: <strong>{activity.name}</strong></p>
						<p>Billing code: <strong>{activity.code}</strong></p>
					</div>
					<button
						type="button"
						onClick={() => onSave({ observedBehaviors: selectedItems, outcome, notes, isBreakthrough })}
						disabled={saving || selectedChildren.length === 0}
						className={styles.save}
					>
						{saving ? 'Saving...' : 'Save note'}
					</button>
				</div>
			</div>
		</div>
	)
}