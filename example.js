const EventPortal = require('./util/ep')
const ep = new EventPortal()

const EVENT_MESH_NAME = "us-central-solace-Prod"
const APPLICATION_VERSION_ID = "puu886to6kd"
const PREVIEW_ONLY = "False"

async function configPush() {
  try {
    // Get event mesh object
    let {data: mesh} = await ep.getEventMeshes({
      name: EVENT_MESH_NAME
    })

    // Get messaging service object
    let {data: messagingService} = await ep.getMessagingServices({
      eventMeshId: mesh[0].id
    })

    // Get Preview Application Deployment Plan
    if (PREVIEW_ONLY == "TRUE") {
      let plan = await ep.getApplicationDeploymentPlan({
        action: "deploy",
        applicationVersionId: APPLICATION_VERSION_ID,
        eventBrokerId: messagingService[0].id
      })
    } else {
      // Create Application Deployment 
      let deployment_result = await ep.createApplicationDeployment({
        action: "undeploy",
        applicationVersionId: APPLICATION_VERSION_ID,
        eventBrokerId: messagingService[0].id
      })
      console.log(JSON.stringify(deployment_result, null, 2))
    }
  } catch (error) {
    console.error(error)
  }
}

configPush()