// Oklahoma ODMHSAS Billing Code Mappings
// Every minute of every program day must map to exactly one code

export const BILLING_CODES = {
  H2015_HA: 'H2015-HA', // Community Support: Check-in, breaks, reflection, closing
  H2014_HA: 'H2014-HA', // Skills Training: Skill lessons, stations, group games
  H2021_HA: 'H2021-HA', // BHRS Regulation: GYM/movement activities (60 min minimum)
} as const

export type BillingCode = (typeof BILLING_CODES)[keyof typeof BILLING_CODES]

export const BILLING_CODE_LABELS: Record<BillingCode, string> = {
  'H2015-HA': 'Comprehensive Community Support Services',
  'H2014-HA': 'Skills Training and Development',
  'H2021-HA': 'Community-Based Wraparound Services',
}

export const BILLING_CODE_ACTIVITY_TYPES: Record<BillingCode, string[]> = {
  'H2015-HA': ['engagement', 'check_in', 'break', 'reflection'],
  'H2014-HA': ['skills_training', 'group_game', 'skill_lesson'],
  'H2021-HA': ['regulation', 'physical_activity'],
}

// 6-block daily structure — NEVER change this
export const DAILY_BLOCKS = [
  { block: 1, name: 'Check-In', minutes: 15, code: BILLING_CODES.H2015_HA, type: 'engagement' },
  { block: 2, name: 'Skill Lesson', minutes: 25, code: BILLING_CODES.H2014_HA, type: 'skills_training' },
  { block: 3, name: 'GYM Activity', minutes: 60, code: BILLING_CODES.H2021_HA, type: 'regulation' },
  { block: 4, name: 'Break/Reset', minutes: 15, code: BILLING_CODES.H2015_HA, type: 'engagement' },
  { block: 5, name: 'Stations & Game', minutes: 35, code: BILLING_CODES.H2014_HA, type: 'skills_training' },
  { block: 6, name: 'Reflection', minutes: 30, code: BILLING_CODES.H2015_HA, type: 'engagement' },
] as const

export const TOTAL_DAILY_MINUTES = 180 // 3 billable hours, zero dead time
