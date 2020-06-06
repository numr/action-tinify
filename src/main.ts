import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'

async function run(): Promise<void> {
  try {
    // const apiKey = core.getInput('api_key', {required: true})
    const githubToken = core.getInput('github_token', {required: true})

    const payload = context.payload

    let commits: any[]

    const octokit = getOctokit(githubToken)

    switch (context.eventName) {
      case 'push':
        commits = payload.commits
        break
      case 'pull_request':
        commits = await octokit.paginate(
          `GET ${payload.pull_request!.commits_url}`
        )
        break
      default:
        throw new Error(`Unsupported event '${context.eventName}'`)
    }

    core.debug(`commits: ${JSON.stringify(commits, null, 4)}`)
  } catch (error) {
    core.debug(error)
    core.setFailed(error.message)
  }
}

run()
