const got = require('got');

const DEBUG = 0

const commands = [
    {
        ownerId: "toto",
        id: "titi",
        createdAt: new Date().toISOString()
    },
    {
        ownerId: "toto",
        id: "toto",
        createdAt: new Date().toISOString()
    },
    {
        ownerId: "tutu",
        id: "tutu",
        createdAt: new Date().toISOString()
    },
];

const workflows = {
    "titi": [
        {
            id: "titi1",
            startedAt: new Date().toISOString(),
            endedAt: new Date().toISOString(),
            operation: "PROVISION"
        },
        {
            id: "titi2",
            startedAt: new Date().toISOString(),
            operation: "UPDATE"
        }
    ],
    "toto": [
        {
            id: "toto1",
            startedAt: new Date().toISOString(),
            endedAt: new Date().toISOString(),
            operation: "PROVISION"
        },
    ],
};

module.exports.resolver = {
    Query: {
        commandsQuery: (_, args, context) => {
            let url = context.url + 'commands';

            let response = commands;
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
            if (DEBUG === 1) {
                return commands;
            }
            else {
                return got (url).json();
            }
        }
    },
    PageOfCommand: {
        size: obj => obj.itemsPerPage
    },
    Command: {
        id: obj => obj.commandId,
        ownerId: obj => obj.tenantId,
        action: obj => obj.command,
        workflows: (obj, _, context) => {
            let url = context.url + `commands/${obj.commandId}/workflows`;
            console.log(url)
            if (DEBUG) {
                return [];
            }
            else {
                return got (url).json();
            }
        },
        runningWorkflow: (obj, _, context) => {
            // graphql doesn't seem to be meant to deal with calculated fields using other fields
            // in order to avoid complicated tricks I query the workflows again if asked
            let url = context.url + `commands/${obj.commandId}/workflows`;
            console.log(url)
            if (DEBUG) {
                return [];
            }
            else {
                return got (url).json().then(response => response.find(v => v.startedAt !== undefined && v.endedAt === undefined));
            }
        }
    },
    Workflow: {
        id: obj => obj.workflowId
    }
};