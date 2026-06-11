# Final Submission Checklist

## Ready locally

- Topic: 第四批次题目二，AI 语音绘图工具
- Project directory: `qiniu-xengineer-voice-draw`
- Local app URL: `http://localhost:5178`
- Source zip: `submission/voxcanvas-lab-source.zip`
- Demo recording in repo: `submission/demo/voxcanvas-demo.webm`
- Narration audio: `submission/demo/voxcanvas-narration.aiff`
- Narration text in repo: `submission/demo/narration.txt`
- README: `README.md`
- Design doc: `docs/design.md`
- Demo script: `docs/demo-script.md`

## Verified

- `npm run check` passes.
- Desktop layout renders with non-empty Canvas.
- Mobile layout stacks without visible overlap.
- Console errors: 0 after favicon fix.
- Example command `draw a sunset background with mountains and a river` decomposes into background, sun, mountains, river.

## Blocked externally

1. GitHub/Gitee repository URL is required by the official form.
2. Current GitHub browser session is not logged in.
3. GitHub connector can list repo `2029233251/-`, but write attempts return 403.
4. Local git push fails because no HTTPS credentials or SSH key are configured.

## Next action

Log in to GitHub or Gitee, create an empty public repository, then provide the repository URL. After that, push the local repo and submit the official form with:

- Topic: `AI 语音绘图工具`
- Repository link: the public GitHub/Gitee repository URL

The README already links to the demo video inside the repository.
