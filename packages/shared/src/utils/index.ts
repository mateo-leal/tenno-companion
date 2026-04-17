export async function checkGitHubUpdate(config: {
  owner: string
  repo: string
  branch: string
  commitHash: string
}) {
  const { owner, repo, branch, commitHash } = config

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches/${branch}`
  )
  const { commit } = await response.json()
  const latestSHA: string = commit.sha

  return { isUpdateAvailable: latestSHA !== commitHash, latestSHA }
}
