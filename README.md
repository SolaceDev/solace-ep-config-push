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

# Outputs
- `deployment_plan`: Application Deployment Plan Preview when `PREVIEW_ONLY` is set


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
- name: Preview Application Version Deployment Plan
  id: plan
  uses: SolaceDev/solace-ep-config-push@v0.1.0
  with:
    SOLACE_CLOUD_TOKEN: ${{ secrets.SOLACE_CLOUD_TOKEN }}
    APPLICATION_VERSION_ID: ${{ env.APPLICATION_VERSION_ID }}
    EVENT_MESH_NAME: ${{ env.EVENT_MESH_NAME }}
    PREVIEW_ONLY: ${{ env.PREVIEW_ONLY }}

- name: Echo plan deployment_plan output
  run: echo "${{ steps.plan.outputs.deployment_plan }}"

- name: PR Comment with Deployment Preview
  uses: actions/github-script@v6
  if: github.event_name == 'pull_request'
  env:
    PLAN: "${{ steps.plan.outputs.deployment_plan }}"
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    script: |
      // 1. Prepare format of the comment
      const output = `#### Application Deployment Plan 📖\`${{ steps.plan.outcome }}\`

      <details><summary>Show Plan</summary>

      \`\`\`\n
      ${process.env.PLAN}
      \`\`\`

      </details>

      *Pusher: @${{ github.actor }}, Action: \`${{ github.event_name }}\` *`;
      
      // 2. Create PR comment with the deployment plan
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