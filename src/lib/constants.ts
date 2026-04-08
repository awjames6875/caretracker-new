// App-wide constants

// Session timeouts (HIPAA requirement)
export const SESSION_TIMEOUT_THERAPIST = 15 * 60 * 1000 // 15 minutes
export const SESSION_TIMEOUT_FACILITATOR = 60 * 60 * 1000 // 1 hour

// Touch targets (tablet accessibility)
export const MIN_TOUCH_TARGET_PX = 48

// Reading level target
export const TARGET_FLESCH_GRADE = 5 // 5th grade reading level

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// SOAP note generation
export const SOAP_MAX_OBSERVATIONS = 50 // Max observations per SOAP note
export const SOAP_GENERATION_TIMEOUT = 30000 // 30 seconds

// Pillars
export const PILLARS = {
  PHYSICAL: 'physical_development',
  COGNITIVE: 'communication',
  EMOTIONAL: 'emotional_regulation',
  SOCIAL: 'social_skills',
} as const

export const PILLAR_LABELS = {
  physical_development: 'Physical Regulation (Body)',
  communication: 'Cognitive Control (Mind)',
  emotional_regulation: 'Emotional Expression (Spirit)',
  social_skills: 'Social Identity (Whole)',
} as const

// Color Cards
export const COLOR_CARDS = {
  GREEN: { label: 'Ready', color: '#22c55e', action: 'Thumbs up' },
  YELLOW: { label: 'Help', color: '#eab308', action: '30-60 sec support' },
  RED: { label: 'Break', color: '#ef4444', action: '2 min max break' },
} as const

// Worker roles
export const ROLES = {
  FACILITATOR: 'facilitator',
  THERAPIST: 'therapist',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const
