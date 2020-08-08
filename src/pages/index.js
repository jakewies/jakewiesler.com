/** @jsx jsx */
import {jsx} from 'theme-ui'
import {Link} from 'gatsby'
import Layout from 'components/layout'
import Seo from 'components/seo'

export default function IndexPage() {
  return (
    <Layout showFooter={false}>
      <Seo
        title="Jake Wiesler"
        description="Front-end developer exploring human movement."
      />
      <section>
        <p sx={{m: 0, fontSize: 3, color: 'text'}}>
          Front-end developer based in Orlando FL
        </p>
        <p sx={{m: 0, fontSize: 3, color: 'text'}}>Exploring human movement</p>
      </section>
      <nav sx={{display: 'inline-flex', flexDirection: 'column', pt: 4}}>
        <Link sx={linkStyles} to="/blog">
          /Blog
        </Link>
        <Link sx={linkStyles} to="/mail">
          /mail
        </Link>
        <Link sx={linkStyles} to="/now">
          /now
        </Link>
        <Link sx={linkStyles} to="/contact">
          /contact
        </Link>
        <a href="https://github.com/jakewies" sx={linkStyles}>
          /GitHub
        </a>
        <a href="https://twitter.com/jakewies" sx={linkStyles}>
          /Twitter
        </a>
      </nav>
    </Layout>
  )
}

const linkStyles = {
  textDecoration: 'none',
  color: 'primary',
  fontFamily: 'menlo, monospace',
  fontSize: 2,
  fontWeight: 'body',
  textTransform: 'lowercase',
  mb: 3,
}
