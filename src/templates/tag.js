/** @jsx jsx */
import {jsx} from 'theme-ui'
import PropTypes from 'prop-types'
import {graphql, Link} from 'gatsby'
import Layout from 'components/layout'
import {PostLink} from 'components/post-link'
import Seo from 'components/seo'

export default function TagPage({pageContext, data}) {
  const {tag} = pageContext
  const {edges} = data.allMdx

  return (
    <Layout>
      <Seo
        title={`${tag} | Jake Wiesler`}
        description={`An index of content with the tag ${tag}.`}
        pageUrl="/tags"
      ></Seo>
      <h1
        sx={{
          fontSize: 3,
          fontWeight: 'body',
          lineHeight: 'heading',
          m: 0,
          mb: 4,
        }}
      >
        Posts tagged with{' '}
        <span sx={{fontWeight: 'bold', fontStyle: 'italic'}}>{tag}</span>
      </h1>
      {edges.map(({node}) => (
        <PostLink key={node.fields.id} {...node.fields} />
      ))}
      <Link to="/tags" sx={{color: 'primary', fontSize: 2}}>
        See All Tags
      </Link>
    </Layout>
  )
}

TagPage.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            fields: PropTypes.shape({
              id: PropTypes.string.isRequired,
              slug: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
              date: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired,
      ),
    }),
  }),
}

// this supports mdx content other than blog posts
// in the future i might want other content types that support
// tags.
export const pageQuery = graphql`
  query($tag: String) {
    allMdx(
      sort: {fields: [frontmatter___date], order: DESC}
      filter: {frontmatter: {tags: {in: [$tag]}}}
    ) {
      totalCount
      edges {
        node {
          fields {
            id
            slug
            title
            date(formatString: "MM-DD-YYYY")
          }
        }
      }
    }
  }
`
