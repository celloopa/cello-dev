# CMS Content Model

## Goal

Define the structured content model for the future Payload-powered portfolio.

The CMS should support a product design portfolio, writing platform, visual archive, and project lab.

## Core Collections

### Pages

For flexible general pages.

Fields:

```txt
title
slug
summary
content
seoTitle
seoDescription
ogImage
publishedAt
_status
```

### Case Studies

For full product design case studies.

Fields:

```txt
title
slug
status
summary
heroImage
role
timeline
tools
skills
projectType
featured
problem
context
users
constraints
process
keyDecisions
systemThinking
prototype
outcomes
whatIWouldMeasure
reflection
videoUrl
prototypeUrl
repoUrl
relatedWriting
relatedLabProjects
seoTitle
seoDescription
ogImage
publishedAt
_status
```

### Lab Projects

For experiments, prototypes, and smaller technical explorations.

Fields:

```txt
title
slug
status
summary
description
tools
tags
coverImage
demoUrl
repoUrl
videoUrl
relatedCaseStudy
whatITested
whatILearned
publishedAt
_status
```

### Writing

For articles, process notes, and content.

Fields:

```txt
title
slug
excerpt
body
category
tags
relatedCaseStudy
relatedProject
coverImage
seoTitle
seoDescription
publishedAt
_status
```

### Visual Archive Items

For visual design, branding, packaging, photography, and campaign work.

Fields:

```txt
title
slug
summary
category
year
clientOrContext
role
tools
gallery
coverImage
description
behanceUrl
publishedAt
_status
```

### Videos

For YouTube and walkthrough content.

Fields:

```txt
title
slug
summary
youtubeUrl
thumbnail
transcript
relatedCaseStudy
relatedProject
tags
publishedAt
_status
```

### Projects

For broader project references that may connect case studies, lab work, videos, and writing.

Fields:

```txt
title
slug
summary
projectStatus
projectType
tools
tags
caseStudy
labEntries
writing
videos
repoUrl
demoUrl
publishedAt
_status
```

### Tags

Fields:

```txt
name
slug
description
```

### Tools

Fields:

```txt
name
slug
category
description
url
```

### Media

Used for images, videos, documents, and visual assets.

## Globals

### Site Settings

Fields:

```txt
siteName
siteDescription
baseUrl
defaultOgImage
contactEmail
socialLinks
```

### Navigation

Fields:

```txt
mainNav
footerNav
ctaLabel
ctaUrl
```

### Homepage

Fields:

```txt
heroHeadline
heroSubheadline
primaryCtaLabel
primaryCtaUrl
secondaryCtaLabel
secondaryCtaUrl
featuredCaseStudies
featuredLabProjects
featuredWriting
featuredVisualArchiveItems
```

### About Summary

Fields:

```txt
shortBio
longBio
currentFocus
skills
tools
resumeUrl
```

## Content Statuses

Use:

```txt
idea
draft
in-progress
review
published
archived
```

## Recommended Taxonomy

### Case Study Types

- Product Design
- Design Systems
- Technical Prototype
- Workflow Automation
- CMS/Admin Experience
- E-commerce
- Developer Tools
- Design Tools

### Lab Types

- Prototype
- Figma Experiment
- Payload Experiment
- React Component
- UX Pattern
- AI Workflow
- Automation
- CMS Workflow

### Visual Archive Categories

- Branding
- Packaging
- Print
- Campaign
- Photography
- Motion
- UI Exploration
