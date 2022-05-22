import { IResolvers } from '@graphql-tools/utils';
import Collection from '../../models/collectionModel';
import validateRequest from '../../validation/validateRequest';
import { createCollectionSchema } from '../../validation/schemas/collection.schema';

interface ICollectionArgs {
    name: string
}

const CollectionResolvers: IResolvers = {
    Query: {
        // Fetch current authenticated user profile
        async collections (__:void, args: void, { user }) {
            if (!user) {
                throw new Error('user not authenticated!');
            }

            return await Collection.find();
        }
    },

    Mutation: {
        // Create new collection
        async create_collection (__: void, args: ICollectionArgs, { user }): Promise<string> {
            await validateRequest(createCollectionSchema, args);

            if (!user) {
                throw new Error('user not authenticated!');
            }

            const name = args.name;

            // Check Collection Exist
            const collection = await Collection.findOne({ name });

            if (collection) {
                throw new Error('Collection with same name already exists');
            }
            
            const new_collection = await Collection.create({
                name
            });

            return JSON.stringify({ 
                success: true,
                collection : new_collection
            });
        }
    }
};

export default CollectionResolvers;