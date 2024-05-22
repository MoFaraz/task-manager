import { Prisma } from "@prisma/client";

const timeStampMiddleware: Prisma.Middleware = async (params, next) => {
    if (params.action === 'create' || params.action === 'update') {
        if (params.args.data) {
            if (params.action === 'create') {
                params.args.data.createdDate = new Date();
            }
            params.args.data.lastModifiedDate = new Date();
        }
    }
    return next(params);
};

export { timeStampMiddleware };
