# Customization Guide

This guide will help you personalize your portfolio website.

## 🎨 Branding & Colors

### Update Site Colors
Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your primary brand color
        500: '#YOUR_COLOR',
        600: '#YOUR_COLOR',
        700: '#YOUR_COLOR',
      },
      secondary: {
        // Your secondary/accent color
        500: '#YOUR_COLOR',
        600: '#YOUR_COLOR',
      }
    }
  }
}
```

**Tip**: Use a tool like [ColorBox](https://colorbox.io/) to generate color palettes.

### Update Typography
Change fonts in `_includes/head.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@300;400;600&display=swap" rel="stylesheet">
```

Then update `tailwind.config.js`:

```javascript
fontFamily: {
  sans: ['Your Font', 'system-ui', 'sans-serif'],
}
```

## 📝 Content

### Site Information
`_config.yml`:
```yaml
title: Your Name
email: your-email@example.com
description: >-
  Your professional tagline or brief bio
url: "https://yourdomain.com"
twitter_username: your_twitter
github_username: your_github
```

### Navigation Menu
`_data/navigation.yml`:
```yaml
- name: Home
  url: /
- name: Blog
  url: /blog
# Add/remove items as needed
```

### Social Links
`_data/social.yml`:
```yaml
- name: GitHub
  url: https://github.com/yourusername
  icon: github
- name: LinkedIn
  url: https://linkedin.com/in/yourprofile
  icon: linkedin
```

### Homepage Hero
Edit `index.html`, find the hero section and update:
```html
<h1>Hi, I'm {{ site.title }} 👋</h1>
<p>{{ site.description }}</p>
```

### About Page
Edit `about.html` with your actual biography, skills, and contact information.

## 🖼️ Images

### Add Your Photos
Place images in `assets/images/`:
```
assets/images/
├── profile.jpg          # Your headshot
├── companies/           # Company logos
│   ├── company1.png
│   └── company2.png
├── projects/            # Project screenshots
│   ├── project1-1.jpg
│   └── project1-2.jpg
└── posts/               # Blog post images
    └── post-hero.jpg
```

### Update Profile Picture
In `about.html`, replace the placeholder:
```html
<img src="{{ '/assets/images/profile.jpg' | relative_url }}" 
     alt="Your Name"
     class="w-48 h-48 rounded-full object-cover">
```

### Add Favicon
Place `favicon.ico` in `assets/images/` or update the path in `_includes/head.html`.

## ✍️ Content Creation

### Write a Blog Post
Create `_posts/YYYY-MM-DD-your-post-title.md`:

```markdown
---
layout: post
title: "Your Amazing Post Title"
date: 2024-11-24
author: Your Name
tags: [JavaScript, React, Tutorial]
categories: [Web Development]
excerpt: "A compelling description for SEO and previews"
image: /assets/images/posts/your-image.jpg
---

## Introduction

Your content here...

### Subheading

More content...

```markdown code blocks```
```

### Add a Project
Create `_projects/project-name.md`:

```markdown
---
layout: project-item
title: "Awesome Project"
description: "What it does and why it matters"
date: 2024-11-24
featured: true  # Shows on homepage
demo_url: https://demo.example.com
github_url: https://github.com/you/project
images:
  - /assets/images/projects/project-1.jpg
  - /assets/images/projects/project-2.jpg
tech_stack: [React, Node.js, PostgreSQL, Docker]
features:
  - Real-time collaboration
  - REST API
  - Responsive design
---

## Detailed Description

Tell the story of your project...

### The Problem
What problem were you solving?

### The Solution
How did you solve it?

### Technical Highlights
What are you proud of?
```

### Add Experience
Create `_experience/YYYY-company-name.md`:

```markdown
---
layout: experience-item
title: Senior Developer
role: Senior Developer
company: Tech Company Inc.
date_start: 2022-01-01
date_end: 2024-06-30  # Omit for current position
logo: /assets/images/companies/company-logo.png
technologies: [React, Python, AWS, Docker]
---

Brief overview of your role and responsibilities.

## Key Achievements

- Increased performance by 50%
- Led team of 5 developers
- Launched 3 major features

## Technical Challenges

Describe interesting problems you solved...
```

### Update Skills
Edit `_data/skills.yml`:

```yaml
- category: Languages
  items:
    - name: JavaScript
      proficiency: 95  # 0-100
      icon: 📜  # Emoji or leave empty
    - name: Python
      proficiency: 85
      icon: 🐍

- category: Frameworks
  items:
    - name: React
      proficiency: 90
      icon: ⚛️
```

## 🎯 SEO Optimization

### Page Titles & Descriptions
Each page can have custom SEO meta in frontmatter:

```yaml
---
layout: page
title: About Me
permalink: /about/
description: "Learn about my background and expertise"
---
```

### Blog Post SEO
Always include:
- Descriptive title
- Excerpt (description)
- Relevant tags
- Featured image (og:image)

### Sitemap
Automatically generated at `/sitemap.xml`

### RSS Feed
Automatically generated at `/feed.xml`

## 🌓 Dark Mode

### Customize Dark Mode Colors
Dark mode uses `dark:` variants in Tailwind. Update in your HTML or CSS:

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

### Change Default Mode
Edit `_includes/head.html` to change default behavior:

```javascript
// Force dark mode by default
document.documentElement.classList.add('dark')

// Or force light mode
document.documentElement.classList.remove('dark')
```

## 📱 Responsive Breakpoints

Tailwind breakpoints:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

Example:
```html
<div class="text-base md:text-lg lg:text-xl">
  Responsive text size
</div>
```

## 🔧 Advanced Customization

### Add New Pages
1. Create `your-page.html` in the root
2. Add frontmatter:
```yaml
---
layout: page
title: Your Page
permalink: /your-page/
---
```
3. Add to navigation in `_data/navigation.yml`

### Add New Sections to Homepage
Edit `index.html` and add sections following the existing pattern.

### Custom Components
Create new includes in `_includes/` and use them:
```liquid
{% raw %}{% include your-component.html %}{% endraw %}
```

### Custom CSS
Add custom styles to `assets/css/main.css` using Tailwind's `@layer` directive:

```css
@layer components {
  .your-custom-class {
    @apply px-4 py-2 bg-blue-500 text-white;
  }
}
```

## 🚀 Performance Tips

1. **Optimize Images**: Use WebP format, compress images
2. **Minimize CSS**: Tailwind's purge automatically removes unused styles
3. **Lazy Load**: Images use `loading="lazy"` attribute
4. **CDN**: GitHub Pages uses a global CDN
5. **Minify**: Jekyll minifies HTML in production

## 📊 Analytics (Optional)

To add Google Analytics, edit `_includes/head.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🎓 Learning Resources

- **Jekyll**: https://jekyllrb.com/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Markdown**: https://www.markdownguide.org/
- **Liquid**: https://shopify.github.io/liquid/

---

Need help? Check the [README.md](README.md) or [QUICKSTART.md](QUICKSTART.md) for more information!
