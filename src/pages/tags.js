/** @jsx jsx */
import { jsx } from 'theme-ui'
import { graphql, Link } from 'gatsby'
import slugify from '@sindresorhus/slugify'
import { Layout } from 'components/layout'
import { Seo } from 'components/seo'

export default function TagsPage({ data }) {
  const tags = data.tags.group

  return (
    <Layout>
      <Seo
        title="Jake Wiesler"
        description="An index of all content by topic."
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
        Browse content by topic
      </h1>
      <section
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {tags.map(({ tag, totalCount }) => (
          <Tag key={tag} name={tag} />
        ))}
      </section>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    tags: allMdx {
      group(field: frontmatter___tags) {
        tag: fieldValue
        totalCount
      }
    }
  }
`

function Tag({ name }) {
  return (
    <div
      sx={{
        border: '1px solid',
        borderColor: 'primary',
        borderRadius: 4,
        fontSize: 1,
        display: 'flex',
        alignItems: 'center',
        p: '2px 8px',
        mr: 3,
        mb: 3,
      }}
    >
      <Link
        to={`/tags/${slugify(name)}`}
        sx={{ textDecoration: 'none', color: 'primary' }}
      >
        {name}
      </Link>
    </div>
  )
}
