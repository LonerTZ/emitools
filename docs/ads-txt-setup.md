# Ads.txt Setup Documentation

## Overview
This document explains the ads.txt setup for Ezoic integration following the official Ezoic documentation.

## Implementation Method
We've implemented the **Server Redirect** method using Apache .htaccess rules.

## Files Created/Modified

### 1. .htaccess
Added redirect rule:
```apache
# Redirect ads.txt to Ezoic's ads.txt manager
RewriteRule ^ads\.txt$ https://srv.adstxtmanager.com/19390/%{HTTP_HOST} [R=301,L]
```

### 2. ads.txt (Placeholder)
Created a placeholder file with instructions for development.

### 3. ads-redirect.php (Alternative)
Created a PHP redirect script as an alternative method.

## Deployment Instructions

### For Production Deployment:
1. Ensure smartemi.nortech.co.tz is properly configured with Ezoic
2. The .htaccess redirect will automatically use your domain name
3. Test by visiting `smartemi.nortech.co.tz/ads.txt`
4. Verify you see a list of authorized ad sellers

### Testing
- Local testing: `http://localhost:8000/ads.txt`
- Production testing: `https://smartemi.nortech.co.tz/ads.txt`

## Benefits
- **Automatic Updates**: Ezoic manages the ads.txt content
- **Revenue Optimization**: Ensures authorized sellers can bid on inventory
- **Compliance**: Meets industry standards for ad transparency

## Troubleshooting
- Clear website cache if ads.txt doesn't appear
- Ensure .htaccess file has proper permissions
- Verify mod_rewrite is enabled on your server

## References
- [Ezoic Ads.txt Documentation](https://docs.ezoic.com/docs/ezoicads/adstxt/)