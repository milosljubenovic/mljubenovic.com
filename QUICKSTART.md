# Quick Start Guide

## ✅ What's Been Set Up

Your Jekyll portfolio is now initialized with:

### 📁 Structure
- ✅ Jekyll configuration (`_config.yml`)
- ✅ Tailwind CSS setup with dark mode
- ✅ Responsive layouts and components
- ✅ GitHub Actions workflow for deployment
- ✅ Sample content (3 blog posts, 4 projects, 3 experience entries)

### 🎨 Pages Created
- Home page (index.html)
- Blog listing with tag filtering (blog.html)
- Projects showcase (projects.html)
- Experience timeline (experience.html)
- Skills overview (skills.html)
- About page (about.html)
- 404 page

### 🛠️ Features Included
- Dark/light mode toggle
- SEO optimization (jekyll-seo-tag)
- RSS feed (jekyll-feed)
- Sitemap (jekyll-sitemap)
- Responsive navigation
- Social media links
- Tag-based blog filtering
- Reading time calculation
- Social sharing buttons

## 🚀 Next Steps

### 1. Install Node.js (if not already installed)
The dev container doesn't have Node.js by default. You'll need it to build Tailwind CSS.

Options:
- Install Node.js in the container: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
- Or work locally with Node.js installed

### 2. Complete Setup
Once Node.js is available, run:
```bash
./setup.sh
```

Or manually:
```bash
npm install
npm install -D @tailwindcss/typography
npm run build
```

### 3. Start Development
```bash
# Terminal 1: Jekyll server
bundle exec jekyll serve

# Terminal 2: Tailwind watch mode
npm run dev
```

Visit: http://localhost:4000

## ✏️ Customization

### Update Site Information
Edit `_config.yml`:
- Change site title and description
- Update your email and social media handles
- Modify the base URL for your domain

### Customize Colors
Edit `tailwind.config.js` to match your brand colors.

### Add Your Content

**Blog Posts** (`_posts/YYYY-MM-DD-title.md`):
```markdown
---
layout: post
title: "Your Title"
date: 2024-11-24
tags: [tag1, tag2]
excerpt: "Description"
---
```

**Projects** (`_projects/project-name.md`):
```markdown
---
layout: project-item
title: "Project Name"
featured: true
demo_url: https://...
github_url: https://...
tech_stack: [React, Node.js]
---
```

**Experience** (`_experience/YYYY-company.md`):
```markdown
---
layout: experience-item
role: "Your Role"
company: "Company Name"
date_start: 2024-01-01
technologies: [Tech1, Tech2]
---
```

**Skills** (`_data/skills.yml`):
```yaml
- category: Languages
  items:
    - name: JavaScript
      proficiency: 90
      icon: 📜
```

### Update Navigation
Edit `_data/navigation.yml` to add/remove menu items.

### Update Social Links
Edit `_data/social.yml` with your actual profiles.

## 🚀 Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Set Source to "GitHub Actions"
4. Push to `main` branch

The site will automatically build and deploy!

## 📝 Notes

- Sample images referenced in content don't exist yet. Add your own images to `assets/images/`
- Update the about page with your actual bio
- Replace placeholder URLs with real ones
- The theme is inspired by clearmoon.llc with clean, professional styling
- Dark mode preference is saved in localStorage

## 🎨 Design Philosophy

The site follows these principles:
- **Clean**: Minimal, focused design
- **Professional**: Business-appropriate styling
- **Responsive**: Mobile-first approach
- **Accessible**: Semantic HTML, keyboard navigation
- **Fast**: Optimized for performance

## 🆘 Troubleshooting

**Tailwind classes not working?**
- Make sure you've run `npm run build`
- Check that `assets/css/styles.css` exists

**Jekyll not finding collections?**
- Verify files are in correct folders (_posts, _projects, _experience)
- Check frontmatter YAML is valid

**Dark mode not working?**
- Ensure JavaScript is enabled
- Check browser console for errors

## 📚 Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

Enjoy building your portfolio! 🎉
