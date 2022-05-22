export interface ILogin {
    email: string;
    password: string;
}

export interface IRegister {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
}

export interface IUser {
    id: string;
    email: string;
}

export interface IFilter {
    id: number,
    name: string
}

export interface IDecoded {
    id: string;
    email: string;
    iat: number;
    exp: number;
}

export interface ISelectFilter {
    value: string,
    handleChange: (...args: any[]) => any,
    datas: IFilter[],
}

export interface IAlbum {
    collection_id: string,
    name: string,
    image: string,
    description: string
}

export interface IAlbumUpdate {
    id: string,
    collection_id: string,
    name: string,
    image: string,
    description: string
}

export interface IAlbumDelete {
    album_id: string
}

export interface IAlbumsGet {
    collection_id: string,
    offset: number,
    limit: number
}

export interface ICollection {
    id: string,
    name: string
}

export interface ICollections {
    collections: ICollection[]
}
