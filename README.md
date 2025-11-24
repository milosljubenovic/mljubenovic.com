# mljubenovic.com

Personal portfolio website built with Jekyll and Tailwind CSS, featuring blogs, project showcases, professional experience timeline, and skills overview.

## 🚀 Features

- **Blog**: Articles on web development, tutorials, and technical insights with SEO optimization, tag filtering, and social sharing
- **Projects**: Portfolio showcase with detailed case studies, tech stacks, and live demos
- **Experience**: Professional timeline with detailed role descriptions and achievements
- **Skills**: Comprehensive technology proficiency overview with visual indicators
- **Dark Mode**: Seamless theme switching with user preference persistence
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **SEO Optimized**: jekyll-seo-tag integration for better search visibility
- **GitHub Pages Ready**: Automated deployment via GitHub Actions

## 🛠️ Tech Stack

- **Jekyll**: Static site generator
- **Tailwind CSS**: Utility-first CSS framework with JIT mode
- **GitHub Pages**: Hosting and deployment
- **GitHub Actions**: CI/CD pipeline for automated builds

## 📋 Prerequisites

- Ruby 3.x
- Node.js 18.x
- Bundler
- npm

## 🏗️ Installation

1. Clone the repository:
```bash
git clone https://github.com/milosljubenovic/mljubenovic.com.git
cd mljubenovic.com
```

2. Install Ruby dependencies:
```bash
bundle install
```

3. Install Node dependencies:
```bash
npm install
```

4. Build Tailwind CSS:
```bash
npm run build
```

## 🎨 Development

Run the Jekyll development server:
```bash
bundle exec jekyll serve
```

In a separate terminal, run Tailwind in watch mode:
```bash
npm run dev
```

Visit `http://localhost:4000` to view your site.

## 📝 Content Management

### Adding Blog Posts

Create a new markdown file in `_posts/` with the format: `YYYY-MM-DD-title.md`

```markdown
---
layout: post
title: "Your Post Title"
date: YYYY-MM-DD
author: Your Name
tags: [tag1, tag2, tag3]
categories: [Category]
excerpt: "Brief description for SEO and previews"
image: /assets/images/posts/your-image.jpg
---

Your content here...
```

### Adding Projects

Create a new markdown file in `_projects/`:

```markdown
---
layout: project-item
title: "Project Name"
description: "Brief description"
date: YYYY-MM-DD
featured: true
demo_url: https://demo.example.com
github_url: https://github.com/username/repo
images:
  - /assets/images/projects/project-1.jpg
tech_stack: [React, Node.js, MongoDB]
features:
  - Feature 1
  - Feature 2
---

Detailed project description...
```

### Adding Experience

Create a new markdown file in `_experience/`:

```markdown
---
layout: experience-item
title: Job Title
role: Your Role
company: Company Name
date_start: YYYY-MM-DD
date_end: YYYY-MM-DD  # Omit for current position
logo: /assets/images/companies/logo.png
technologies: [Tech1, Tech2, Tech3]
---

Job description and achievements...
```

### Updating Skills

Edit `_data/skills.yml`:

```yaml
- category: Category Name
  items:
    - name: Skill Name
      proficiency: 90
      icon: 🚀
```

## 🎨 Customization

### Site Configuration

Edit `_config.yml` to update:
- Site title and description
- Social media links
- Email address
- URL and base URL

### Navigation

Modify `_data/navigation.yml` to add/remove menu items.

### Social Links

Update `_data/social.yml` to customize footer social links.

### Styling

Tailwind configuration is in `tailwind.config.js`. Customize:
- Color palette
- Typography
- Breakpoints
- Dark mode strategy

Custom styles can be added to `assets/css/main.css`.

## 🚀 Deployment

### GitHub Pages

The site automatically deploys to GitHub Pages when you push to the `main` branch.

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to `main` branch

The GitHub Actions workflow (`.github/workflows/jekyll.yml`) handles:
- Installing dependencies
- Building Tailwind CSS
- Building Jekyll site
- Deploying to GitHub Pages

## 📁 Project Structure

```
mljubenovic.com/
├── _data/              # Data files (navigation, social, skills)
├── _experience/        # Experience collection markdown files
├── _includes/          # Reusable components (nav, footer, etc.)
├── _layouts/           # Page layouts
├── _posts/             # Blog posts
├── _projects/          # Project collection markdown files
├── assets/
│   ├── css/           # Tailwind CSS source
│   └── images/        # Images and media
├── _config.yml        # Jekyll configuration
├── Gemfile            # Ruby dependencies
├── package.json       # Node dependencies
├── tailwind.config.js # Tailwind configuration
└── *.html             # Main pages (index, blog, etc.)
```

## 🤝 Contributing

This is a personal portfolio, but suggestions and bug reports are welcome! Please open an issue to discuss proposed changes.

## 📄 License

MIT License - feel free to use this template for your own portfolio!

## 🙏 Acknowledgments

- Design inspired by [clearmoon.llc](https://clearmoon.llc)
- Built with [Jekyll](https://jekyllrb.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Hosted on [GitHub Pages](https://pages.github.com/)

## 📧 Contact

Milos Ljubenovic - [GitHub](https://github.com/milosljubenovic)

Project Link: [https://github.com/milosljubenovic/mljubenovic.com](https://github.com/milosljubenovic/mljubenovic.com)
