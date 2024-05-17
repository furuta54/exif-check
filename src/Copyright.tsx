import React from 'react'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

type Props = {
  className?: string
}

const Copyright: React.FC<Props> = (props) => {
  return (
    <div className={props.className}>
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copylight © '}
        <Link color="inherit" href="https://untitled-note.com">
          Untitled Note
        </Link>{' '}
        {new Date().getFullYear()}.
      </Typography>
    </div>
  )
}

export default Copyright
