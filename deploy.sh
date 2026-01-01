#!/bin/bash

# 获取提交信息，如果没有提供，默认为 "Update project"
MSG="${1:-Update project}"

echo "🚀 Starting deployment..."

# 1. 添加所有更改
echo "📦 Adding changes..."
git add .

# 2. 提交更改
echo "📝 Committing with message: '$MSG'"
git commit -m "$MSG"

# 3. 推送到远程仓库 (GitHub)
echo "☁️  Pushing to GitHub (origin)..."
git push origin main

# (可选) 如果你也想推送到 Gitee 备份，可以取消下面这行的注释
# git push gitee main

echo "✅ Done! Deployment complete."
echo "🌍 Please wait 1-2 minutes for GitHub Pages to update."
