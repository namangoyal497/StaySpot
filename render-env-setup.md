# Render Environment Variable Setup

## **Step 1: Set Environment Variable in Render**

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your deployed service: `stayspot-app`
3. Go to **Environment** tab
4. Add this environment variable:

```
REACT_APP_API_URL=https://stayspot-tnd0.onrender.com
```

## **Step 2: Redeploy Your Application**

After adding the environment variable, your application will automatically redeploy.

## **Step 3: Verify the Fix**

1. Wait for deployment to complete (usually 2-3 minutes)
2. Visit your live site: https://stayspot-tnd0.onrender.com
3. Try clicking on the "Travelo Blog" link
4. The blog page should now load without the connection error

## **What This Fixes:**

- ✅ Blog pages will use the deployed backend URL instead of localhost
- ✅ All API calls will work in production
- ✅ Images will load correctly from the deployed server
- ✅ Like/comment functionality will work

## **Alternative: Quick Test**

If you want to test immediately without waiting for deployment, you can temporarily modify the API base URL in your code:

In `client/src/utils/api.js`, change line 2 to:
```javascript
const API_BASE_URL = 'https://stayspot-tnd0.onrender.com';
```

Then redeploy. But the proper solution is using environment variables as shown above. 