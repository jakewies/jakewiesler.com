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
        mt: '24px',
        '&:first-of-type': {
          mt: '0',
        },
      }}
    >
      <Link
        to={slug}
        sx={{
          fontWeight: '600',
          fontSize: '24px',
          margin: '0',
          color: '#000',
          textDecoration: 'none',
        }}
      >
        {title}
      </Link>
      <time>{date}</time>
    </div>
  )
}

PostLink.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
}
