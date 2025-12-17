# Deployment Guide

## Pre-Deployment Checklist

✅ **Build passes** - `npm run build` succeeds
✅ **Lint passes** - `npm run lint` has no errors
✅ **TypeScript passes** - No type errors
✅ **PWA configured** - Service worker + manifest ready
✅ **SEO ready** - OG tags, sitemap, robots.txt
✅ **Production optimized** - Next.js config tuned
✅ **Netlify configured** - `netlify.toml` ready

## Deploy to Netlify

### 1. Push to GitHub

```bash
git add .
git commit -m "Production ready"
git push origin main
```

### 2. Deploy on Netlify

#### Option A: Via Dashboard (Recommended)

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub and select the `waqt` repository
4. Netlify will auto-detect settings from `netlify.toml`
5. Click **"Deploy site"**

#### Option B: Via CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### 3. Configure Custom Domain

In Netlify dashboard:
1. Go to **Domain settings** → **Custom domains**
2. Click **"Add custom domain"**
3. Enter `waqt.life`
4. Netlify will show DNS records to add

In your DNS provider (where `blcnyy.dev` is hosted):
- Add **CNAME** record: `waqt` → `[your-site-name].netlify.app`
- Or use Netlify DNS (easier)

### 4. Enable HTTPS

Netlify automatically provisions SSL via Let's Encrypt:
1. Go to **Domain settings** → **HTTPS**
2. It should say "HTTPS is enabled"
3. If not, click **"Verify DNS configuration"**

SSL usually activates within minutes of DNS propagation.

### 5. Verify Environment Variable

Check **Site settings** → **Environment variables**:
- Should see `NEXT_PUBLIC_APP_URL` = `https://waqt.life` (from `netlify.toml`)
- If you want to override it, add it manually here

## Verify Deployment

- ✅ Visit `https://waqt.life`
- ✅ Test offline: Turn off wifi, refresh page
- ✅ Test PWA: Click "Install" in browser
- ✅ Test sharing: Share link on Twitter/Discord (check preview)
- ✅ Check sitemap: Visit `/sitemap.xml`
- ✅ Check robots: Visit `/robots.txt`

## Deploy to Other Platforms

### Vercel (Alternative)

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Add env var: `NEXT_PUBLIC_APP_URL=https://waqt.life`
4. Deploy

### Cloudflare Pages

1. Connect GitHub repo
2. Build command: `npm run build`
3. Output directory: `.next`
4. Add environment variable

### Self-Hosted

```bash
npm run build
npm run start
```

Use PM2 or similar for production:
```bash
pm2 start npm --name "waqt" -- start
```

## Post-Deployment

### Monitor

- Check Netlify Analytics dashboard (if enabled)
- Monitor errors in Netlify deploy logs
- Test on mobile devices
- Test in different browsers
- Check Netlify Functions logs (for API routes)

### DNS Propagation

- Custom domain may take 5-60 minutes to propagate
- Check status: `dig waqt.life`

### SSL Certificate

- Vercel auto-provisions SSL (Let's Encrypt)
- Should be ready within minutes
- Force HTTPS is enabled by default

## Troubleshooting

### Build Fails
```bash
npm run build
```
Fix any errors locally first

### Domain Not Working
- Verify DNS records in your provider
- Wait for DNS propagation (up to 48h, usually <1h)
- Check Netlify dashboard → Domain settings for status
- Use Netlify DNS for easier setup

### PWA Not Installing
- Must be HTTPS (works on localhost or production)
- Clear browser cache
- Check service worker registration in DevTools

### OG Images Not Showing
- Verify `NEXT_PUBLIC_APP_URL` is set
- Clear Twitter/Facebook cache:
  - Twitter: https://cards-dev.twitter.com/validator
  - Facebook: https://developers.facebook.com/tools/debug/

## Performance Optimization (Already Done)

✅ Image optimization enabled
✅ Compression enabled
✅ Service worker caching
✅ Static generation where possible
✅ React strict mode
✅ Security headers (poweredByHeader: false)

## Security Notes

- No API keys needed (all APIs are public)
- No sensitive data stored
- CORS configured for Diyanet proxy
- Service worker only caches public data
