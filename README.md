# STYLE ICON — イベント×デジタル統合提案プレゼン

React + Vite + Three.js による商談用Webプレゼンテーション。

## 使い方

Chrome で2ウィンドウ開く：

| URL | 用途 |
|-----|------|
| `/` | 顧客画面（外部モニター / プロジェクターに表示） |
| `/presenter` | 台本・カンペ画面（手元のPCで操作） |

→ / ← キー、または「次へ / 前へ」ボタンで進める。顧客画面が自動スクロール同期します。

※ 同じPC・同じChromeブラウザ内でのみ連動します（BroadcastChannel API）

## ローカル開発

```bash
npm install
npm run dev
```

## デプロイ

GitHub にプッシュ → Vercel でリポジトリを連携するだけで自動デプロイされます。

- Build Command: `npm run build`
- Output Directory: `dist`
- Framework Preset: Vite

`vercel.json` によるSPAリライト設定済みのため `/presenter` も正常動作します。
