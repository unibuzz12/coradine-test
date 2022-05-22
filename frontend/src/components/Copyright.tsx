import { ReactElement } from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

function Copyright() : ReactElement {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="">
        My Album
      </Link>
      {' '}
      {new Date().getFullYear()}
      .
    </Typography>
  )
}

export default Copyright;
