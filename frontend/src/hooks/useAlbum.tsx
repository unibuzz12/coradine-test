import { useDispatch } from 'react-redux';
import { createAlbum, updateAlbum, deleteAlbum } from '../redux/slices/album';
import { IAlbum, IAlbumUpdate, IAlbumDelete } from '../interfaces';

export default function useAlbum() {
  const dispatch = useDispatch();

  return {

    createAlbum: (albumArgs: IAlbum) => dispatch(
      createAlbum({
        collection_id: albumArgs.collection_id,
        name: albumArgs.name,
        image: albumArgs.image,
        description: albumArgs.description
      })
    ),

    updateAlbum: (albumArgs: IAlbumUpdate) => dispatch(
      updateAlbum({
        id: albumArgs.id,
        collection_id: albumArgs.collection_id,
        name: albumArgs.name,
        image: albumArgs.image,
        description: albumArgs.description
      })
    ),

    deleteAlbum: (albumArgs: IAlbumDelete) => dispatch(
      deleteAlbum({
        album_id: albumArgs.album_id
      })
    )
  };
}
