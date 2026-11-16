-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'provider',
    "subscriptionTier" TEXT DEFAULT 'free',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "billingEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "programType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'onboarding',
    "enrolledChildrenCount" INTEGER NOT NULL DEFAULT 0,
    "totalBillableHours" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ageRange" TEXT NOT NULL,
    "groupSize" INTEGER NOT NULL DEFAULT 8,
    "durationWeeks" INTEGER NOT NULL DEFAULT 8,
    "dailyDurationMinutes" INTEGER NOT NULL DEFAULT 180,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curriculum" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "theme" TEXT NOT NULL,
    "pillar" TEXT NOT NULL,
    "cuePhrase" TEXT NOT NULL,
    "weeklyGoal" TEXT NOT NULL,
    "homeLink" TEXT,
    "materials" TEXT[],
    "generatedBy" TEXT,
    "generatedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "aiPromptUsed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyActivity" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "curriculumId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "activityName" TEXT NOT NULL,
    "activityDescription" TEXT,
    "facilitatorScript" TEXT,
    "billingCode" TEXT NOT NULL,
    "cueMoments" JSONB,
    "stationDescriptions" JSONB,
    "reflectionQuestions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailySchedule" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "blockName" TEXT NOT NULL,
    "timeMinutes" INTEGER NOT NULL,
    "billingCode" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "location" TEXT,
    "orderSequence" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailySchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreatmentGoal" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameSimple" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "observableBehaviors" TEXT[],
    "successCriteria" TEXT,
    "ageRange" TEXT,
    "relatedActivities" TEXT[],
    "relatedThemes" TEXT[],
    "billingCodes" TEXT[],
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreatmentGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT,
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "guardianEmail" TEXT,
    "enrollmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "primaryGoalIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildProgramEnrollment" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "enrollmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dischargeDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "hoursAttended" INTEGER NOT NULL DEFAULT 0,
    "billableHoursLogged" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChildProgramEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildTreatmentGoal" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "assignedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'active',
    "targetDate" TIMESTAMP(3),
    "progressNotes" TEXT,
    "lastProgressUpdate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChildTreatmentGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "partnerId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL,
    "pin" TEXT,
    "passwordHash" TEXT NOT NULL,
    "passwordSalt" TEXT NOT NULL,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Observation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "activityBlock" INTEGER NOT NULL,
    "activityName" TEXT NOT NULL,
    "billingCode" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL DEFAULT 1,
    "dayNumber" INTEGER NOT NULL DEFAULT 1,
    "outcome" TEXT NOT NULL,
    "observedBehaviors" TEXT[],
    "linkedGoalIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "colorCardCounts" JSONB,
    "isBreakthrough" BOOLEAN NOT NULL DEFAULT false,
    "goalProgressRating" INTEGER,
    "observationDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Observation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalNote" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "observationIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "approverWorkerId" TEXT,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "billingCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "serviceDuration" INTEGER NOT NULL DEFAULT 180,
    "serviceLocation" TEXT,
    "generatedContent" TEXT NOT NULL,
    "editedContent" TEXT,
    "subjective" TEXT,
    "objective" TEXT,
    "assessment" TEXT,
    "plan" TEXT,
    "progressContext" TEXT,
    "interventionsUsed" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "linkedGoalNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "goalProgressData" JSONB,
    "odmhsasCompliant" BOOLEAN NOT NULL DEFAULT true,
    "complianceNotes" TEXT,
    "modelVersion" TEXT NOT NULL DEFAULT 'gpt-4o',
    "aiGeneratedAt" TIMESTAMP(3),
    "approvalStatus" TEXT NOT NULL DEFAULT 'pending',
    "approvalComments" TEXT,
    "approvedAt" TIMESTAMP(3),
    "exportedToEhr" BOOLEAN NOT NULL DEFAULT false,
    "ehrExportDate" TIMESTAMP(3),
    "ehrExportSystem" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "resourceDescription" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changes" JSONB,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "canceledAt" TIMESTAMP(3),
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClinicalNoteToObservation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Organization_type_idx" ON "Organization"("type");

-- CreateIndex
CREATE INDEX "Partner_organizationId_idx" ON "Partner"("organizationId");

-- CreateIndex
CREATE INDEX "Partner_status_idx" ON "Partner"("status");

-- CreateIndex
CREATE INDEX "Program_organizationId_idx" ON "Program"("organizationId");

-- CreateIndex
CREATE INDEX "Program_partnerId_idx" ON "Program"("partnerId");

-- CreateIndex
CREATE INDEX "Program_status_idx" ON "Program"("status");

-- CreateIndex
CREATE INDEX "Curriculum_organizationId_idx" ON "Curriculum"("organizationId");

-- CreateIndex
CREATE INDEX "Curriculum_programId_idx" ON "Curriculum"("programId");

-- CreateIndex
CREATE INDEX "Curriculum_status_idx" ON "Curriculum"("status");

-- CreateIndex
CREATE INDEX "WeeklyActivity_organizationId_idx" ON "WeeklyActivity"("organizationId");

-- CreateIndex
CREATE INDEX "WeeklyActivity_curriculumId_idx" ON "WeeklyActivity"("curriculumId");

-- CreateIndex
CREATE INDEX "WeeklyActivity_programId_idx" ON "WeeklyActivity"("programId");

-- CreateIndex
CREATE INDEX "DailySchedule_organizationId_idx" ON "DailySchedule"("organizationId");

-- CreateIndex
CREATE INDEX "DailySchedule_programId_idx" ON "DailySchedule"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "DailySchedule_programId_blockNumber_key" ON "DailySchedule"("programId", "blockNumber");

-- CreateIndex
CREATE INDEX "TreatmentGoal_organizationId_idx" ON "TreatmentGoal"("organizationId");

-- CreateIndex
CREATE INDEX "TreatmentGoal_programId_idx" ON "TreatmentGoal"("programId");

-- CreateIndex
CREATE INDEX "TreatmentGoal_category_idx" ON "TreatmentGoal"("category");

-- CreateIndex
CREATE INDEX "Child_organizationId_idx" ON "Child"("organizationId");

-- CreateIndex
CREATE INDEX "Child_status_idx" ON "Child"("status");

-- CreateIndex
CREATE INDEX "ChildProgramEnrollment_childId_idx" ON "ChildProgramEnrollment"("childId");

-- CreateIndex
CREATE INDEX "ChildProgramEnrollment_programId_idx" ON "ChildProgramEnrollment"("programId");

-- CreateIndex
CREATE INDEX "ChildProgramEnrollment_status_idx" ON "ChildProgramEnrollment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ChildProgramEnrollment_childId_programId_key" ON "ChildProgramEnrollment"("childId", "programId");

-- CreateIndex
CREATE INDEX "ChildTreatmentGoal_childId_idx" ON "ChildTreatmentGoal"("childId");

-- CreateIndex
CREATE INDEX "ChildTreatmentGoal_goalId_idx" ON "ChildTreatmentGoal"("goalId");

-- CreateIndex
CREATE INDEX "ChildTreatmentGoal_status_idx" ON "ChildTreatmentGoal"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ChildTreatmentGoal_childId_goalId_key" ON "ChildTreatmentGoal"("childId", "goalId");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_email_key" ON "Worker"("email");

-- CreateIndex
CREATE INDEX "Worker_organizationId_idx" ON "Worker"("organizationId");

-- CreateIndex
CREATE INDEX "Worker_partnerId_idx" ON "Worker"("partnerId");

-- CreateIndex
CREATE INDEX "Worker_role_idx" ON "Worker"("role");

-- CreateIndex
CREATE INDEX "Worker_email_idx" ON "Worker"("email");

-- CreateIndex
CREATE INDEX "Observation_organizationId_idx" ON "Observation"("organizationId");

-- CreateIndex
CREATE INDEX "Observation_programId_idx" ON "Observation"("programId");

-- CreateIndex
CREATE INDEX "Observation_childId_idx" ON "Observation"("childId");

-- CreateIndex
CREATE INDEX "Observation_workerId_idx" ON "Observation"("workerId");

-- CreateIndex
CREATE INDEX "Observation_observationDate_idx" ON "Observation"("observationDate");

-- CreateIndex
CREATE INDEX "Observation_billingCode_idx" ON "Observation"("billingCode");

-- CreateIndex
CREATE INDEX "ClinicalNote_organizationId_idx" ON "ClinicalNote"("organizationId");

-- CreateIndex
CREATE INDEX "ClinicalNote_programId_idx" ON "ClinicalNote"("programId");

-- CreateIndex
CREATE INDEX "ClinicalNote_childId_idx" ON "ClinicalNote"("childId");

-- CreateIndex
CREATE INDEX "ClinicalNote_approvalStatus_idx" ON "ClinicalNote"("approvalStatus");

-- CreateIndex
CREATE INDEX "ClinicalNote_serviceDate_idx" ON "ClinicalNote"("serviceDate");

-- CreateIndex
CREATE INDEX "AuditLog_organizationId_idx" ON "AuditLog"("organizationId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_resourceType_idx" ON "AuditLog"("resourceType");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_organizationId_key" ON "Subscription"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_organizationId_idx" ON "Subscription"("organizationId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE UNIQUE INDEX "_ClinicalNoteToObservation_AB_unique" ON "_ClinicalNoteToObservation"("A", "B");

-- CreateIndex
CREATE INDEX "_ClinicalNoteToObservation_B_index" ON "_ClinicalNoteToObservation"("B");

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyActivity" ADD CONSTRAINT "WeeklyActivity_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyActivity" ADD CONSTRAINT "WeeklyActivity_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailySchedule" ADD CONSTRAINT "DailySchedule_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentGoal" ADD CONSTRAINT "TreatmentGoal_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentGoal" ADD CONSTRAINT "TreatmentGoal_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildProgramEnrollment" ADD CONSTRAINT "ChildProgramEnrollment_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildProgramEnrollment" ADD CONSTRAINT "ChildProgramEnrollment_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildTreatmentGoal" ADD CONSTRAINT "ChildTreatmentGoal_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildTreatmentGoal" ADD CONSTRAINT "ChildTreatmentGoal_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "TreatmentGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNote" ADD CONSTRAINT "ClinicalNote_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNote" ADD CONSTRAINT "ClinicalNote_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNote" ADD CONSTRAINT "ClinicalNote_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNote" ADD CONSTRAINT "ClinicalNote_approverWorkerId_fkey" FOREIGN KEY ("approverWorkerId") REFERENCES "Worker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClinicalNoteToObservation" ADD CONSTRAINT "_ClinicalNoteToObservation_A_fkey" FOREIGN KEY ("A") REFERENCES "ClinicalNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClinicalNoteToObservation" ADD CONSTRAINT "_ClinicalNoteToObservation_B_fkey" FOREIGN KEY ("B") REFERENCES "Observation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
