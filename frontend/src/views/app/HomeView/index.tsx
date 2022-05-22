import React, { useState, useMemo, useEffect, useCallback, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InfinitScroll from 'react-infinite-scroll-component';
import Grid from '@material-ui/core/Grid';
import SelectFilter from '../../../components/SelectFilter';
import AlbumDialog from '../../../components/AlbumDialog';
import DeleteDialog from '../../../components/DeleteDialog';
import AlbumCard from '../../../components/AlbumCard';
import { getCollections } from '../../../redux/slices/collection';
import { getAlbums } from '../../../redux/slices/album';
import { IRootState } from '../../../redux/store';
import { IAlbumUpdate } from '../../../interfaces';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 0),
  },
  addNewButton: {
    backgroundColor: '#3f51b5',
    color: '#ffffff',
    height: '40px'
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  deleteIcon: {
    marginLeft: 'auto!important',
    marginRight: 0,
  },
  actionTopView: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}));

function HomeView() : ReactElement {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { collections } = useSelector((state: IRootState) => state.collection);
  const { albums, total, hasMore } = useSelector((state: IRootState) => state.album);

  const [page, setPage] = useState(0);
  const [isFetch, setIsFetch] = useState(true);
  const [collection, setCollection] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [albumIndex, setAlbumIndex] = useState(0);
  const [albumId, setAlbumId] = useState('');

  const getAlbumDatas = useCallback(() => {
    if(isFetch) {
      dispatch(getAlbums(collection === "all" ? "" : collection, page));
      setIsFetch(false);
    }
  }, [dispatch, isFetch, page, collection]);

  useEffect(() => {
    // Get pre-defined collections
    dispatch(getCollections());
    // Get registerd album datas
    getAlbumDatas();
  }, [dispatch, isFetch]);

  const handleCollectionFilter = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
    setCollection(event.target.value as string);
    setPage(0);
    setIsFetch(true);
  }, []);

  const handleAddNewAlbum = useCallback(() => {
    setIsOpen(true);
    setIsEdit(false);
  }, []);

  const onSaveNewAlbum = useCallback(() => {
    setIsOpen(false);
    setPage(0);
    setIsFetch(true);
  }, []);

  const onUpdateAlbum = useCallback(() => {
    setIsOpen(false);
    setPage(0);
    setIsFetch(true);
  }, []);

  const onCloseAlbumDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  const showAlbumDialog = useMemo(() => {

    return (
      !isEdit ? <AlbumDialog
        isOpen = {isOpen}
        isEdit = {isEdit}
        onSaveNewAlbum = {onSaveNewAlbum}
        onUpdateAlbum = {onUpdateAlbum}
        onCloseAlbumDialog = {onCloseAlbumDialog}
      /> : <AlbumDialog
        isOpen = {isOpen}
        isEdit = {isEdit}
        id = {(albums[albumIndex] as IAlbumUpdate).id}
        name = {(albums[albumIndex] as IAlbumUpdate).name}
        image = {(albums[albumIndex] as IAlbumUpdate).image}
        description = {(albums[albumIndex] as IAlbumUpdate).description}
        collection_id = {(albums[albumIndex] as IAlbumUpdate).collection_id}
        onSaveNewAlbum = {onSaveNewAlbum}
        onUpdateAlbum = {onUpdateAlbum}
        onCloseAlbumDialog = {onCloseAlbumDialog}
      />
    );
  }, [isOpen, isEdit]);

  const handleNextPage = useCallback(() => {
    setPage(page + 1);
    setIsFetch(true);
  }, []);

  const onEditAlbum = useCallback((albumIndex: number) => {
    setAlbumIndex(albumIndex);
    setIsEdit(true);
    setIsOpen(true);
  }, []);

  const onDeleteAlbum = useCallback((albumIndex: number) => {
    setAlbumId((albums[albumIndex] as IAlbumUpdate).id);
    setIsDeleteOpen(true);
  }, [albums]);

  const onCloseDeleteDialog = useCallback(() => {
    setIsDeleteOpen(false);
  }, []);

  const onDeleteSuccess = useCallback(() => {
    setIsDeleteOpen(false);
    setPage(0);
    setIsFetch(true);
  }, []);

  const showDeleteDialog = useMemo(() => {

    return (
      <DeleteDialog
        isOpen = {isDeleteOpen}
        album_id = {albumId}
        onCloseDeleteDialog = {onCloseDeleteDialog}
        onDeleteSuccess = {onDeleteSuccess}
      />
    );
  }, [isDeleteOpen]);

  const showAlbumCards = useMemo(() => {
    return albums.length > 0 ? albums.map((album: IAlbumUpdate, index: number) => (
      <Grid item key={album.id} xs={12} sm={6} md={4} lg={3}>
        <AlbumCard header={album.name} content={album.description} image={album.image} albumIndex={index} onEditAlbum={onEditAlbum} onDeleteAlbum={onDeleteAlbum} />
      </Grid>)) : <p style={{ fontSize: '20px', textAlign: 'center', width: '100%' }}>There is no album in this collection...</p>;
  }, [albums])

  return (
    <main>
      <div className={classes.heroContent}>
        <Container className={classes.actionTopView}>
          <SelectFilter value={collection} handleChange={handleCollectionFilter} datas={collections} />
          <Button className={classes.addNewButton} variant="contained" color="primary" onClick={handleAddNewAlbum}>
            Add New +
          </Button>
        </Container>
        <Container className={classes.cardGrid}>
          <InfinitScroll
              dataLength={total}
              next={() => handleNextPage()}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              style={{ overflow: 'inherit' }}
            >
              <Grid container spacing={3}>
                {
                  showAlbumCards
                }
              </Grid>
            </InfinitScroll>
        </Container>
      </div>
      {showAlbumDialog}
      {showDeleteDialog}
    </main>
  );
}

export default HomeView;
