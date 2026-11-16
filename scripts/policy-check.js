const fs = require('fs')
const path = require('path')

const workspaceRoot = process.cwd()

const targetDirs = [
  'src/app/(facilitator)',
  'src/components/facilitator',
  'src/app/(admin)',
  'src/components/admin',
  'src/app/login',
  'src/app/mvp/facilitator',
]

const sourceDirsForPhiChecks = ['src']

const bannedTerms = [
  'therapy',
  'therapist',
  'counselor',
  'counseling',
  'clinician',
  'assessment',
  'evaluation',
  'diagnosis',
  'treatment plan',
  'intervention',
  'therapeutic',
  'clinical',
  'adhd',
  'odd',
  'asd',
  'anxiety',
  'depression',
  'bipolar',
  'manic',
  'dysregulation',
  'dysregulated',
  'triggered',
  'trauma response',
  'oppositional',
  'defiant',
  'conduct disorder',
  'patient',
  'symptoms',
  'presenting behaviors',
  'mental health',
  'behavioral health',
]

const textExtensions = new Set(['.ts', '.tsx', '.js', '.jsx'])

const phiFieldRegex = /\b(firstName|lastName|dateOfBirth|guardianName|guardianPhone|guardianEmail|contactEmail|contactPhone)\b/i
const consoleLogRegex = /console\.(log|info|warn|error)\s*\(/i
const nameInPathRegex = /\/(kid|child|partner)\/\$\{[^}]*name[^}]*\}/i

function walkDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return []

  const files = []
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkDirectory(fullPath))
    } else if (textExtensions.has(path.extname(entry.name))) {
      files.push(fullPath)
    }
  }

  return files
}

function getLineNumber(content, index) {
  const prefix = content.slice(0, index)
  return prefix.split('\n').length
}

function toWorkspaceRelative(fullPath) {
  return path.relative(workspaceRoot, fullPath).replace(/\\/g, '/')
}

function checkBannedTerms() {
  const violations = []

  for (const dir of targetDirs) {
    const absoluteDir = path.join(workspaceRoot, dir)
    const files = walkDirectory(absoluteDir)

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      const normalized = content.toLowerCase()

      for (const term of bannedTerms) {
        const termIndex = normalized.indexOf(term)
        if (termIndex !== -1) {
          violations.push({
            type: 'BANNED_TERM',
            file: toWorkspaceRelative(file),
            line: getLineNumber(content, termIndex),
            detail: `Found banned term: "${term}"`,
          })
        }
      }
    }
  }

  return violations
}

function checkPhiSafety() {
  const violations = []

  for (const dir of sourceDirsForPhiChecks) {
    const absoluteDir = path.join(workspaceRoot, dir)
    const files = walkDirectory(absoluteDir)

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      const lines = content.split('\n')

      for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
        const line = lines[lineIndex]

        if (consoleLogRegex.test(line) && phiFieldRegex.test(line)) {
          violations.push({
            type: 'PHI_LOG_RISK',
            file: toWorkspaceRelative(file),
            line: lineIndex + 1,
            detail: 'Possible PHI field in console logging statement',
          })
        }

        if (nameInPathRegex.test(line)) {
          violations.push({
            type: 'PHI_URL_RISK',
            file: toWorkspaceRelative(file),
            line: lineIndex + 1,
            detail: 'Possible name used in URL path parameter',
          })
        }
      }
    }
  }

  return violations
}

function printReport(violations) {
  if (violations.length === 0) {
    console.log('Policy check passed: no constraint violations found.')
    return
  }

  console.error(`Policy check failed with ${violations.length} violation(s):`)
  for (const violation of violations) {
    console.error(`- [${violation.type}] ${violation.file}:${violation.line} - ${violation.detail}`)
  }
  process.exitCode = 1
}

function main() {
  const violations = [...checkBannedTerms(), ...checkPhiSafety()]
  printReport(violations)
}

main()
