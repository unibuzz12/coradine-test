import { useCallback, ReactElement } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import useAlbum from '../hooks/useAlbum';
import Notification from '../components/Notification';

interface IDeleteDialog {
  isOpen: boolean;
  album_id: string;
  onCloseDeleteDialog: () => void;
  onDeleteSuccess: () => void;
}

function DeleteDialog(props: IDeleteDialog) : ReactElement {

  const { deleteAlbum } = useAlbum();

  const handleDeleteAlbum = useCallback(async () => {
    try {
      await deleteAlbum({
          album_id: props.album_id
      });

      Notification('success', 'Delete album success!');
      props.onDeleteSuccess();
    } catch (err) {
      Notification("warning", (err as Error).message);
    }
  }, [props]);

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onCloseDeleteDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete confirm</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this item?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCloseDeleteDialog} color="primary">
          Disagree
        </Button>
        <Button onClick={handleDeleteAlbum} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
