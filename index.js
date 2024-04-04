const core = require('@actions/core');
const EventPortal = require('./util/ep')
const ep = new EventPortal()

async function configPush() {
  try {
    process.env.SOLACE_CLOUD_TOKEN =   core.getInput('SOLACE_CLOUD_TOKEN');
    const APPLICATION_VERSION_ID = core.getInput('APPLICATION_VERSION_ID')
    const EVENT_MESH_NAME = core.getInput('EVENT_MESH_NAME')
    const PREVIEW_ONLY = core.getInput('PREVIEW_ONLY')
    const ACTION = core.getInput('ACTION').toLowerCase()

    // Get event mesh object
    let {data: mesh} = await ep.getEventMeshes({
      name: EVENT_MESH_NAME
    })

    // Get messaging service object
    let {data: messagingService} = await ep.getMessagingServices({
      eventMeshId: mesh[0].id
    })

    // Get Preview Application Deployment Plan
    if (PREVIEW_ONLY != "false") {
      let plan = await ep.getApplicationDeploymentPlan({
        action: ACTION,
        applicationVersionId: APPLICATION_VERSION_ID,
        eventBrokerId: messagingService[0].id
      })
      core.setOutput("deployment_plan", JSON.stringify(plan, null, 2));
    } else {
      // Create Application Deployment 
      await ep.createApplicationDeployment({
        action: ACTION,
        applicationVersionId: APPLICATION_VERSION_ID,
        eventBrokerId: messagingService[0].id
      })
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

configPush()

