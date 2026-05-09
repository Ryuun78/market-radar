# GitHub Benchmark Notes

이 프로젝트는 새 배포/검증 코드를 추가할 때 GitHub에서 널리 쓰이는 공개 패턴을 먼저 확인하고, 필요한 부분만 작게 가져온다.

## Release artifact checksums

Benchmarked sources:

- GitHub Marketplace `Generate Checksum`
- Binance public data (`binance/binance-public-data`) checksum 안내
- 공개 shell checksum 검증 예시들

Borrowed pattern:

- 릴리스 산출물과 별도의 checksum 파일을 함께 둔다.
- Linux에서는 `sha256sum -c checksum-file`로 검증한다.
- macOS에서는 `shasum -a 256 -c checksum-file`로 검증한다.
- checksum 파일은 `hash  filename` 형식의 GNU coreutils 호환 포맷을 사용한다.

Local implementation:

- `build-checksums.sh` creates `market-radar-checksums.txt`.
- `verify-checksums.sh` verifies `market-radar-synology.zip` and `market-radar-webstation.zip`.
- `verify-release-readiness.sh` runs checksum generation and verification before printing `READY_FOR_NAS_UPLOAD`.

## Synology deployment fallback

Benchmarked pattern:

- Prefer containerized static hosting when Docker or Container Manager is available.
- Keep a static-file fallback when the host cannot run containers.

Local implementation:

- Docker path: `compose.yaml`, `compose.synology.auth.yaml`, `nginx.conf`.
- Web Station fallback: `build-webstation-package.sh`, `verify-webstation-package.sh`, `verify-webstation-url.sh`.

## Docker runtime preflight

Benchmarked sources:

- `docker/compose` official repository quick start pattern
- `docker/compose` and `docker/for-mac` GitHub issues around missing `docker compose` or `docker-compose`
- Public shell install/preflight snippets that use `command -v docker`

Borrowed pattern:

- Check the Docker CLI before trying to start a project.
- Accept modern `docker compose` and legacy `docker-compose` where practical.
- Check whether the Docker daemon is reachable separately from whether the CLI exists.
- Parse the compose file before attempting a real container start.

Local implementation:

- `verify-docker-runtime.sh` is a non-starting Docker/Compose preflight for Synology SSH or any Docker-capable machine.
- It prints `DOCKER_RUNTIME_READY=yes` only when required files, Docker CLI, Compose CLI, daemon access, and `compose.yaml` parsing all pass.
- It exits with `DOCKER_RUNTIME_READY=no` when Docker is unavailable, guiding the user toward Web Station if Container Manager is unsupported.

## Upload handoff bundle

Benchmarked sources:

- GitHub Docs release integrity verification
- GitHub Actions `upload-artifact`
- GitHub Marketplace `Zip Release`
- GitHub deployment status pages and artifact handoff examples

Borrowed pattern:

- Collect only selected release artifacts and handoff documents.
- Keep generated artifacts immutable after validation.
- Include checksum metadata alongside uploadable files.
- Keep the latest deployment status handoff near the upload artifacts.

Local implementation:

- `prepare-nas-upload-kit.sh` creates `market-radar-nas-upload-kit`.
- The kit contains both zip files, checksum file, and short deployment/audit documents.
- `verify-nas-upload-kit.sh` validates required files and checks the kit's release integrity with the checksum file.
- The kit is a folder rather than a zip so the user can upload `market-radar-webstation.zip` directly without unwrapping a zip-inside-zip.
- `NAS_CURRENT_STATUS.md` records the current NAS IP, DDNS, live probe result, and exact next gate before final proof.

## URL health check

Benchmarked sources:

- GitHub Marketplace `URL Health Check`
- GitHub Marketplace deploy actions that support a healthcheck URL and expected check string
- Public GitHub Actions deployment workflows that run `curl` against a live route after release
- Public URL health check actions that accept a `basic-auth` pair for protected deployment checks

Borrowed pattern:

- Verify the deployed app over HTTP after upload, not just the local build artifact.
- Fetch both the main app route and a lightweight health URL.
- Fail the deployment check when the expected body text is missing.
- Keep the successful URL check as explicit completion evidence.
- Support Basic Auth during verification so protected public deployments can still be checked automatically.
- Detect common Synology/DSM response bodies so a reverse proxy pointed at DSM is not confused with a missing app file.

Local implementation:

- `record-nas-deployment-proof.sh` checks both `INTERNAL_URL` and `EXTERNAL_URL`.
- Each URL must return an app page containing `Market Radar` and `health.html` containing `Market Radar OK`.
- Docker verification checks both the local `src/app.mjs` copy and the served `/src/app.mjs` URL so a stale container route is not mistaken for a fresh upload.
- `MARKET_RADAR_BASIC_AUTH=user:pass` can be used by URL verifiers when password protection is enabled.
- On success it writes `NAS_DEPLOYMENT_VERIFIED.txt`, which `audit-goal-completion.sh` requires before the goal can be marked complete.

## Live NAS post-deploy probe

Benchmarked sources:

- GitHub Marketplace `URL Health Check`
- Public shell health check snippets that use `curl` or `wget` with timeout
- Docker health check examples that fail when an expected response is missing

Borrowed pattern:

- Keep the probe read-only.
- Check multiple candidate URLs quickly instead of assuming one route is active.
- Print machine-readable status lines so the next action is obvious.
- Return a non-zero status when the app is not live yet, without creating completion evidence.
- Print DNS resolution status separately from HTTP/DSM/app status.
- Flag candidates that return Synology/DSM pages so reverse proxy mistakes stand out.

Local implementation:

- `probe-live-nas.sh` checks DSM reachability on `:5001`.
- It probes Web Station `:8088`, Docker `:4173`, and HTTPS root candidates for `Market Radar OK`.
- It prints `HOST_IS_IP`, `DNS_RESOLVED`, `DNS_ADDRESS`, and `APP_CANDIDATE_SYNOLOGY_PAGE` where applicable.
- It prints `MARKET_RADAR_READY=yes` only when a real deployed health page responds.

## static artifact folder validation

Benchmarked sources:

- GitHub Marketplace `Check File Existence`
- GitHub Pages artifact validation guidance
- Public static-site deploy workflows that validate generated folders before upload

Borrowed pattern:

- Validate the extracted deployment folder, not only the zip.
- Require the static entrypoint, health page, scripts, and data files.
- Fail when build-time module extensions remain in the Web Station folder.

Local implementation:

- `verify-webstation-folder.sh` checks an already extracted Web Station folder.
- It requires `index.html`, `health.html`, `src/styles.css`, `src/app.js`, and `src/data.js`.
- It confirms `health.html` contains `Market Radar OK` and no `.mjs` files remain.

## static site copy validation

Benchmarked sources:

- Public static-site deploy snippets that use `rsync` or `cp` into a web root
- GitHub Actions rsync deployment examples
- GitHub artifact docs that emphasize verifying downloaded artifacts before deployment

Borrowed pattern:

- Validate the source folder before copying.
- Copy the built static files into the serving target.
- Validate the target after copying before declaring the deploy step ready.
- Refuse ambiguous deploy targets so a local test machine does not accidentally create a fake web root.

Local implementation:

- `copy-webstation-ready.sh` copies from `market-radar-webstation-ready` into `/web/market-radar`.
- It copies only the expected static files and `src` files.
- It runs `verify-webstation-folder.sh` before and after copying.
- It auto-selects `/volume1/web/market-radar` or `/web/market-radar` only when those real roots exist; otherwise the caller must pass an explicit target.

## AI candidate screening workflow

Benchmarked sources:

- `xang1234/stock-screener`
- `fiale-plus/eodhd-screener-mcp`
- `elbucho/finviz-api`
- GitHub `stock-screener` JavaScript topic examples

Borrowed pattern:

- Treat the app as a screener that narrows a broad market into a small candidate list.
- Show filters, scores, ranking, and watchlist-ready rows before any deep chart work.
- Keep candidate reasons and exclusion criteria visible so the human trader can decide what deserves chart time.
- Avoid presenting AI output as a final buy/sell decision.

Local design direction:

- Market Radar should become an `AI 후보군` workbench for 이포.
- AI should only surface candidate stocks, themes, setup reasons, chart-check points, and invalidation rules.
- Final chart reading and selection belong to 이포, not the app.
- Chart comparison UI should be secondary to the candidate list.

## Relative strength and volatility screening

Benchmarked sources:

- `iArpanK/RS-Screener`, which ranks stocks by relative strength score and compares against a base symbol.
- `skyte/relative-strength`, which calculates stock performance relative to a reference index and also emits industry rankings.
- `xang1234/stock-screener`, which separates a static demo from the full live screener and exposes RS sparklines, group rank, and theme classifications.
- Public sector strength reports that compare stock or sector performance against broad benchmarks such as SPY.

Borrowed pattern:

- Compare a candidate against a peer group or benchmark before judging the move.
- Separate "strong but volatile" from "lagging and drawing down more than peers."
- Show the comparison basis next to the candidate so the human reviewer knows what the AI used.
- Keep the output as a screening explanation, not a final trading call.

Local implementation:

- `getAiCandidateQueue()` now adds `relativeProfile`, `volatilityCheck`, `relativeCheck`, and `comparisonBasis`.
- Each AI candidate compares return, drawdown, and volatility against the same-theme peer benchmark for the selected period.
- Candidate cards show whether the stock is `변동성 확대형`, `상대강도 유지형`, or `덜 오르고 많이 빠진 상대 낙폭형`.

## GitHub Pages fallback

Benchmarked sources:

- GitHub Docs for Pages custom GitHub Actions workflows.
- Public static-site workflows that publish compiled files to a `gh-pages` branch.
- `peaceiris/actions-gh-pages` examples that publish `publish_dir` with the built-in `GITHUB_TOKEN`.
- Static-demo patterns from stock screener repositories that keep a read-only web view available even when the full server stack is heavier.

Borrowed pattern:

- Publish static files directly when the app does not require a backend.
- Keep deployment independent of Docker so hosting is not blocked by NAS package availability.
- Use a manual `workflow_dispatch` trigger as a simple "run now" button.
- Keep the GitHub Pages source simple: `gh-pages` branch, root folder.

Local implementation:

- `build-github-pages-artifact.sh` creates a minimal `_site`-style folder with only static runtime files.
- `verify-github-pages-artifact.sh` rejects missing or extra files before Pages upload.
- `.github/workflows/market-radar-pages.yml` calls both scripts before publishing `_site` to the `gh-pages` branch.
- `market-radar/.nojekyll` tells Pages to serve the static files as-is.
- `GITHUB_PAGES_DEPLOY.md` documents this as the public-web fallback while Synology remains the NAS-hosted path.

## NAS staging verification

Benchmarked sources:

- GitHub Docs workflow artifact digest validation
- GitHub Docs release integrity verification
- GitHub Marketplace `Generate Checksum`
- Public WebDAV command-line upload examples
- Public deployment status actions that report `pending`, `success`, and next-check style states

Borrowed pattern:

- Treat the NAS staging folder as a downloaded deployment artifact that must be verified after transfer.
- Verify both the upload kit checksums and the extracted static serving folder.
- Check the expected app copy in the staged files so an older bundle is not mistaken for the latest app.
- Keep this as a read-only verification step that does not rename, remove, or overwrite NAS files.
- Keep a concise status command that summarizes local readiness, staging, live URLs, proof, and next gate.

Local implementation:

- `verify-nas-staging.sh` checks `/Volumes/Download/market-radar-nas-upload-kit` with `verify-nas-upload-kit.sh`.
- It checks `/Volumes/Download/market-radar-webstation-ready` with `verify-webstation-folder.sh`.
- It checks `/Volumes/Download/market-radar-docker-ready` with `verify-docker-ready-folder.sh`.
- It confirms the staged app contains `AI 후보군` and `이포 차트 확인` before printing `NAS_STAGING_OK`.

## Container Manager ready folder validation

Benchmarked sources:

- Docker Compose spec health check examples
- Public static-site Docker Compose examples that mount local files into Nginx
- Public deployment scripts that validate required files before launching Compose
- Public Synology Docker Compose repos and gists that use NAS absolute paths such as `/volume1/docker/...`
- Docker Docs on default Compose filenames: `compose.yaml`, `compose.yml`, `docker-compose.yaml`, and `docker-compose.yml`
- Public Synology Container Manager guides and repos that use conventional `docker-compose.yml` filenames for imported projects

Borrowed pattern:

- Validate the extracted Compose project folder before selecting it in a UI.
- Require Compose files, Nginx config, static entrypoint, health page, and app sources.
- Check the serving port mapping and latest app copy before treating the folder as ready.
- Show both DSM shared-folder display paths and `/volume1/...` absolute paths because Synology Docker examples commonly use absolute NAS paths.
- Include `compose.yml`, `docker-compose.yaml`, and `docker-compose.yml` alongside the preferred `compose.yaml` so DSM screens that prefer another default filename still have a direct selectable file.

Local implementation:

- `verify-docker-ready-folder.sh` checks an extracted Container Manager folder.
- It requires `compose.yaml`, matching `compose.yml` / `docker-compose.yaml` / `docker-compose.yml`, Synology compose variants, `nginx.conf`, `health.html`, and `src/*.mjs`.
- It confirms `4173:8080`, `Market Radar OK`, `AI 후보군`, and `이포 차트 확인` before printing `DOCKER_READY_OK`.
- `deployment-status.sh` prints `LOCAL_READY`, `NAS_STAGING`, `INTERNAL_READY`, `EXTERNAL_READY`, `PROOF_READY`, and `NEXT_GATE`.

## Notes

- External examples are treated as patterns, not copied source.
- Implementation stays POSIX shell where practical so it can run on macOS, Linux, and many NAS shell environments.

## Final deployment smoke test

Benchmarked sources:

- GitHub Marketplace `URL Health Check`
- Public deployment smoke-test scripts that run URL checks after release
- Public `wait-for-it` and HTTP 200 wait scripts that retry curl checks until a service is ready
- Shell testing projects such as Bats and ShellSpec, which treat a zero exit code and expected output as proof

Borrowed pattern:

- Keep the final deploy verification as an explicit command.
- Require real internal and external URLs as inputs.
- Run smoke checks before writing success markers.
- Use a bounded retry loop for post-DSM-start waiting instead of guessing how long the NAS needs.
- Print one final machine-readable success marker only after all gates pass.

Local implementation:

- `finalize-nas-deployment.sh` accepts `INTERNAL_URL` and `EXTERNAL_URL` through environment variables or positional arguments.
- It runs `record-nas-deployment-proof.sh`, then `audit-goal-completion.sh`.
- It prints `FINAL_NAS_DEPLOYMENT_OK` only after final proof and completion audit both pass.
- `watch-nas-deployment.sh` repeats that proof check with `MARKET_RADAR_WATCH_INTERVAL` and `MARKET_RADAR_WATCH_ATTEMPTS`, then prints the same final marker only after the deployed app is verified.

## Synology Reverse Proxy handoff

Benchmarked sources:

- Public Synology Docker Compose repositories that route containers behind reverse proxies.
- Public Synology DSM reverse proxy notes showing source HTTPS 443 to local HTTP service ports.
- Synology DSM user guide references for Login Portal and reverse proxy rules.

Borrowed pattern:

- Use a dedicated app hostname rather than stealing the DSM root login URL.
- Route HTTPS source traffic to a local NAS service port such as `localhost:4173`.
- Keep a direct external port-forward option as a temporary smoke test only.

Local implementation:

- `REVERSE_PROXY_INPUTS.md` lists preferred, root-domain, and temporary port-forward external access values.
- The preferred target is `market-radar.ryuunjyp.asuscomm.com` -> `localhost:4173`.
- The final proof still refuses a Synology/DSM page, so a misrouted reverse proxy cannot mark the goal complete.
