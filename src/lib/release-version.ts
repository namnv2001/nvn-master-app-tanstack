import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as readline from 'node:readline/promises'

export type BumpKind = 'patch' | 'minor' | 'major'

export function parseSemver(s: string): [number, number, number] | null {
  const m = String(s).match(/^(\d+)\.(\d+)\.(\d+)$/)
  if (!m) return null
  return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)]
}

export function cmpSemver(
  a: [number, number, number],
  b: [number, number, number],
): number {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] - b[i]
  }
  return 0
}

export function bumpSemver(
  v: [number, number, number],
  bump: BumpKind,
): [number, number, number] {
  const [x, y, z] = v
  if (bump === 'major') return [x + 1, 0, 0]
  if (bump === 'minor') return [x, y + 1, 0]
  return [x, y, z + 1]
}

export function parseReleaseVersionsFromLsRemote(
  output: string,
): Array<[number, number, number]> {
  const versions: Array<[number, number, number]> = []
  for (const line of output.split('\n')) {
    const t = line.trim()
    if (!t) continue
    const parts = t.split(/\s+/)
    const ref = parts.length >= 2 ? parts[1] : parts[0]
    if (!ref || !ref.startsWith('refs/heads/releases/')) continue
    const name = ref.slice('refs/heads/releases/'.length)
    const v = parseSemver(name)
    if (v) versions.push(v)
  }
  return versions
}

export function readPackageJsonVersion(repoRoot: string): string | undefined {
  const pkgPath = path.join(repoRoot, 'package.json')
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as {
      version?: string
    }
    return pkg.version
  } catch {
    return undefined
  }
}

export interface ComputeNextVersionInput {
  bump: BumpKind
  versionOverride: string
  lsRemoteOutput: string
  packageJsonVersion: string | undefined
}

export function computeNextVersion(input: ComputeNextVersionInput): string {
  const override = input.versionOverride.trim()
  if (override) {
    if (!parseSemver(override)) {
      throw new Error('Invalid version; expected X.Y.Z')
    }
    return override
  }

  const versions = parseReleaseVersionsFromLsRemote(input.lsRemoteOutput)
  let base: [number, number, number]
  if (versions.length > 0) {
    base = versions.reduce((a, b) => (cmpSemver(a, b) >= 0 ? a : b))
  } else {
    base = parseSemver(input.packageJsonVersion ?? '') ?? [0, 0, 0]
  }

  return bumpSemver(base, input.bump).join('.')
}

function execGit(args: string, cwd: string): string {
  return execSync(`git ${args}`, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function isBumpKind(s: string): s is BumpKind {
  return s === 'patch' || s === 'minor' || s === 'major'
}

type ReleaseInput =
  | { mode: 'bump'; bump: BumpKind }
  | { mode: 'exact'; version: string }

async function promptReleaseInput(): Promise<ReleaseInput> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(
      'Release versioning needs an interactive terminal. Open a real shell and run npm run deploy there.',
    )
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  try {
    for (;;) {
      const line = await rl.question(
        'Release: enter bump (patch / minor / major) or exact version (X.Y.Z): ',
      )
      const trimmed = line.trim()
      if (!trimmed) {
        console.log('Please enter patch, minor, major, or X.Y.Z.')
        continue
      }
      const asBump = trimmed.toLowerCase()
      if (isBumpKind(asBump)) {
        return { mode: 'bump', bump: asBump }
      }
      if (parseSemver(trimmed)) {
        return { mode: 'exact', version: trimmed }
      }
      console.log('Invalid. Use patch, minor, major, or semver X.Y.Z (e.g. 1.2.3).')
    }
  } finally {
    rl.close()
  }
}

/**
 * Before build/deploy: asks for bump or exact version, then fetch, compute semver,
 * create and push `releases/<version>` from the current HEAD.
 */
export async function runPreDeployVersioning(
  repoRoot: string = process.cwd(),
): Promise<void> {
  const choice = await promptReleaseInput()
  const versionOverride = choice.mode === 'exact' ? choice.version : ''
  const bump: BumpKind = choice.mode === 'bump' ? choice.bump : 'patch'

  execGit('fetch origin', repoRoot)

  let lsRemoteOutput = ''
  try {
    lsRemoteOutput = execGit(
      'ls-remote --heads origin "refs/heads/releases/*"',
      repoRoot,
    )
  } catch {
    lsRemoteOutput = ''
  }

  const next = computeNextVersion({
    bump,
    versionOverride,
    lsRemoteOutput,
    packageJsonVersion: readPackageJsonVersion(repoRoot),
  })

  const existing = execGit(
    `ls-remote --heads origin "refs/heads/releases/${next}"`,
    repoRoot,
  ).trim()
  if (existing) {
    throw new Error(
      `Branch releases/${next} already exists on origin. Pick another version or delete the remote branch.`,
    )
  }

  execGit(`checkout -b "releases/${next}"`, repoRoot)
  execGit(`push -u origin "releases/${next}"`, repoRoot)

  console.log(`Release branch releases/${next} pushed.`)
}
