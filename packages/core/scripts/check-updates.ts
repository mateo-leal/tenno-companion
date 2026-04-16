import { execSync } from 'child_process'
import { API_URL } from './get-sources-url'
import fs from 'fs'
import path from 'path'

const SHA_FILE = path.join(__dirname, '../data/commit-sha')

const changesetContent = (latestSHA: string) => `---
"@tenno-companion/core": patch
---

Automated data sync with warframe-public-export-plus (${latestSHA.slice(0, 7)})
`

async function run() {
  console.log('Checking for source updates...')

  // Get the latest commit SHA from GitHub
  const response = await fetch(API_URL)
  const { commit } = await response.json()
  const latestSHA = commit.sha

  const lastSHA = fs.existsSync(SHA_FILE)
    ? fs.readFileSync(SHA_FILE, 'utf8').trim()
    : ''

  if (latestSHA === lastSHA) {
    console.log('Data is already up to date.')
    return
  }

  console.log(`New update detected: ${latestSHA.slice(0, 7)}`)

  try {
    console.log('Fetching new data...')
    execSync('npm run fetch-data', { stdio: 'inherit' })

    fs.writeFileSync(SHA_FILE, latestSHA)

    const changesetPath = path.join(
      __dirname,
      `../../../.changeset/auto-update-${Date.now()}.md`
    )

    if (!fs.existsSync(path.dirname(changesetPath))) {
      fs.mkdirSync(path.dirname(changesetPath), { recursive: true })
    }
    fs.writeFileSync(changesetPath, changesetContent(latestSHA))

    console.log('Bumping version...')
    execSync('pnpm changeset version', { stdio: 'inherit' })

    console.log('Update prepared successfully.')
    process.exit(1)
  } catch (error) {
    console.error(
      'Update failed. SHA file not updated, will retry on next run.',
      error
    )
    process.exit(0)
  }
}

run()
