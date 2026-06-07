import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import matter from 'gray-matter'

const SITE_URL = process.env.SITE_URL
if (!SITE_URL) throw new Error('SITE_URL is not set — add it to your .env file')
const ROOT = resolve(process.cwd())

type ArticleMeta = {
  slug: string
  lastModified: string
}

function readArticlesFromDir(dir: string): Array<ArticleMeta> {
  const fullDir = join(ROOT, dir)
  let files: Array<string>
  try {
    files = readdirSync(fullDir).filter((f) => f.endsWith('.md'))
  } catch {
    console.warn(`Warning: directory not found: ${fullDir}`)
    return []
  }

  return files.flatMap((file) => {
    const raw = readFileSync(join(fullDir, file), 'utf-8')
    const { data } = matter(raw)
    if (data.draft) return []
    const slug = file.replace('.md', '')
    const lastModified: string = data.lastModified
      ? String(data.lastModified)
      : data.date
        ? String(data.date)
        : ''
    return [{ slug, lastModified }]
  })
}

function toW3CDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0]
  return new Date(dateStr).toISOString().split('T')[0]
}

function urlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string,
): string {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

const today = new Date().toISOString().split('T')[0]

const blogs = readArticlesFromDir('src/data/blogs')
const gears = readArticlesFromDir('src/data/gears')

const entries = [
  urlEntry(`${SITE_URL}/`, today, 'weekly', '1.0'),
  urlEntry(`${SITE_URL}/blog/`, today, 'weekly', '0.9'),
  urlEntry(`${SITE_URL}/about/`, today, 'monthly', '0.7'),
  ...blogs.map(({ slug, lastModified }) =>
    urlEntry(
      `${SITE_URL}/blog/${slug}`,
      toW3CDate(lastModified),
      'monthly',
      '0.8',
    ),
  ),
  ...gears.map(({ slug, lastModified }) =>
    urlEntry(
      `${SITE_URL}/blog/${slug}`,
      toW3CDate(lastModified),
      'monthly',
      '0.7',
    ),
  ),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`

const sitemapPath = join(ROOT, 'public/sitemap.xml')
writeFileSync(sitemapPath, sitemap, 'utf-8')
console.log(`✓ sitemap.xml generated — ${entries.length} URLs → ${sitemapPath}`)

const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:

Sitemap: ${SITE_URL}/sitemap.xml
`
const robotsPath = join(ROOT, 'public/robots.txt')
writeFileSync(robotsPath, robotsTxt, 'utf-8')
console.log(`✓ robots.txt generated → ${robotsPath}`)
