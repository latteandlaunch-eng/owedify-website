# Owedify website

This folder is the full Owedify website, ready to commit to Git and deploy on
Cloudflare Pages. It contains the existing store site (preserved exactly as it
was) plus a new static blog under `blog/`.

There is no build step. Cloudflare Pages serves these files as-is. When you push
to the connected Git branch, Cloudflare Pages deploys automatically.

## Folder layout

- `index.html`, `About.html`, the legal pages, `kits/`, `credit/`, `assets/`,
  `tokens/`, and the rest: the existing store site.
- `_headers`: Cloudflare Pages headers file (kept exactly as it was).
- `blog/`: the new blog.
  - `index.html`: the blog landing page. It reads `posts.json` at runtime and
    renders a card for each post.
  - `posts.json`: the list of posts. Edit this to add or remove posts.
  - `welcome-to-the-owedify-blog.html`: the first published post.
  - `_post-template.html`: the starting point for any new post. Files that begin
    with an underscore are templates, not published posts. Do not list them in
    `posts.json`.

## How to publish a new blog post

1. Copy the template to a new file named after your post:

   ```
   cp blog/_post-template.html blog/your-post-slug.html
   ```

   Use a short, lowercase, hyphenated slug with no spaces, for example
   `dispute-a-medical-bill.html`.

2. Open the new file and edit every spot marked `EDIT` in the HTML comments:
   - the `<title>` and meta description
   - the `canonical` link (swap in your slug)
   - the Open Graph tags (`og:title`, `og:description`, `og:url`, `og:image`)
   - the Twitter card tags
   - the Pinterest `article:published_time` (ISO 8601, UTC)
   - the visible date and author line
   - the `<h1>` headline
   - the article body copy

3. Add an entry to `blog/posts.json`. It is a plain JSON array. Add one object
   for your post. Keep the existing entries. Example:

   ```json
   {
     "title": "How to dispute a medical bill",
     "slug": "dispute-a-medical-bill",
     "date": "2026-07-01",
     "excerpt": "A short, plain summary that shows on the blog card.",
     "image": "https://owedify.com/assets/logo/owedify-mark.svg",
     "url": "/blog/dispute-a-medical-bill.html"
   }
   ```

   - `date` is ISO format (`YYYY-MM-DD`). The landing page sorts newest first.
   - `url` is the path to your new post file.
   - `image` is the thumbnail on the card (see image notes below).

4. Commit and push:

   ```
   git add blog/your-post-slug.html blog/posts.json
   git commit -m "Add post: your post title"
   git push
   ```

   Cloudflare Pages picks up the push and deploys within a minute or two.

## Brand rules (keep these every time)

- No em dashes anywhere. Use commas, periods, or parentheses.
- Sentence case headings, not Title Case.
- Address the reader as "you". Plain, calm, trustworthy voice. No emoji.
- Owedify is a do-it-yourself tool. The kit helps you write your own letter.
  Never say "we file for you" or "done for you".
- Colors: navy `#22384F`, teal `#3C7E72`, light neutrals around `#F8FAFC`.
  No orange, nothing harsh.
- Fonts come from `/tokens/fonts.css`: Schibsted Grotesk (headings),
  Hanken Grotesk (body), IBM Plex Mono (labels and dates).

## Images and the R2 bucket

For now, every post and the blog cards use the Owedify logo as a placeholder
image:

```
https://owedify.com/assets/logo/owedify-mark.svg
```

Once the Cloudflare R2 bucket exists, upload a real image for each post and swap
the placeholder URL in two places:

1. In `posts.json`, change the `image` field for that post.
2. In the post HTML file, change `og:image` and `twitter:image` to the same URL.

R2 image URLs look like the bucket's public address, for example:

```
https://img.owedify.com/blog/dispute-a-medical-bill.jpg
```

Use the same full URL in `posts.json` and in the post's social meta tags so the
card thumbnail and the social preview match. Recommended share image size is
1200 by 630 pixels for clean Open Graph and Pinterest previews.
