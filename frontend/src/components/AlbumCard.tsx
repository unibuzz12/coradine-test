import { useCallback, ReactElement } from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({

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
    wordBreak: 'break-word'
  },
  deleteIcon: {
    marginLeft: 'auto!important',
    marginRight: 0,
  }
}));

interface IAlbumCard {
  header: string;
  content: string;
  image: string;
  albumIndex: number;
  onEditAlbum: (albumIndex: number) => void;
  onDeleteAlbum: (albumIndex: number) => void;
}

function AlbumCard (props: IAlbumCard) : ReactElement {

  const classes = useStyles();

  const handleOnDelete = useCallback(() => {
    props.onDeleteAlbum(props.albumIndex);
  }, [props]);

  const handleOnEdit = useCallback(() => {
    props.onEditAlbum(props.albumIndex);
  }, [props]);

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.cardMedia}
        image={props.image}
        title="Image title"
      />
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom variant="h5" component="h2">
          {props.header}
        </Typography>
        <Typography>
          {props.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handleOnEdit}>
          Edit
        </Button>
        <Button size="small" color="primary" className={classes.deleteIcon} onClick={handleOnDelete}><DeleteIcon color="primary" /></Button>
      </CardActions>
    </Card>
  );
}

export default AlbumCard;
