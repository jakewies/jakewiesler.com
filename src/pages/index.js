/** @jsx jsx */
import { jsx } from 'theme-ui'
import { graphql } from 'gatsby'
import Image from 'gatsby-image'
import { ButtonLink } from 'components/button-link'
import { Layout } from 'components/layout'
import { PostLink } from 'components/post-link'
import { Seo } from 'components/seo'
import { TextLink } from 'components/text-link'

export default function IndexPage({ data }) {
  const { avatar, latestPosts } = data
  return (
    <Layout>
      <Seo
        title="Jake Wiesler"
        description="Front-end developer exploring human movement."
      />
      <JumbotronSection avatar={avatar} />
      <LatestPostsSection latestPosts={latestPosts} />
      <NewsletterSection />
    </Layout>
  )
}

const JumbotronSection = ({ avatar }) => (
  <section>
    <div
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div>
        <h1
          sx={{
            fontWeight: 'body',
            fontSize: 5,
            lineHeight: 'heading',
            m: 0,
          }}
        >
          Hello!{' '}
          <span role="img" aria-label="I wave at you">
            👋
          </span>
          . My name's <b>Jake</b>.
        </h1>
        <h2
          sx={{
            fontWeight: 'body',
            fontSize: 5, 
            lineHeight: 'heading',
            mt: 4,
          }}
        >
          I'm a Software Engineer with a deep interest in Health & Wellness.
        </h2>
      </div>
      <div>
        <Image
          title="Avatar"
          alt="Jake Wiesler's Avatar"
          fixed={avatar.childImageSharp.fixed}
        />
      </div>
    </div>
    <div>
      <ButtonLink to="/about">More About Me</ButtonLink>
    </div>
  </section>
)

const LatestPostsSection = ({ latestPosts }) => (
  <section sx={{ mt: 7 }}>
    <h3 sx={sectionTitleStyles}>Latest Posts</h3>
    <div sx={{ py: 5 }}>
      {latestPosts.edges.map(({ node: post }) => (
        <PostLink key={post.fields.id} {...post.fields} />
      ))}
    </div>
    <TextLink to="/blog">Browse All Posts</TextLink>
  </section>
)

const NewsletterSection = () => (
  <section
    sx={{
      mt: 7,
    }}
  >
    <h3 sx={sectionTitleStyles}>The Newsletter</h3>
    <p
      sx={{
        fontSize: 4,
        lineHeight: 'body',
        mt: 5,
      }}
    >
      A weekly email covering human movement, physical training and maintaing an
      active lifestyle as a programmer.
    </p>
    <div
      sx={{
        mt: 5,
      }}
    >
      <span sx={{ mr: 5 }}>
        <ButtonLink to="#">Subscribe</ButtonLink>
      </span>
      <TextLink to="#">Learn More</TextLink>
    </div>
  </section>
)

const sectionTitleStyles = {
  fontWeight: 'body',
  color: 'gray',
  letterSpacing: '2px',
  fontSize: 3,
  textTransform: 'uppercase',
  m: 0,
}

export const query = graphql`
  query {
    avatar: file(relativePath: { eq: "avatar.png" }) {
      childImageSharp {
        fixed(width: 250, height: 250) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    latestPosts: allMdx(
      limit: 5
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
