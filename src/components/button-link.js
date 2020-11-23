/** @jsx jsx */
import {jsx} from 'theme-ui'
import {Link} from 'gatsby'

export function ButtonLink({to, children}) {
  return (
    <Link
      to={to}
      sx={{
        display: 'inline-block',
        color: 'muted',
        backgroundColor: 'primary',
        py: 2,
        px: 3, 
        fontSize: 2,
        fontWeight: 'heading',
        cursor: 'pointer',
        textDecoration: 'none',
        lineHeight: 'body',
        // letterSpacing: '1px',
        // textTransform: 'uppercase'
      }}
    >
      {children}
    </Link>
  )
}
