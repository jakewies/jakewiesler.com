/** @jsx jsx */
import {jsx} from 'theme-ui'
import {Link} from 'gatsby'
import PropTypes from 'prop-types'

export function PostLink({date, slug, title}) {
  return (
    <div
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 4,
        '&:first-of-type': {
          mt: 0,
        },
      }}
    >
      <Link
        to={slug}
        sx={{
          fontWeight: 'bold',
          fontSize: 4,
          m: 0,
          color: 'text',
          textDecoration: 'none',
        }}
      >
        {title}
      </Link>
      <time sx={{ color: 'gray'}}>{date}</time>
    </div>
  )
}

PostLink.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
}
