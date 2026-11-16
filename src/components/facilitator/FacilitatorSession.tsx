'use client'

import { useMemo, useState } from 'react'
import { ObservationModal } from '@/components/facilitator/ObservationModal'
import styles from '@/components/facilitator/facilitator-session.module.css'

type ScheduleBlock = {
  block: number
  name: string
  minutes: number
  code: string
}

type ChildOption = {
  id: string
  name: string
  ageLabel: string
  initials: string
}

interface Props {
  organizationId: string
  programId: string
  workerId: string
  programName: string
  partnerName: string
  workerName: string
  blocks: ScheduleBlock[]
  children: ChildOption[]
}

const SETUP_ITEMS = [
  'Feelings chart is ready',
  'Color spots are marked',
  'Book and props are set out',
  'Calm tools are in place',
  'Music is ready to play',
] as const

const ACTIVITY_GUIDE: Record<number, { steps: string[]; watchFor: string[] }> = {
  1: {
    steps: ['Welcome each child.', 'Open with one quick check-in.', 'Start with a calm group cue.'],
    watchFor: ['Kind words', 'Joining the group', 'Asking for help'],
  },
  2: {
    steps: ['Show the skill once.', 'Practice together.', 'Give one clear next step.'],
    watchFor: ['Listening', 'Trying the skill', 'Waiting for a turn'],
  },
  3: {
    steps: ['Model the movement.', 'Pair kids for practice.', 'End with one short reset.'],
    watchFor: ['Safe body space', 'Team play', 'Finishing the movement'],
  },
  4: {
    steps: ['Slow the room down.', 'Offer two calm choices.', 'Guide kids back one by one.'],
    watchFor: ['Using a calm tool', 'Taking a breath', 'Getting ready again'],
  },
  5: {
    steps: ['Split into stations.', 'Keep turns short.', 'Praise one good choice each round.'],
    watchFor: ['Sharing', 'Staying with the station', 'Playing with others'],
  },
  6: {
    steps: ['Gather in a circle.', 'Ask for one good moment.', 'Close with one clear goodbye step.'],
    watchFor: ['Sharing out loud', 'Listening to peers', 'Ending calmly'],
  },
}

function formatToday() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function outcomeToColorCounts(outcome: 'positive' | 'neutral' | 'challenging') {
  if (outcome === 'positive') return { green: 1, yellow: 0, red: 0 }
  if (outcome === 'neutral') return { green: 0, yellow: 1, red: 0 }
  return { green: 0, yellow: 0, red: 1 }
}

export function FacilitatorSession({
  organizationId,
  programId,
  workerId,
  programName,
  partnerName,
  workerName,
  blocks,
  children,
}: Props) {
  const [expandedBlock, setExpandedBlock] = useState(blocks[0]?.block ?? 1)
  const [savedBlocks, setSavedBlocks] = useState<number[]>([])
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>(children[0] ? [children[0].id] : [])
  const [searchTerm, setSearchTerm] = useState('')
  const [setupDone, setSetupDone] = useState<string[]>([])
  const [monthlyTheme, setMonthlyTheme] = useState('Halloween')
  const [draftTheme, setDraftTheme] = useState('Halloween')
  const [themeEditorOpen, setThemeEditorOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const filteredChildren = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) {
      return children
    }

    return children.filter((child) => child.name.toLowerCase().includes(query))
  }, [children, searchTerm])

  const selectedChildren = useMemo(
    () => children.filter((child) => selectedChildIds.includes(child.id)),
    [children, selectedChildIds]
  )

  const activeBlock = useMemo(
    () => blocks.find((block) => block.block === expandedBlock) ?? blocks[0],
    [blocks, expandedBlock]
  )

  const completedSetupCount = setupDone.length

  const toggleSetupItem = (item: string) => {
    setSetupDone((current) =>
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]
    )
  }

  const toggleChild = (childId: string) => {
    setSelectedChildIds((current) =>
      current.includes(childId) ? current.filter((entry) => entry !== childId) : [...current, childId]
    )
  }

  const saveObservation = async (payload: {
    observedBehaviors: string[]
    outcome: 'positive' | 'neutral' | 'challenging'
    notes: string
    isBreakthrough: boolean
  }) => {
    if (!activeBlock || selectedChildren.length === 0) {
      return
    }

    setSaving(true)
    setStatusMessage('')

    try {
      await Promise.all(
        selectedChildren.map(async (child) => {
          const response = await fetch('/api/observations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              organizationId,
              programId,
              childId: child.id,
              workerId,
              activityBlock: activeBlock.block,
              activityName: activeBlock.name,
              billingCode: activeBlock.code,
              outcome: payload.outcome,
              observedBehaviors: payload.observedBehaviors,
              notes: payload.notes,
              isBreakthrough: payload.isBreakthrough,
              colorCardCounts: outcomeToColorCounts(payload.outcome),
            }),
          })

          if (!response.ok) {
            throw new Error('save-failed')
          }
        })
      )

      setSavedBlocks((current) => (current.includes(activeBlock.block) ? current : [...current, activeBlock.block]))
      setStatusMessage(`Saved for ${selectedChildren.length} child${selectedChildren.length === 1 ? '' : 'ren'}.`)
      setModalOpen(false)
    } catch {
      setStatusMessage("Couldn't save. Try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.previewBar}>This is a local preview. Open the routes below to review the rebuilt screens.</div>
      <div className={styles.container}>
        <header className={styles.topbar}>
          <div className={styles.brandRow}>
            <div className={styles.brandMark}>BB</div>
            <div>
              <p className={styles.brandName}>{partnerName}</p>
              <p className={styles.brandSub}>{programName}</p>
            </div>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.toolbarMeta}>
              <div>{formatToday()}</div>
              <div>{workerName}</div>
            </div>
            <div className={styles.toolbarActions}>
              <button type="button" className={styles.ghostButton}>Refresh</button>
              <button type="button" className={styles.ghostButton}>Sign out</button>
            </div>
          </div>
        </header>

        <section className={styles.tipBar}>New to Body &amp; Brain? Open one activity, pick a child, and save a short note after each block.</section>

        <section className={styles.summaryGrid}>
          <div className={styles.themeCard}>
            <div className={styles.summaryHead}>
              <div>
                <p className={styles.eyebrow}>Monthly theme</p>
                <h2 className={styles.summaryTitle}>{monthlyTheme}</h2>
                <p className={styles.summaryText}>Coach-style prompts can use this theme to shape the day.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDraftTheme(monthlyTheme)
                  setThemeEditorOpen(true)
                }}
                className={styles.summaryButton}
              >
                Edit
              </button>
            </div>
          </div>

          <div className={styles.weekCard}>
            <div className={styles.summaryHead}>
              <div>
                <p className={styles.eyebrow}>Week 4 of 8</p>
                <h2 className={styles.summaryTitle}>Friends, feelings, and fix-it tools</h2>
                <p className={styles.summaryText}>Current weekly focus for activities and simple behavior notes.</p>
              </div>
              <button type="button" className={styles.summaryButton}>
                Next week
              </button>
            </div>
          </div>
        </section>

        <section className={styles.mainGrid}>
          <div className={styles.leftCard}>
            <div className={styles.summaryHead}>
              <div>
                <h2 className={styles.cardTitle}>Setup checklist</h2>
                <p className={styles.cardSub}>{completedSetupCount}/{SETUP_ITEMS.length} complete</p>
              </div>
              <span className={styles.savedBadge}>Start here</span>
            </div>
            <div className={styles.setupList}>
              {SETUP_ITEMS.map((item) => {
                const done = setupDone.includes(item)
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleSetupItem(item)}
                    className={done ? `${styles.setupItem} ${styles.setupItemDone}` : styles.setupItem}
                  >
                    <span className={done ? `${styles.setupDot} ${styles.setupDotDone}` : styles.setupDot} />
                    <span>{item}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className={styles.rightCard}>
            <div className={styles.activitiesHead}>
              <div>
                <h2 className={styles.cardTitle}>Today&apos;s Activities</h2>
                <p className={styles.cardSub}>Open a card to see the plan and what to watch for.</p>
              </div>
              <div className={styles.savedBadge}>{savedBlocks.length}/{blocks.length} saved</div>
            </div>

            <div className={styles.activityList}>
              {blocks.map((block) => {
                const details = ACTIVITY_GUIDE[block.block] ?? ACTIVITY_GUIDE[1]
                const open = expandedBlock === block.block
                const saved = savedBlocks.includes(block.block)
                return (
                  <article key={block.block} className={open ? `${styles.activityCard} ${styles.activityCardOpen}` : styles.activityCard}>
                    <button
                      type="button"
                      onClick={() => setExpandedBlock(block.block)}
                      className={styles.activityButton}
                    >
                      <div className={styles.activityLeft}>
                        <div className={styles.timePill}>
                          {block.minutes} min
                        </div>
                        <div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                            <h3 className={styles.activityName}>{block.name}</h3>
                            {saved ? <span className={styles.savedPill}>Saved</span> : null}
                          </div>
                          <p className={styles.activityMeta}>Block {block.block}</p>
                        </div>
                      </div>

                      <div className={styles.activityRight}>
                        <span className={styles.codeBadge}>{block.code}</span>
                        <span className={styles.chevron}>{open ? 'Hide' : 'Open'}</span>
                      </div>
                    </button>

                    {open ? (
                      <div className={styles.activityDetails}>
                        <div>
                          <p className={styles.detailLabel}>How to run this activity</p>
                          <ol className={styles.stepList}>
                            {details.steps.map((step, index) => (
                              <li key={step} className={styles.stepItem}>
                                <span className={styles.stepIndex}>{index + 1}</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div>
                          <p className={styles.detailLabel}>What to watch for</p>
                          <div className={styles.watchList}>
                            {details.watchFor.map((item) => (
                              <div key={item} className={styles.watchItem}>
                                {item}
                              </div>
                            ))}
                          </div>
                          <button type="button" className={styles.noteButton}>
                            Add quick note
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className={styles.childrenCard}>
          <div className={styles.childrenHead}>
            <div>
              <h2 className={styles.cardTitle}>Children in Program ({children.length})</h2>
              <p className={styles.cardSub}>Select children to log observation</p>
            </div>
            <label style={{ width: '100%', maxWidth: '290px' }}>
              <span className="sr-only">Search children</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search children"
                className={styles.search}
              />
            </label>
          </div>

          <div className={styles.chipRow}>
            {selectedChildren.length > 0 ? selectedChildren.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => toggleChild(child.id)}
                className={styles.chip}
              >
                <span className={styles.chipAvatar}>{child.initials}</span>
                {child.name}
                <span>x</span>
              </button>
            )) : <p className={styles.cardSub}>No children picked yet.</p>}
          </div>

          <div className={styles.childGrid}>
            {filteredChildren.map((child) => {
              const selected = selectedChildIds.includes(child.id)
              return (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => toggleChild(child.id)}
                  className={selected ? `${styles.childCard} ${styles.childCardSelected}` : styles.childCard}
                >
                  <span className={styles.childAvatar}>{child.initials}</span>
                  <span>
                    <span className={styles.childName}>{child.name}</span>
                    <span className={styles.childAge}>{child.ageLabel}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className={styles.childrenFooter}>
            {statusMessage ? (
              <p className={statusMessage.includes("Couldn't") ? styles.statusBad : styles.statusGood}>
                {statusMessage}
              </p>
            ) : <div />}

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              disabled={selectedChildren.length === 0}
                  className={styles.primaryButton}
            >
                  Log Observation ({selectedChildren.length})
            </button>
          </div>
        </section>

        {themeEditorOpen ? (
          <div className={styles.themeOverlay}>
            <div className={styles.themeCardModal}>
              <p className={styles.eyebrow}>Monthly theme</p>
              <h2 className={styles.modalTitle}>Update theme</h2>
              <p className={styles.modalText}>Pick a short theme name that can shape the day.</p>
              <label>
                <span className={styles.label}>Theme name</span>
                <input
                  type="text"
                  value={draftTheme}
                  onChange={(event) => setDraftTheme(event.target.value)}
                  placeholder="Harvest, Winter Garden, Spring Play"
                  className={styles.themeInput}
                />
              </label>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setThemeEditorOpen(false)} className={styles.summaryButton}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMonthlyTheme(draftTheme.trim() || monthlyTheme)
                    setThemeEditorOpen(false)
                  }}
                  className={styles.primaryButton}
                >
                  Save theme
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {activeBlock ? (
          <ObservationModal
            open={modalOpen}
            activity={{ block: activeBlock.block, name: activeBlock.name, code: activeBlock.code }}
            selectedChildren={selectedChildren}
            saving={saving}
            onClose={() => setModalOpen(false)}
            onSave={saveObservation}
          />
        ) : null}
      </div>
    </main>
  )
}
