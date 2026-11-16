import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const observationSchema = z.object({
  organizationId: z.string().min(1),
  programId: z.string().min(1),
  childId: z.string().min(1),
  workerId: z.string().min(1),
  activityBlock: z.number().int().min(1).max(6),
  activityName: z.string().min(1),
  billingCode: z.string().min(1),
  outcome: z.enum(['positive', 'neutral', 'challenging']).default('neutral'),
  observedBehaviors: z.array(z.string()).default([]),
  notes: z.string().optional(),
  isBreakthrough: z.boolean().optional(),
  colorCardCounts: z.record(z.number()).default({}),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = observationSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Missing or invalid fields.' }, { status: 400 })
  }

  const {
    organizationId,
    programId,
    childId,
    workerId,
    activityBlock,
    activityName,
    billingCode,
    outcome,
    observedBehaviors,
    notes,
    isBreakthrough,
    colorCardCounts,
  } = parsed.data

  const observation = await prisma.observation.create({
    data: {
      organizationId,
      programId,
      childId,
      workerId,
      activityBlock,
      activityName,
      billingCode,
      outcome,
      observedBehaviors,
      notes,
      isBreakthrough: isBreakthrough ?? false,
      colorCardCounts,
      observationDate: new Date(),
      weekNumber: 1,
      dayNumber: 1,
    },
  })

  return NextResponse.json(observation, { status: 201 })
}
