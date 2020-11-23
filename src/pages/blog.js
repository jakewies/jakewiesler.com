/** @jsx jsx */
import { jsx } from 'theme-ui'
import { graphql } from 'gatsby'
import { Layout } from 'components/layout'
import { PostLink } from 'components/post-link'
import { Seo } from 'components/seo'

export default function BlogPage({ data }) {
  const posts = data.posts.edges

  return (
    <Layout>
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

export const query = graphql`
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
