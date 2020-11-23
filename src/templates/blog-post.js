/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import { graphql, Link } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import slugify from '@sindresorhus/slugify'
import { AiOutlineTwitter } from 'react-icons/ai'
import { TwitterShareButton } from 'react-share'
import { Layout } from 'components/layout'
import Seo from 'components/seo'

export default function BlogPostTemplate({ data }) {
  const { body, excerpt, fields, frontmatter } = data.mdx
  const { title, date, slug, tags } = fields
  const description = frontmatter.description || excerpt
  const { siteUrl } = data.site.siteMetadata

  return (
    <Layout>
      <Seo title={title} description={description} pageUrl={slug} isBlogPost />
      <article
        sx={{
          borderBottom: '1px solid',
          borderColor: 'lightgray',
          pb: 4,
        }}
      >
        <header>
          <Styled.h1>{title}</Styled.h1>
          <time
            dateTime={date}
            sx={{
              color: 'lightgray',
              display: 'inline-block',
              fontSize: 2,
            }}
          >
            {date}
          </time>
        </header>
        <MDXRenderer>{body}</MDXRenderer>
      </article>
      <section
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: 3,
        }}
      >
        <Tags tags={tags} />
        <Share
          title={title}
          url={`${siteUrl}${slug}`}
          twitterHandle="jakewies"
        />
      </section>
      <section
        sx={{
          mt: 5,
          px: [4, 5],
          py: 4,
          bg: 'muted',
          color: 'text',
          borderRadius: 4,
        }}
      >
        <AboutMeCTA />
      </section>
    </Layout>
  )
}

export const query = graphql`
  query($id: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    mdx(fields: { id: { eq: $id } }) {
      excerpt
      frontmatter {
        description
      }
      fields {
        title
        date(formatString: "MMMM Do, YYYY")
        slug
        tags
      }
      body
    }
  }
`

function Tags({ tags }) {
  return (
    <div sx={{ display: 'flex', flexDirection: 'column' }}>
      <span
        sx={{
          color: 'lightgray',
          display: 'inline-block',
          fontSize: 0,
        }}
      >
        Tagged with:
      </span>
      <div>
        {tags.map((tag, i) => (
          <Link
            key={tag}
            to={`/tags/${slugify(tag)}`}
            sx={{
              textDecoration: 'none',
              color: 'primary',
              fontSize: 1,
              border: '1px solid',
              borderColor: 'primary',
              borderRadius: 4,
              p: '4px 8px',
              mr: 2,
            }}
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  )
}

function Share({ title, url, twitterHandle }) {
  return (
    <div
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
    >
      <span
        sx={{
          color: 'lightgray',
          display: 'inline-block',
          fontSize: 0,
        }}
      >
        Share on:
      </span>
      <div>
        <TwitterShareButton
          url={url}
          title={title}
          via={twitterHandle}
          sx={{
            '&:focus': { outline: 'none' },
          }}
        >
          <AiOutlineTwitter
            sx={{
              fontSize: 4,
              '&:hover': {
                color: 'primary',
              },
            }}
          />
        </TwitterShareButton>
      </div>
    </div>
  )
}

function AboutMeCTA() {
  return (
    <div
      sx={{
        display: 'flex',
        flexDirection: ['column', 'row'],
        alignItems: 'center',
      }}
    >
      <div sx={{ mr: [0, 4], mb: [3, 0] }}>
        <img
          src="/avatar.jpg"
          alt="Avatar"
          sx={{
            width: 100,
            height: 100,
            borderRadius: '100%',
          }}
        />
      </div>
      <div sx={{ textAlign: ['center', 'initial'] }}>
        <Styled.h3 sx={{ mt: 0 }}>
          Hey, I'm Jake!
          <span
            sx={{ display: 'inline-block', pl: 2 }}
            role="img"
            aria-label="Wave"
          >
            👋
          </span>
        </Styled.h3>
        <Styled.p sx={{ mt: 2, fontSize: 2, lineHeight: '27px' }}>
          I write about coding, the creative pursuit and becoming a better
          human.{' '}
          <Link to="/blog" sx={{ color: 'primary' }}>
            Check out the blog
          </Link>{' '}
          for more of my words and sentences.
        </Styled.p>
      </div>
    </div>
  )
}
