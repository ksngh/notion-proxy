# Notion Proxy for ChatGPT GPTs

This is a simple Vercel-compatible API that lets you send content from GPT directly to your Notion database.

## ✅ Steps to Deploy

1. Go to [https://vercel.com](https://vercel.com) and sign in.
2. Click "New Project" and import or upload this folder.
3. Set the environment variable `NOTION_SECRET` with your Notion integration token.
4. After deploying, copy the URL (e.g., https://yourname.vercel.app/api/notion).
5. Use this URL in your ChatGPT custom GPT "Actions" as an endpoint.

## 🔐 Environment Variables

- `NOTION_SECRET` = your Notion integration token (starts with `ntn_...`)

## ✅ Input to API

- `title` (string): Page title
- `content` (string): Content for the body
- `database_id` (string): ID of the Notion database to create the page in
#   n o t i o n - p r o x y  
 