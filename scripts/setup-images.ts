import fs from 'fs'
import path from 'path'

const directories = [
  'public/images',
  'public/images/benefits',
  'public/images/menu',
  'public/images/about',
  'public/images/social'
]

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`Created directory: ${dir}`)
  }
})

// Create a .gitkeep file in each directory to ensure they're tracked by git
directories.forEach(dir => {
  const gitkeepPath = path.join(dir, '.gitkeep')
  if (!fs.existsSync(gitkeepPath)) {
    fs.writeFileSync(gitkeepPath, '')
    console.log(`Created .gitkeep in: ${dir}`)
  }
}) 