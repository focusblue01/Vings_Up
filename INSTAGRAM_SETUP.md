# Instagram OAuth Setup Guide

To enable **Real Instagram Login** (instead of Mock), you must create an app on the Meta (Facebook) Developers platform and get your API keys.

## Step 1: Create a Meta App
1.  Go to [Meta for Developers](https://developers.facebook.com/).
2.  Click **My Apps** -> **Create App**.
3.  Select **"Consumer"** (or "Something Else" -> "Consumer").
4.  Enter an **App Name** (e.g., "PawsNPose").
5.  Click **Create App**.

## Step 2: Add Instagram Basic Display
1.  On the App Dashboard, find **Instagram Basic Display** and click **Set Up**.
2.  Scroll to the bottom -> **Create New App**.
3.  Enter Display Name (e.g., "PawsNPose").
4.  **Important**: In **Client OAuth Settings**:
    - **Valid OAuth Redirect URIs**: Enter `http://localhost:3001/api/auth/instagram/callback`
    - **Deauthorize Callback URL**: Enter `http://localhost:3001/api/auth/instagram/deauth` (optional, can use same as above for dev)
    - **Data Deletion Request URL**: Enter `http://localhost:3001/api/auth/instagram/delete` (optional)
5.  Save Changes.

## Step 3: Add a Tester (CRITICAL for Dev)
While your app is in "Development" mode, **only added testers can log in**.
1.  Go to **Roles** -> **Roles** (Left Sidebar).
2.  Scroll to **Instagram Testers**.
3.  Click **Add Instagram Testers**.
4.  Enter **YOUR Instagram username** and select it.
5.  **Action Required**: You must log in to your Instagram account (web), go to **Settings** -> **Apps and Websites** -> **Tester Invites**, and **ACCEPT** the invite.

## Step 4: Get Keys
1.  Go back to **Instagram Basic Display** -> **Basic Display**.
2.  Find **Instagram App ID** (This is your Client ID).
3.  Find **Instagram App Secret** -> Click Show (This is your Client Secret).

## Step 5: Update PawsNPose Config
1.  Open the file `.env` in your project root.
2.  Paste your keys:
    ```env
    INSTAGRAM_CLIENT_ID=your_app_id_here
    INSTAGRAM_CLIENT_SECRET=your_app_secret_here
    ```
3.  **Restart the Backend Server**:
    - Stop the running server (`Ctrl + C`).
    - Run `node server/server.cjs`.

## Verification
- Click "Instagram Login".
- It should now take you to `instagram.com` for permission.
- After allowing, you will be redirected back to the PawsNPose "Complete Signup" page.
