import { object, string, number } from "yup";

export const createAlbumSchema = object({
    args: object({
        collection_id: string()
            .required('Collection ID is required.'),
        name: string()
            .max(32)
            .required('Album name is required.'),
        description: string()
            .max(512)
            .required('Album description is required.'),
        image: string()
            .url('Must be a URL')
            .required('Album Image is required.'),
    }),
});

export const updateAlbumSchema = object({
    args: object({
        album_id: string()
            .required('Album ID is required.'),
        collection_id: string()
            .required('Collection ID is required.'),
        name: string()
            .max(32)
            .required('Album name is required.'),
        description: string()
            .max(512)
            .required('Album description is required.'),
        image: string()
            .url('Must be a URL')
            .required('Album Image is required.'),
    }),
});

export const deleteAlbumSchema = object({
    args: object({
        album_id: string()
            .required('Album ID is required.')
    }),
});

export const queryAlbumSchema = object({
    args: object({
        id: string()
            .required('Album ID is required.')
    }),
});

export const queryAlbumsSchema = object({
    args: object({
        offset: number()
            .required('Offset is required.'),
        limit: number()
            .required('Limit is required.'),
    }),
});