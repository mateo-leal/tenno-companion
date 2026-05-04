export async function checkGitHubUpdate(config: {
  owner: string
  repo: string
  branch: string
  commitHash: string
  retryDelayMs?: number // Optional delay, e.g., 2000ms
}) {
  const { owner, repo, branch, commitHash, retryDelayMs = 2000 } = config

  const url = `https://api.github.com/repos/${owner}/${repo}/branches/${branch}`

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  async function performFetch() {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`)
    }
    return response.json()
  }

  try {
    let data
    try {
      // First attempt
      data = await performFetch()
    } catch {
      // If first attempt fails, wait and try one more time
      await sleep(retryDelayMs)
      data = await performFetch()
    }

    const latestSHA: string = data.commit.sha
    return {
      isUpdateAvailable: latestSHA !== commitHash,
      latestSHA,
    }
  } catch (finalError) {
    return {
      error:
        finalError instanceof Error ? finalError.message : String(finalError),
    }
  }
}
