const got = require('got');

const DEBUG = 1

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
        commands: (obj, args, context, info) => {
            let url = context.url + 'commands';

            let response = commands;
            let separator = '?';
            if (args.ownerId) {
                url = url + `${separator}ownerId=${args.ownerId}`;
                separator = '&'
            }
            if (args.status) {
                url = url + `${separator}status=${args.status}`;
                separator = '&'
            }
            if (args.page) {
                url = url + `${separator}page=${Cpage}`;
                separator = '&'
            }
            if (args.size) {
                url = url + `${separator}size=${args.size}`;
                separator = '&'
            }
            if (DEBUG) {
                console.log(url);
                return commands;
            }
            else {
                return got (url, { json: true });
            }
        }
    },
    Command: {
        workflows: (obj, args, context, info) => {
            console.log(obj);
            console.log(args);
            let url = context.url + `commands/${obj.id}/workflows`;
            if (DEBUG) {
                console.log("workflows " + url)
                return [];
            }
            else {
                return got (url, { json: true });
            }
        },
        runningWorkflow: (obj, args, context, info) => {
            console.log(obj);
            console.log(args);
            if (obj.workflows) {
                return obj.workflows.find(v => v.startedAt !== undefined && v.endedAt === undefined);
            }
            else {
                console.log("don't know how to do yet");
            }
        }
    }
};