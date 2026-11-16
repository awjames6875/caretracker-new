import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DAILY_BLOCKS = [
	{ blockNumber: 1, blockName: 'Check-In', timeMinutes: 15, billingCode: 'H2015-HA', activityType: 'check_in' },
	{
		blockNumber: 2,
		blockName: 'Skill Lesson',
		timeMinutes: 25,
		billingCode: 'H2014-HA',
		activityType: 'skill_lesson',
	},
	{
		blockNumber: 3,
		blockName: 'GYM Activity',
		timeMinutes: 60,
		billingCode: 'H2021-HA',
		activityType: 'physical_activity',
	},
	{ blockNumber: 4, blockName: 'Break/Reset', timeMinutes: 15, billingCode: 'H2015-HA', activityType: 'break' },
	{
		blockNumber: 5,
		blockName: 'Stations & Game',
		timeMinutes: 35,
		billingCode: 'H2014-HA',
		activityType: 'group_game',
	},
	{
		blockNumber: 6,
		blockName: 'Reflection & Closing',
		timeMinutes: 30,
		billingCode: 'H2015-HA',
		activityType: 'reflection',
	},
]

async function seedDailySchedule(programId: string, organizationId: string) {
	await prisma.dailySchedule.createMany({
		data: DAILY_BLOCKS.map((block) => ({
			organizationId,
			programId,
			blockNumber: block.blockNumber,
			blockName: block.blockName,
			timeMinutes: block.timeMinutes,
			billingCode: block.billingCode,
			activityType: block.activityType,
			orderSequence: block.blockNumber,
		})),
	})
}

async function main() {
	await prisma.auditLog.deleteMany()
	await prisma.clinicalNote.deleteMany()
	await prisma.observation.deleteMany()
	await prisma.childTreatmentGoal.deleteMany()
	await prisma.treatmentGoal.deleteMany()
	await prisma.childProgramEnrollment.deleteMany()
	await prisma.child.deleteMany()
	await prisma.dailySchedule.deleteMany()
	await prisma.weeklyActivity.deleteMany()
	await prisma.curriculum.deleteMany()
	await prisma.program.deleteMany()
	await prisma.worker.deleteMany()
	await prisma.partner.deleteMany()
	await prisma.organization.deleteMany()

	const organization = await prisma.organization.create({
		data: {
			name: 'SafeHarbor Behavioral Health',
			type: 'provider',
			subscriptionTier: 'professional',
			billingEmail: 'billing@safeharbor.example',
		},
	})

	const bodyBrainPartner = await prisma.partner.create({
		data: {
			organizationId: organization.id,
			name: 'Body and Brain Family Center',
			contactName: 'Tina Moore',
			contactEmail: 'tina@bodybrain.example',
			programType: 'daycare',
			status: 'active',
		},
	})

	const jtbPartner = await prisma.partner.create({
		data: {
			organizationId: organization.id,
			name: 'Just The Brethren Gym',
			contactName: 'Marcus Lane',
			contactEmail: 'marcus@jtb.example',
			programType: 'gym',
			status: 'active',
		},
	})

	const bodyBrainProgram = await prisma.program.create({
		data: {
			organizationId: organization.id,
			partnerId: bodyBrainPartner.id,
			name: 'Body and Brain Kids',
			description: 'Movement and focus activities for ages 5-10',
			ageRange: '5-10',
			groupSize: 10,
			durationWeeks: 8,
			status: 'active',
		},
	})

	const jtbProgram = await prisma.program.create({
		data: {
			organizationId: organization.id,
			partnerId: jtbPartner.id,
			name: 'JTB Confidence Crew',
			description: 'Boxing, games, and team skill sessions',
			ageRange: '6-12',
			groupSize: 12,
			durationWeeks: 8,
			status: 'active',
		},
	})

	await seedDailySchedule(bodyBrainProgram.id, organization.id)
	await seedDailySchedule(jtbProgram.id, organization.id)

	const therapist = await prisma.worker.create({
		data: {
			organizationId: organization.id,
			firstName: 'Avery',
			lastName: 'Thomas',
			email: 'avery.therapist@safeharbor.example',
			role: 'therapist',
			passwordHash: 'demo_hash',
			passwordSalt: 'demo_salt',
			status: 'active',
		},
	})

	const facilitator = await prisma.worker.create({
		data: {
			organizationId: organization.id,
			partnerId: bodyBrainPartner.id,
			firstName: 'Jamal',
			lastName: 'Green',
			email: 'jamal.facilitator@safeharbor.example',
			role: 'facilitator',
			pin: '1234',
			passwordHash: 'demo_hash',
			passwordSalt: 'demo_salt',
			status: 'active',
		},
	})

	const childOne = await prisma.child.create({
		data: {
			organizationId: organization.id,
			firstName: 'Jayden',
			lastName: 'Cole',
			dateOfBirth: new Date('2017-05-09'),
			guardianName: 'Kara Cole',
			guardianPhone: '555-0101',
			status: 'active',
		},
	})

	const childTwo = await prisma.child.create({
		data: {
			organizationId: organization.id,
			firstName: 'Mia',
			lastName: 'Ramirez',
			dateOfBirth: new Date('2018-10-14'),
			guardianName: 'Luis Ramirez',
			guardianPhone: '555-0102',
			status: 'active',
		},
	})

	await prisma.childProgramEnrollment.createMany({
		data: [
			{
				childId: childOne.id,
				programId: bodyBrainProgram.id,
				status: 'active',
			},
			{
				childId: childTwo.id,
				programId: bodyBrainProgram.id,
				status: 'active',
			},
		],
	})

	const goalOne = await prisma.treatmentGoal.create({
		data: {
			organizationId: organization.id,
			programId: bodyBrainProgram.id,
			code: 'BB-COMM-01',
			nameSimple: 'Uses kind words with peers',
			category: 'communication',
			observableBehaviors: ['Used kind words', 'Asked for help'],
			successCriteria: '4 out of 5 sessions',
			ageRange: '5-10',
			relatedActivities: ['Circle talk', 'Partner game'],
			relatedThemes: ['Teamwork'],
			billingCodes: ['H2014-HA'],
		},
	})

	await prisma.childTreatmentGoal.createMany({
		data: [
			{ childId: childOne.id, goalId: goalOne.id, status: 'active', priority: 1 },
			{ childId: childTwo.id, goalId: goalOne.id, status: 'active', priority: 1 },
		],
	})

	await prisma.observation.createMany({
		data: [
			{
				organizationId: organization.id,
				programId: bodyBrainProgram.id,
				childId: childOne.id,
				workerId: facilitator.id,
				activityBlock: 1,
				activityName: 'Check-In Circle',
				billingCode: 'H2015-HA',
				weekNumber: 1,
				dayNumber: 1,
				outcome: 'positive',
				observedBehaviors: ['Greeted group', 'Shared feeling words'],
				linkedGoalIds: [goalOne.id],
				notes: 'Joined group quickly and stayed on task.',
				colorCardCounts: { green: 3, yellow: 0, red: 0 },
				observationDate: new Date(),
			},
			{
				organizationId: organization.id,
				programId: bodyBrainProgram.id,
				childId: childTwo.id,
				workerId: facilitator.id,
				activityBlock: 3,
				activityName: 'Movement Relay',
				billingCode: 'H2021-HA',
				weekNumber: 1,
				dayNumber: 1,
				outcome: 'neutral',
				observedBehaviors: ['Needed one reminder', 'Returned to group after break'],
				linkedGoalIds: [goalOne.id],
				notes: 'Needed short break and rejoined after 2 minutes.',
				colorCardCounts: { green: 2, yellow: 1, red: 0 },
				observationDate: new Date(),
			},
		],
	})

	await prisma.auditLog.create({
		data: {
			organizationId: organization.id,
			userId: therapist.id,
			action: 'create',
			resourceType: 'seed',
			resourceId: organization.id,
			resourceDescription: 'Seeded MVP starter records',
		},
	})

	console.log('Seed complete: organization, partners, programs, workers, children, goals, and observations created.')
}

main()
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
