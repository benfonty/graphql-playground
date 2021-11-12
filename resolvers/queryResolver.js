const got = require('got');
const graphqlFields = require('graphql-fields');

module.exports.resolver = {
    Query: {
        commandsQuery: async (_, args, context, info) => {
            let url = context.url + 'commands';

            let separator = '?';
            if (args.ownerId) {
                url = url + `${separator}tenantId=${args.ownerId}`;
                separator = '&'
            }
            if (args.status) {
                url = url + `${separator}status=${args.status}`;
                separator = '&'
            }
            if (args.page) {
                url = url + `${separator}page=${args.page}`;
                separator = '&'
            }
            if (args.size) {
                url = url + `${separator}size=${args.size}`;
                separator = '&'
            }
            console.log(url);
            return await got (url).json();
        },
        taskHistoryQuery: async (_, args, context, info) => {
            let url = context.url + `tasks/${args.taskId}/history`
            console.log(url);
            return await got (url).json();
        }
    },
    PageOfCommand: {
        size: obj => obj.itemsPerPage
    },
    Command: {
        id: obj => obj.commandId,
        ownerId: obj => obj.tenantId,
        action: obj => obj.command,
        workflows: async (obj, _, context) => {
            let url = context.url + `commands/${obj.commandId}/workflows`;
            console.log(url)
            return await got (url).json();
        },
        runningWorkflow: async (obj, _, context) => {
            // graphql doesn't seem to be meant to deal with calculated fields using other fields
            // in order to avoid complicated tricks I query the workflows again if asked
            let url = context.url + `commands/${obj.commandId}/workflows`;
            console.log(url)
            const allWorkflows = await got (url).json();
            return allWorkflows.find(v => v.startedAt !== undefined && v.endedAt === undefined);
        }
    },
    Workflow: {
        id: obj => obj.workflowId,
        tasks: async (obj, _, context, info) => {
            const topLevelFields = graphqlFields(info);
            const fieldsFromTask = ["id", "name", "parameters", "dependsOn", "operation", "applications"];
            const fieldsFromTaskStatus = ["timestamp", "status", "retryCount", "details", "executeAt"];
            const askedFieldsFromTaskStatus = fieldsFromTaskStatus.filter(value => Object.keys(topLevelFields).includes(value));
            let url = context.url + `workflows/${obj.workflowId}/tasks`;
            if (askedFieldsFromTaskStatus.length !== 0) {
                url = context.url + `workflows/${obj.workflowId}/statuses`;
            }
            console.log(url)
            return await got (url).json();
        } 
    }
};