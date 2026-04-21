import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { getFiles, normalizeCategory } from './mdx'
import kebabCase from './utils/kebabCase'

const root = process.cwd()

export async function getAllCategories(type) {
  // this is where the categories should be cleaned and structured.
  const files = await getFiles(type)

  const categoriesPosts = {}
  files.forEach((file) => {
    const source = fs.readFileSync(path.join(root, 'data', type, file), 'utf8')
    const { data } = matter(source)

    data.category = normalizeCategory(data.category)

    if (data.category && data.draft !== true) {
      data.category.forEach((category) => {
        const formattedCategory = String(category).replace(',', '').toLowerCase().replace(' ', '')
        if (formattedCategory in categoriesPosts) {
          categoriesPosts[formattedCategory].push(file)
        } else {
          categoriesPosts[formattedCategory] = [file]
        }
      })
    }
  })

  return categoriesPosts
}
