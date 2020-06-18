const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const slugify = require("@sindresorhus/slugify")

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const { data, errors } = await graphql(`
    {
      blogPosts: allMdx(
        filter: { fileAbsolutePath: { regex: "//content/blog//" } }
      ) {
        edges {
          node {
            fields {
              id
              slug
            }
          }
        }
      }
      tags: allMdx {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
  `)

  if (errors) {
    throw errors
  }

  createBlogPostPages({
    data: data.blogPosts.edges,
    actions,
  })

  createTagPages({
    data: data.tags.group,
    actions,
  })
}

function createBlogPostPages({ data, actions }) {
  const { createPage } = actions

  if (!data.length) {
    throw new Error("There are no blog posts!")
  }

  data.forEach(({ node }, i) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/blog-post.js`),
      context: {
        id: node.fields.id,
      },
    })
  })
  return null
}

function createTagPages({ data, actions }) {
  const { createPage } = actions

  if (!data.length) {
    throw new Error("There are no tags!")
  }

  data.forEach((tag, i) => {
    createPage({
      path: `/tags/${slugify(tag.fieldValue)}`,
      component: path.resolve("./src/templates/tag.js"),
      context: {
        tag: tag.fieldValue,
      },
    })
  })
}

exports.onCreateNode = (...args) => {
  if (args[0].node.internal.type === `Mdx`) {
    onCreateMdxNode(...args)
  }
}

function onCreateMdxNode({ node, actions, getNode }) {
  const { createNodeField } = actions

  createNodeField({
    name: "id",
    node,
    value: node.id,
  })

  if (node.fileAbsolutePath.includes("content/blog/")) {
    createNodeField({
      name: "slug",
      node,
      value: `/blog${createFilePath({
        node,
        getNode,
        trailingSlash: false,
      })}`,
    })

    createNodeField({
      name: "title",
      node,
      value: node.frontmatter.title,
    })

    createNodeField({
      name: "date",
      node,
      value: node.frontmatter.date,
    })

    createNodeField({
      name: "tags",
      node,
      value: node.frontmatter.tags,
    })
  }
}
