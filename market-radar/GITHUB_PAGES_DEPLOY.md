# GitHub Pages Deploy

Docker나 Synology Container Manager 설치가 막히면 GitHub Pages로 Market Radar를 바로 공개할 수 있습니다.

이 앱은 `index.html`, `src/app.mjs`, `src/data.mjs`, `src/styles.css`로 실행되는 정적 웹앱입니다. 서버 기능 없이 브라우저에서 AI 후보군 화면을 그리므로 GitHub Pages에 잘 맞습니다.

## 배포 방식

1. GitHub 저장소에 이 프로젝트를 올립니다.
2. `main` 브랜치에 푸시하거나 Actions 탭에서 `Deploy Market Radar Pages`를 수동 실행합니다.
3. workflow가 정적 결과물을 `gh-pages` 브랜치의 루트로 올립니다.
4. 저장소 Settings > Pages에서 Source를 `Deploy from a branch`, Branch를 `gh-pages` / `/(root)`로 선택합니다.
5. 배포가 끝나면 `https://ryuun78.github.io/market-radar/`로 접속합니다.

## 현재 workflow

`.github/workflows/market-radar-pages.yml`은 `build-github-pages-artifact.sh`로 `_site` 폴더를 만들고 앱 실행에 필요한 정적 파일만 `gh-pages` 브랜치에 올립니다.

- Docker를 사용하지 않습니다.
- GitHub Actions에서 `peaceiris/actions-gh-pages@v4`로 정적 파일만 게시합니다.
- `market-radar/index.html`이 사이트 첫 화면이 됩니다.
- `.nojekyll`을 포함해 GitHub Pages가 파일을 그대로 서빙하도록 합니다.
- 게시 브랜치에는 `index.html`, `health.html`, `.nojekyll`, `src/app.mjs`, `src/data.mjs`, `src/styles.css`만 들어갑니다.

로컬에서 같은 아티팩트를 먼저 확인하려면 아래를 실행합니다.

```bash
./build-github-pages-artifact.sh
./verify-github-pages-artifact.sh ../market-radar-pages-site
```

## 역할 분리

GitHub Pages는 빠른 공개와 외부 접속 확인용입니다. Synology Docker/Web Station 배포는 집 NAS에서 직접 운영하는 경로로 계속 유지합니다.
