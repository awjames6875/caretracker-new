import { prisma } from '@/lib/prisma'
import { FacilitatorSession } from '@/components/facilitator/FacilitatorSession'
import { DAILY_BLOCKS } from '@/lib/billing-codes'
import { notFound } from 'next/navigation'

function getAgeLabel(dateOfBirth: Date) {
	const today = new Date()
	let years = today.getFullYear() - dateOfBirth.getFullYear()
	const monthDiff = today.getMonth() - dateOfBirth.getMonth()

	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
		years -= 1
	}

	return `${years} years old`
}

function getInitials(firstName: string, lastName: string) {
	return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

export default async function MvpFacilitatorPage() {
  const program = await prisma.program.findFirst({
    where: { status: 'active' },
    include: {
      partner: true,
      dailySchedules: {
        orderBy: { blockNumber: 'asc' },
      },
      children: {
        where: { status: 'active' },
        include: { child: true },
      },
    },
  })

  if (!program || program.children.length === 0) notFound()

  const worker = await prisma.worker.findFirst({
    where: { role: 'facilitator', status: 'active' },
  })

  if (!worker) notFound()

  const blocks = (program.dailySchedules.length > 0 ? program.dailySchedules : DAILY_BLOCKS.map((block) => ({
		id: `fallback-${block.block}`,
		blockNumber: block.block,
		blockName: block.name,
		timeMinutes: block.minutes,
		billingCode: block.code,
	}))).map((block) => ({
		block: block.blockNumber,
		name: block.blockName,
		minutes: block.timeMinutes,
		code: block.billingCode,
	}))

  const children = program.children.map((enrollment) => ({
		id: enrollment.child.id,
		name: `${enrollment.child.firstName} ${enrollment.child.lastName}`,
		ageLabel: getAgeLabel(enrollment.child.dateOfBirth),
		initials: getInitials(enrollment.child.firstName, enrollment.child.lastName),
	}))

  return (
    <FacilitatorSession
      organizationId={program.organizationId}
      programId={program.id}
      workerId={worker.id}
      programName={program.name}
      partnerName={program.partner.name}
      workerName={`${worker.firstName} ${worker.lastName}`}
      blocks={blocks}
      children={children}
    />
  )
}

