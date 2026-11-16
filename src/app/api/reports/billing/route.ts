import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { DAILY_BLOCKS } from '@/lib/billing-codes'

const billingQuerySchema = z
  .object({
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    partnerId: z.string().optional(),
    organizationId: z.string().optional(),
  })
  .refine((value) => !Number.isNaN(new Date(value.startDate).valueOf()), {
    message: 'Invalid startDate',
    path: ['startDate'],
  })
  .refine((value) => !Number.isNaN(new Date(value.endDate).valueOf()), {
    message: 'Invalid endDate',
    path: ['endDate'],
  })

const minutesByBlock = DAILY_BLOCKS.reduce<Record<number, number>>((accumulator, block) => {
  accumulator[block.block] = block.minutes
  return accumulator
}, {})

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

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())
  const parsed = billingQuerySchema.safeParse(params)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Missing or invalid query fields.' }, { status: 400 })
  }

  const startDate = new Date(parsed.data.startDate)
  const endDate = new Date(parsed.data.endDate)
  endDate.setHours(23, 59, 59, 999)

  if (startDate > endDate) {
    return NextResponse.json({ error: 'startDate must be before or equal to endDate.' }, { status: 400 })
  }

  const observations = await prisma.observation.findMany({
    where: {
      observationDate: {
        gte: startDate,
        lte: endDate,
      },
      ...(parsed.data.organizationId ? { organizationId: parsed.data.organizationId } : {}),
      ...(parsed.data.partnerId ? { program: { partnerId: parsed.data.partnerId } } : {}),
    },
    select: {
      billingCode: true,
      activityBlock: true,
      program: {
        select: {
          partner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  })

  const codeTotals = new Map<string, CodeSummary>()
  const partnerTotals = new Map<string, PartnerSummary>()

  for (const observation of observations) {
    const minutes = minutesByBlock[observation.activityBlock] ?? 0
    const codeKey = observation.billingCode
    const partnerId = observation.program.partner.id
    const partnerName = observation.program.partner.name

    const codeEntry = codeTotals.get(codeKey) ?? {
      code: codeKey,
      observationsCount: 0,
      totalMinutes: 0,
    }
    codeEntry.observationsCount += 1
    codeEntry.totalMinutes += minutes
    codeTotals.set(codeKey, codeEntry)

    const partnerEntry = partnerTotals.get(partnerId) ?? {
      partnerId,
      partnerName,
      observationsCount: 0,
      totalMinutes: 0,
      codeSummary: [],
    }
    partnerEntry.observationsCount += 1
    partnerEntry.totalMinutes += minutes

    const partnerCodeEntry = partnerEntry.codeSummary.find((entry) => entry.code === codeKey)
    if (partnerCodeEntry) {
      partnerCodeEntry.observationsCount += 1
      partnerCodeEntry.totalMinutes += minutes
    } else {
      partnerEntry.codeSummary.push({
        code: codeKey,
        observationsCount: 1,
        totalMinutes: minutes,
      })
    }

    partnerTotals.set(partnerId, partnerEntry)
  }

  const codeSummary = Array.from(codeTotals.values()).sort((a, b) => b.totalMinutes - a.totalMinutes)
  const byPartner = Array.from(partnerTotals.values())
    .map((partner) => ({
      ...partner,
      codeSummary: partner.codeSummary.sort((a, b) => b.totalMinutes - a.totalMinutes),
    }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes)

  const totalMinutes = codeSummary.reduce((total, entry) => total + entry.totalMinutes, 0)
  const totalObservations = codeSummary.reduce((total, entry) => total + entry.observationsCount, 0)

  return NextResponse.json({
    range: {
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
    },
    totals: {
      totalMinutes,
      totalHours: Number((totalMinutes / 60).toFixed(2)),
      totalObservations,
    },
    codeSummary,
    byPartner,
  })
}