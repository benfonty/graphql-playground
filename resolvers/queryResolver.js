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
            console.log(obj);
            console.log(args);
            console.log(context)
            //console.log(info);
            let response = commands;
            if (args.ownerId) {
                response = response.filter(v => v.ownerId === args.ownerId);
            }
            if (args.status) {
                console.log("not used for now " + args.status)
            }
            const size = args.size ? args.size : 10;
            const page = args.page ? args.page : 0;
            const indexBegin = page * size;
            const indexEnd = indexBegin + size;
            return response.slice(indexBegin, indexEnd);
        }
    },
    Command: {
        workflows: (obj, args, context, info) => {
            console.log(obj);
            console.log(args);
            console.log(context)
            return workflows[obj.id] ? workflows[obj.id].map(v => Object.assign({}, v, { commandId: obj.id })) : [];
        },
        runningWorkflow: (obj, args, context, info) => {
            console.log(obj);
            console.log(args);
            console.log(context)
            return workflows[obj.id] ? workflows[obj.id]
                .map(v => Object.assign({}, v, { commandId: obj.id }))
                .find(v => v.startedAt !== undefined && v.endedAt === undefined) : [];
        }
    }
};