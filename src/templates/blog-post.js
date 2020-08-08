/** @jsx jsx */
import {jsx, Styled} from 'theme-ui'
import React from 'react'
import {graphql, Link} from 'gatsby'
import {MDXRenderer} from 'gatsby-plugin-mdx'
import PropTypes from 'prop-types'
import slugify from '@sindresorhus/slugify'
import {AiOutlineTwitter, AiOutlineClose} from 'react-icons/ai'
import {TwitterShareButton} from 'react-share'
import {useScrollPosition} from '@n8tb1t/use-scroll-position'
import Layout from 'components/layout'
import Seo from 'components/seo'
import NewsletterForm from 'components/newsletter-form'

export default function BlogPostTemplate({data}) {
  const {body, excerpt, fields, frontmatter} = data.mdx
  const {title, date, slug, tags} = fields
  const description = frontmatter.description || excerpt
  const {siteUrl, social} = data.site.siteMetadata

  const [showForHire, setShowForHire] = React.useState(false)

  useScrollPosition(
    ({prevPos, currPos}) => {
      const belowThreshold = currPos.y < -1500
      if (belowThreshold && !showForHire) {
        setShowForHire(true)
      }
    },
    [showForHire],
  )

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
          twitterHandle={social.twitter}
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
      <section
        sx={{
          mt: 4,
          px: [4, 5],
          py: 4,
          bg: 'highlight',
          color: 'text',
          borderRadius: 4,
        }}
      >
        <NewsletterCTA />
      </section>
      <ForHireCTA visible={showForHire} onClose={() => setShowForHire(false)} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query($id: String!) {
    site {
      siteMetadata {
        siteUrl
        social {
          twitter
        }
      }
    }
    mdx(fields: {id: {eq: $id}}) {
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

function Tags({tags}) {
  return (
    <div sx={{display: 'flex', flexDirection: 'column'}}>
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

Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
}

function Share({title, url, twitterHandle}) {
  return (
    <div
      sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}
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
            '&:focus': {outline: 'none'},
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

Share.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
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
      <div sx={{mr: [0, 4], mb: [3, 0]}}>
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
      <div sx={{textAlign: ['center', 'initial']}}>
        <Styled.h3 sx={{mt: 0}}>
          Hey, I'm Jake!
          <span
            sx={{display: 'inline-block', pl: 2}}
            role="img"
            aria-label="Wave"
          >
            👋
          </span>
        </Styled.h3>
        <Styled.p sx={{mt: 2, fontSize: 2, lineHeight: '27px'}}>
          I write about coding, the creative pursuit and becoming a better
          human.{' '}
          <Link to="/blog" sx={{color: 'primary'}}>
            Check out the blog
          </Link>{' '}
          for more of my words and sentences.
        </Styled.p>
      </div>
    </div>
  )
}

function NewsletterCTA() {
  const [showConfirmMessage, setShowConfirmMessage] = React.useState(false)

  if (showConfirmMessage) {
    return (
      <div sx={{textAlign: ['center', 'initial']}}>
        <Styled.h3 sx={{mt: 0}}>You're almost subscribed!</Styled.h3>
        <Styled.p sx={{mt: 2, fontSize: 2, lineHeight: '27px'}}>
          I sent you an email to confirm your address. Click it and you're in!
        </Styled.p>
      </div>
    )
  }

  return (
    <div sx={{textAlign: ['center', 'initial']}}>
      <Styled.h3 sx={{mt: 0}}>Looking for more?</Styled.h3>
      <Styled.p sx={{mt: 2, fontSize: 2, lineHeight: '27px'}}>
        Considering joining my private email list. No spam, ever. Even if
        there's a fire.
        <span
          sx={{display: 'inline-block', px: 1}}
          role="img"
          aria-label="Fire"
        >
          🔥
        </span>
      </Styled.p>
      <div sx={{mt: 3}}>
        <NewsletterForm
          onSubscribe={() => {
            setShowConfirmMessage(true)
          }}
        />
        <Styled.p sx={{fontSize: 0, color: 'primary', mt: 2}}>
          <Link to="/mail" sx={{fontSize: 0, color: 'primary', mt: 2}}>
            What's all this about?
          </Link>
        </Styled.p>
      </div>
    </div>
  )
}

function ForHireCTA({visible}) {
  const [show, setShow] = React.useState(undefined)

  React.useEffect(() => {
    if (visible) {
      setShow(true)
    }
  }, [visible])

  return (
    <div
      sx={{
        display: 'none',
        position: 'fixed',
        bottom: show ? 4 : '-400px',
        right: 4,
        backgroundColor: 'muted',
        p: 4,
        borderRadius: 4,
        transition: 'all 300ms ease-out',
        '@media screen and (min-width: 1330px)': {
          display: 'flex',
        },
      }}
    >
      <button
        sx={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          lineHeight: 1,
          color: 'gray',
          cursor: 'pointer',
          '&:hover': {
            color: 'text',
          },
          backgroundColor: 'transparent',
          fill: 'none',
          border: 'none',
        }}
        onClick={() => setShow(false)}
      >
        <AiOutlineClose />
      </button>
      <span sx={{pr: 3}} role="img" aria-label="rocketship">
        🚀
      </span>
      <div>
        <Styled.p
          sx={{fontWeight: 'heading', fontSize: 1, mt: 0, lineHeight: 1}}
        >
          I'm Available For Remote Work!
        </Styled.p>
        <Styled.a
          sx={{fontSize: 1}}
          href="mailto:jakewiesler@gmail.com?subject=Remote Work Inquiry"
        >
          Hire me
        </Styled.a>
      </div>
    </div>
  )
}
