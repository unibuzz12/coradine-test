import { IResolvers } from '@graphql-tools/utils';
import Album from '../../models/albumModel';
import validateRequest from '../../validation/validateRequest';
import { 
    createAlbumSchema,
    updateAlbumSchema,
    deleteAlbumSchema,
    queryAlbumSchema,
    queryAlbumsSchema
} from '../../validation/schemas/album.schema';

interface IAlbumCreateArgs {
    collection_id: string,
    name: string,
    image: string,
    description: string
}

interface IAlbumArg {
    id: string,
}

interface IAlbumCollectionArg {
    collection_id: string,
    offset: number,
    limit: number
}

interface IAlbumUpdateArg {
    album_id: string,
    collection_id: string,
    name: string,
    image: string,
    description: string
}

interface IAlbumDeleteArg {
    album_id: string
}

interface IAlbumLengthArg {
    collection_id: string
}

const AlbumResolvers: IResolvers = {
    Query: {
        // Fetch Album with albumID
        async album (__:void, args: IAlbumArg, { user }) {
            await validateRequest(queryAlbumSchema, args);

            if (!user) {
                throw new Error('user not authenticated!');
            }

            const album_id = args.id;
            return await Album.findById(album_id);
        },

        // Fetch Albums with collectionID
        async albums (__:void, args: IAlbumCollectionArg, { user }) {
            await validateRequest(queryAlbumsSchema, args);

            if (!user) {
                throw new Error('user not authenticated!');
            }

            const offset = args.offset;
            const limit = args.limit;
            
            if(args.collection_id) {
                const collection_id = args.collection_id;
                return await Album.find({ collection_id, user: user.id }).skip(offset).limit(limit);
            }

            return await Album.find({ user: user.id }).skip(offset).limit(limit);
        }
    },

    Mutation: {
        // Create Album
        async create_album (__: void, args: IAlbumCreateArgs, { user }): Promise<string> {
            await validateRequest(createAlbumSchema, args);

            if (!user) {
                throw new Error('user not authenticated!');
            }

            const collection_id = args.collection_id;
            const name = args.name;
            const description = args.description;
            const image = args.image;

            // Check Album Exist
            const album = await Album.findOne({ name });

            if (album) {
                throw new Error('Album with same name already exists');
            }
            
            const new_album = await Album.create({
                name,
                description,
                user: user.id,
                image: image,
                collection_id: collection_id
            });

            return JSON.stringify({ 
                success: true,
                album : new_album
            });
        },

        async album_length (__:void, args: IAlbumLengthArg, { user }): Promise<string> {

            if (!user) {
                throw new Error('user not authenticated!');
            }
            
            let count = 0;

            if(args.collection_id) {
                const collection_id = args.collection_id;
                count = await Album.count({ collection_id, user: user.id });
            }

            count = await Album.count({ user: user.id });

            return JSON.stringify({ 
                success: true,
                total : count
            });
        },

        // Update Album
        async update_album (__: void, args: IAlbumUpdateArg, { user }): Promise<string> {
            await validateRequest(updateAlbumSchema, args);

            if (!user) {
                throw new Error('user not authenticated!');
            }

            const album_id = args.album_id;
            const collection_id = args.collection_id;
            const name = args.name;
            const description = args.description;
            const image = args.image;

            // Check Album Exist
            const album = await Album.findById(album_id);

            if (!album) {
                throw new Error('Album not exist');
            }
            
            album.collection_id = collection_id;
            album.name = name;
            album.description = description;
            album.image = image;
            album.save();

            return JSON.stringify({ 
                success: true,
                album : album
            });
        },

        // Delete Album
        async delete_album (__: void, args: IAlbumDeleteArg, { user }): Promise<string> {
            await validateRequest(deleteAlbumSchema, args);

            if (!user) {
                throw new Error('user not authenticated!');
            }

            const album_id = args.album_id;

            // Check Album Exist
            const album = await Album.findById(album_id);

            if (!album) {
                throw new Error('Album not exist');
            }
            
            //should have to remove s3 image resouce.
            
            album.delete();

            return JSON.stringify({ 
                success: true
            });
        }
    }
};

export default AlbumResolvers;