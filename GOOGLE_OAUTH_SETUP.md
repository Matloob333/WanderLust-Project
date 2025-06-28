# Google OAuth Setup for Deployment

## Why Google OAuth isn't working on deployment:

1. **Callback URL mismatch**: Google OAuth is configured for localhost but not for your deployed domain
2. **Missing environment variables**: OAuth credentials need to be set in your deployment environment
3. **Domain not authorized**: Your deployed domain needs to be added to Google OAuth authorized origins

## Step-by-Step Fix:

### 1. Update Google OAuth Console Settings

Go to [Google Cloud Console](https://console.cloud.google.com/) and:

#### Authorized JavaScript origins:
Add your deployed URL:
```
https://wanderlust-project.onrender.com
http://localhost:8080 (keep for local development)
```

#### Authorized redirect URIs:
Add your deployed callback URL:
```
https://wanderlust-project.onrender.com/auth/google/callback
http://localhost:8080/auth/google/callback (keep for local development)
```

### 2. Set Environment Variables in Render

In your Render dashboard, go to your service and add these environment variables:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BASE_URL=https://wanderlust-project.onrender.com
NODE_ENV=production
ATLASDB_URL=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

### 3. Update Your App Name

The render.yaml file already has the correct app name: `wanderlust-project`

### 4. Common Issues and Solutions:

#### Issue: "Error: redirect_uri_mismatch"
**Solution**: Make sure the redirect URI in Google Console exactly matches your deployed callback URL.

#### Issue: "Error: invalid_client"
**Solution**: Check that your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct.

#### Issue: "Error: access_denied"
**Solution**: Make sure your domain is added to authorized origins.

### 5. Testing:

1. Deploy your app with the updated configuration
2. Try logging in with Google
3. Check the console logs for any OAuth errors
4. Verify the callback URL is being used correctly

### 6. Security Notes:

- Never commit OAuth secrets to version control
- Use environment variables for all sensitive data
- Regularly rotate your OAuth credentials
- Monitor OAuth usage in Google Console

## Quick Checklist:

- [ ] Added deployed domain to Google OAuth authorized origins
- [ ] Added deployed callback URL to Google OAuth redirect URIs
- [ ] Set GOOGLE_CLIENT_ID in Render environment variables
- [ ] Set GOOGLE_CLIENT_SECRET in Render environment variables
- [ ] Set BASE_URL in Render environment variables
- [ ] Updated render.yaml with correct app name
- [ ] Deployed the updated code
- [ ] Tested Google login on deployed site

## IMPORTANT: Your Render App Name

Your Render app is named: **wanderlust-project**
Your deployed URL is: **https://wanderlust-project.onrender.com**

Make sure to use these exact URLs in your Google OAuth console settings. 