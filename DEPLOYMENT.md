# Deployment Checklist for Vercel

## Pre-Deployment

- [ ] All code is committed to Git
- [ ] MongoDB Atlas database is set up
- [ ] Environment variables are documented
- [ ] Dependencies are up to date (`npm install`)
- [ ] Build works locally (`npm run build`)
- [ ] All pages load without errors

## Vercel Configuration

### Environment Variables (Add these in Vercel dashboard)

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
NEXT_PUBLIC_SITE_URL=https://your-project-name.vercel.app
```

### Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## Post-Deployment

- [ ] Visit the deployed site
- [ ] Initialize database: `https://your-site.vercel.app/api/init`
- [ ] Test all pages:
  - [ ] Homepage
  - [ ] Product details
  - [ ] Team page
  - [ ] Cart functionality
  - [ ] Checkout process
  - [ ] Contact form
  - [ ] QR search
- [ ] Test mobile responsiveness
- [ ] Check all images load
- [ ] Test QR code generation
- [ ] Verify API endpoints work

## Security Checklist

- [ ] MongoDB Atlas IP whitelist configured
- [ ] Strong database credentials used
- [ ] `.env.local` is in `.gitignore`
- [ ] No sensitive data in code
- [ ] HTTPS enabled (automatic on Vercel)

## Performance Checklist

- [ ] Images are optimized
- [ ] API responses are fast
- [ ] Database queries are indexed
- [ ] No console errors in production

## Domain Setup (Optional)

1. Add custom domain in Vercel dashboard
2. Update DNS records
3. Update `NEXT_PUBLIC_SITE_URL` environment variable
4. Redeploy

## Monitoring

- [ ] Set up error tracking (optional)
- [ ] Monitor Vercel analytics
- [ ] Check MongoDB Atlas metrics
- [ ] Test contact form submissions

## Rollback Plan

If deployment fails:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test build locally
4. Roll back to previous deployment in Vercel
5. Fix issues and redeploy

## Support Resources

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/

---

**Deployment Date**: ___________
**Deployed By**: ___________
**Production URL**: ___________
