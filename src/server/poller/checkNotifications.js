import OctoKit from '@octokit/rest';

async function checkNotifications(token, since) {
  const octokit = new OctoKit();

  octokit.authenticate({
    token,
    type: 'token',
  })

  return await octokit.activity.getNotifications(since ? { since } : {});
}

export default checkNotifications;
