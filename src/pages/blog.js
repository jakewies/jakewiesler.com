/** @jsx jsx */
import { jsx } from "theme-ui"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import Layout from "components/layout"
import PostLink from "components/post-link"
import Seo from "components/seo"

export default function BlogPage({ data }) {
  const posts = data.posts.edges

  return (
    <Layout breadcrumb="/blog">
      <Seo
        title="Blog | Jake Wiesler"
        description="An index of blog posts written by Jake Wiesler."
        pageUrl="/blog"
      ></Seo>
      {posts.map(({ node }) => (
        <PostLink key={node.fields.id} {...node.fields} />
      ))}
    </Layout>
  )
}

BlogPage.propTypes = {
  data: PropTypes.shape({
    posts: PropTypes.shape({
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
        }).isRequired
      ),
    }),
  }),
}

export const pageQuery = graphql`
  query {
    posts: allMdx(
      sort: { fields: frontmatter___date, order: DESC }
      filter: { fileAbsolutePath: { regex: "//content/blog//" } }
    ) {
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
