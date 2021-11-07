module.exports.resolver = {
    Query: {
        commands: (obj, args, context, info) => {
            console.log(obj);
            console.log(args);
            console.log(context)
            //console.log(info);
            if (args.ownerId && args.ownerId === "titi") {
                return [
                    {
                        ownerId: "toto",
                        id: "titi",
                        createdAt: new Date().toISOString()
                    }
                ];
            } else {
                return [];
            }
        }
    }
};