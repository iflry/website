# IFLRY Website

# Configuration

- [Step 1. Set up the environment](#step-1-set-up-the-environment)
  - [Reuse remote environment variables](#reuse-remote-environment-variables)
  - [Creating a read token](#creating-a-read-token)
- [Step 2. Run Next.js locally in development mode](#step-2-run-nextjs-locally-in-development-mode)
- [Step 3. Populate content](#step-3-populate-content)
- [Next steps](#next-steps)

## Step 1. Set up the environment

### Reuse remote environment variables

If you started with [deploying your own](#deploy-your-own) then you can run this to reuse the environment variables from the Vercel project and skip to the next step:

```bash
npx vercel link
npx vercel env pull
```

#### Creating a read token

This far your `.env.local` file should have values for `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
Before you can run the project you need to setup a read token (`SANITY_API_READ_TOKEN`), it's used for authentication when Sanity Studio is live previewing your application.

1. Go to [manage.sanity.io](https://manage.sanity.io/) and select your project.
2. Click on the `🔌 API` tab.
3. Click on `+ Add API token`.
4. Name it "next blog live preview read token" and set `Permissions` to `Viewer` and hit `Save`.
5. Copy the token and add it to your `.env.local` file.

```bash
SANITY_API_READ_TOKEN="<paste your token here>"
```

Your `.env.local` file should look something like this:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID="r0z1eifg"
NEXT_PUBLIC_SANITY_DATASET="blog-vercel"
SANITY_API_READ_TOKEN="sk..."
```

## Step 2. Run Next.js locally in development mode

```bash
npm install && npm run dev
```

```bash
yarn install && yarn dev
```

```bash
pnpm install && pnpm dev
```

The website should be up and running on [http://127.0.0.1:3000](http://127.0.0.1:3000)!

## Step 3. Content Management

Open Sanity Studio that should be running on [http://127.0.0.1:3000/studio](http://127.0.0.1:3000/studio).

Whenever you edit a GROQ query you update the TypeScript types by running:

```bash
npm run typegen
```
