# Bio-Free Service Report

## Host on GitHub Pages

This repository is configured to deploy the static site in `frontend/` to GitHub
Pages whenever a commit is pushed to `main`.

1. In the repository on GitHub, open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push your changes to `main`, then check the **Actions** tab for the deployment.
4. The site will be available at
   <https://donpeds17.github.io/biofree-service-report/>.

## Important: report storage

GitHub Pages hosts static files only. The form currently sends reports to
`/api/reports`, but this repository does not include that API or a database.
The page can be hosted, but saving and loading reports will not work until a
backend is deployed and the frontend is configured to use it.