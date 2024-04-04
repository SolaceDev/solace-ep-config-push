# Solace PubSub+ Configuration Push Github Action
This github action facilitates configuration push of applications from Event Portal to Solace PubSub+ Event Broker

## Assumption
- Event Management Agent is configured and running. More details found here https://solace-se.solace.cloud/ep/runtime/event-management-agents
  - Note: change domain to match your organization

# Inputs

  | Variable name  | Required/Optional | Description | Default |
  | ------------- | ------------- | ------------- | ------------- |
  | `SOLACE_CLOUD_TOKEN`  | Required  | Solace Cloud token | NA |
  | `APPLICATION_VERSION_ID`  | Required  | Application Version ID to promote | NA |
  | `EVENT_MESH_NAME`  | Required  | The target Event Mesh to Promote to | NA |
  | `PREVIEW_ONLY`  | Optional  | Preview Application Deployment Plan | false |
  | `ACTION`  | Optional  | `deploy` or `undeploy` | deploy |

## Example usage

```yaml
- name: Deploy Application Version ID
  uses: SolaceDev/solace-ep-config-push
  env: 
    APPLICATION_VERSION_ID: ApplicationVersionID
    EVENT_MESH_NAME: EventMeshName
  with:
    SOLACE_CLOUD_TOKEN: ${{ secrets.SOLACE_CLOUD_TOKEN }}
    APPLICATION_VERSION_ID: ${{ env.APPLICATION_VERSION_ID }}
    EVENT_MESH_NAME: ${{ env.EVENT_MESH_NAME }}
```

```yaml
- name: Preview Application Deployment Plan
  uses: SolaceDev/solace-ep-config-push
  id: deployment_preview
  env: 
    APPLICATION_VERSION_ID: ApplicationVersionID
    EVENT_MESH_NAME: EventMeshName
    PREVIEW_ONLY: "true"
  with:
    SOLACE_CLOUD_TOKEN: ${{ secrets.SOLACE_CLOUD_TOKEN }}
    APPLICATION_VERSION_ID: ${{ env.APPLICATION_VERSION_ID }}
    EVENT_MESH_NAME: ${{ env.EVENT_MESH_NAME }}
    PREVIEW_ONLY: ${{ env.PREVIEW_ONLY }}

- name: PR Comment with Deployment Preview
  uses: actions/github-script@v6
  if: github.event_name == 'pull_request'
  env:
    PREVIEW: "${{ steps.deployment_preview.outputs.deployment_plan }}"
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    script: |
      // 1. Retrieve existing bot comments for the PR
      const { data: comments } = await github.rest.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
      })
      const botComment = comments.find(comment => {
        return comment.user.type === 'Bot' && comment.body.includes('Terraform Format and Style')
      })

      // 2. Prepare format of the comment
      const output = `#### Application Deployment Plan 📖\`${{ steps.deployment_preview.outcome }}\`

      <details><summary>Show Plan</summary>

      \`\`\`\n
      ${process.env.PREVIEW}
      \`\`\`

      </details>

      *Pusher: @${{ github.actor }}, Action: \`${{ github.event_name }}\` *`;

      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: output
      })
```

## To Run locally
- Node 20+
- `node example.js`