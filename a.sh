git remote set-url origin ~

git pull origin main
git add .

if ! git diff --staged --quiet; then
  git commit -am "ad"

  for i in {1..5}; do
    git pull --rebase origin main || continue
    git push origin main && break
    echo "Retrying push ($i)..."
    sleep 5
  done
else
  echo ""
fi