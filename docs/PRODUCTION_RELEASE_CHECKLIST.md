# Production Release Checklist

## ✅ Pre-Release Checklist

### Environment & Configuration
- [ ] All environment variables validated
- [ ] Production API URLs configured
- [ ] Mock APIs disabled in production
- [ ] Feature flags frozen
- [ ] No test keys in production configs
- [ ] Build-time validation passing

### Security
- [ ] HTTPS enforced everywhere
- [ ] Secure token storage verified (mobile & web)
- [ ] All debug logs removed
- [ ] Sensitive data masked in logs
- [ ] Rate limiting enabled (Login, OTP, Payments)
- [ ] RBAC verified for all roles
- [ ] Input sanitization active
- [ ] CORS configured correctly

### Database
- [ ] Final schema migration applied
- [ ] Indexes optimized
- [ ] Automated backups enabled
- [ ] Backup restore tested
- [ ] Audit logs enabled (Admin actions, Payments, Content)

### Legal & Compliance
- [ ] Privacy Policy page published
- [ ] Terms & Conditions page published
- [ ] Refund Policy page published
- [ ] Legal links in footer
- [ ] Legal links in mobile app settings
- [ ] Contact information updated

### App Store & Play Store
- [ ] Android production keystore created
- [ ] iOS production certificates configured
- [ ] App icons and splash screens finalized
- [ ] Version numbers finalized
- [ ] Store listings prepared (descriptions, screenshots)
- [ ] Privacy policy URL added to listings

### Third-Party Services
- [ ] Email provider switched to production
- [ ] SMS/OTP provider switched to production
- [ ] Payment gateway switched to production (Razorpay)
- [ ] reCAPTCHA keys switched to production
- [ ] OAuth keys switched to production (Google, Facebook)
- [ ] FCM keys configured for push notifications

### Monitoring & Alerts
- [ ] Error tracking enabled
- [ ] API failure alerts configured
- [ ] Payment failure alerts configured
- [ ] Auth failure alerts configured
- [ ] Server health checks active
- [ ] Uptime monitoring configured

### Testing
- [ ] Regression testing completed (critical flows)
- [ ] Cross-device testing (Android & iOS)
- [ ] Slow network testing
- [ ] Crash-free startup verified
- [ ] App size optimized
- [ ] Performance benchmarks met

### Documentation
- [ ] Rollback plan documented
- [ ] Deployment procedure documented
- [ ] Emergency contacts listed
- [ ] Production runbook created

## 🚀 Release Steps

### 1. Pre-Deployment
```bash
# Backend
cd backend
npm run build
npm run test:production

# Web
cd web
npm run build
npm run test:production

# Mobile
cd mobile
npm run build:production
```

### 2. Database Migration
```bash
# Run final migration
npm run migrate:production

# Verify migration
npm run verify:migration
```

### 3. Deploy Backend
```bash
# Deploy to production server
npm run deploy:production

# Verify deployment
curl https://api.shreeom.com/health
```

### 4. Deploy Web
```bash
# Deploy to production hosting
npm run deploy:production

# Verify deployment
curl https://app.shreeom.com
```

### 5. Submit Mobile Apps
- [ ] Submit Android app to Play Store
- [ ] Submit iOS app to App Store
- [ ] Monitor submission status

### 6. Post-Deployment Verification
- [ ] All endpoints responding
- [ ] Authentication working
- [ ] Payments processing
- [ ] Notifications sending
- [ ] Analytics tracking

## 🔄 Rollback Procedure

### If Issues Detected:

1. **Immediate Rollback**
   ```bash
   # Backend
   npm run rollback:production
   
   # Web
   npm run rollback:production
   ```

2. **Database Rollback**
   ```bash
   npm run migrate:rollback
   ```

3. **Notify Team**
   - Alert development team
   - Notify stakeholders
   - Document issue

4. **Investigation**
   - Review error logs
   - Check monitoring alerts
   - Identify root cause

## 📞 Emergency Contacts

- **Technical Lead**: [Contact]
- **DevOps**: [Contact]
- **Support**: support@shreeom.com
- **Payment Issues**: payments@shreeom.com

## 📊 Post-Release Monitoring

### First 24 Hours
- Monitor error rates
- Check payment success rates
- Verify authentication flows
- Monitor server resources
- Review user feedback

### First Week
- Analyze analytics data
- Review crash reports
- Monitor performance metrics
- Gather user feedback
- Plan hotfixes if needed

## ✅ Sign-Off

- [ ] Technical Lead Approval
- [ ] QA Approval
- [ ] Product Owner Approval
- [ ] Security Review Complete
- [ ] Legal Review Complete

**Release Date**: _______________
**Release Version**: _______________
**Signed By**: _______________






