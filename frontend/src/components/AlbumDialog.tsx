import { useMemo, useCallback, useState, useEffect, ReactElement  } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Form } from 'react-bootstrap';
import AlbumSelectFilter from './AlbumSelectFilter';
import { useSelector } from 'react-redux';
import { IRootState } from '../redux/store';
import ReactS3Client from 'react-aws-s3-typescript';
import { awsconfig } from '../config/awsconfig';
import Notification from '../components/Notification';
import useAlbum from '../hooks/useAlbum';

interface IAlbumDialog {
    isOpen: boolean;
    isEdit: boolean;
    id?: string;
    name?: string;
    image?: string;
    collection_id?: string;
    description?: string;
    onSaveNewAlbum: () => void;
    onUpdateAlbum: () => void;
    onCloseAlbumDialog: () => void;
}

function AlbumDialog(props: IAlbumDialog) : ReactElement {
    const { collections } = useSelector((state: IRootState) => state.collection);
    const [collection, setCollection] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');

    const { createAlbum, updateAlbum } = useAlbum();

    const showDialogTitle = useMemo(() => (
        <DialogTitle id="form-dialog-title">{ props.isEdit? 'Edit Album': 'New Album' }</DialogTitle>
    ), [props.isEdit]);

    useEffect(() => {
        if(props.isEdit) {
            props.collection_id && setCollection(props.collection_id);
            props.name && setName(props.name);
            props.description && setDescription(props.description);
            props.image && setImage(props.image);
        }
    }, [props])

    const initializeState = useCallback(() => {
        setCollection('');
        setName('');
        setDescription('');
        setImage('');
    }, []);

    const handleCollectionFilter = useCallback((event) => {
        setCollection(event.target.value);
    }, []);

    const handleUploadImage = useCallback(async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        const filename = Date.now() + "-aws-img";
        const s3 = new ReactS3Client(awsconfig);
        try {
            const data = await s3.uploadFile(file, filename);
            setImage(data.location);
        } catch (err) {
            Notification("warning", (err as Error).message);
        }
    }, []);

    const handleNameChange = useCallback((event) => {
        setName(event.target.value);
    }, []);

    const handleDescriptionChange = useCallback((event) => {
        setDescription(event.target.value);
    }, []);

    const handleUpdateAlbum = useCallback(async () => {
        try {
            props.isEdit && props.id && await updateAlbum({
                id: props.id,
                collection_id: collection,
                name: name,
                image: image,
                description: description
            });

            Notification('success', 'Update album success!');
            initializeState();
            props.onUpdateAlbum();
        } catch (err) {
            Notification("warning", (err as Error).message);
        }
    }, [collection, name, image, description, props]);

    const handleSaveNewAlbum = useCallback(async () => {
        try {
            await createAlbum({
                collection_id: collection,
                name: name,
                image: image,
                description: description
            });

            Notification('success', 'Save new album success!');
            initializeState();
            props.onSaveNewAlbum();
        } catch (err) {
            Notification("warning", (err as Error).message);
        }
    }, [collection, name, image, description]);

    const handleCloseAlbum = useCallback(() => {
        initializeState();
        props.onCloseAlbumDialog();
    }, [])

    return (
        <Dialog open={props.isOpen} onClose={props.onCloseAlbumDialog} aria-labelledby="form-dialog-title">
            {showDialogTitle}
            <DialogContent>
                <AlbumSelectFilter
                    value={collection}
                    handleChange={handleCollectionFilter}
                    datas={collections} />
                <br />
                <Form.Label>Image</Form.Label>
                <Form.File
                    className='custom-upload-button'
                    id='image-file'
                    custom
                    onChange={handleUploadImage}/>
                <TextField
                    autoFocus
                    margin="dense"
                    id="image"
                    label="Image URL"
                    type="text"
                    fullWidth
                    value={image}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Album Title"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={handleNameChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="content"
                    label="Album Content"
                    type="text"
                    fullWidth
                    value={description}
                    onChange={handleDescriptionChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseAlbum} color="primary">
                    Cancel
                </Button>
                <Button onClick={props.isEdit? handleUpdateAlbum : handleSaveNewAlbum } color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlbumDialog;