---
title: "TIL: Specify Sst Region"
date: 2024-10-17T05:43:52+02:00
description: Something I learnt today. Maybe more than one thing👾
tags: [til, sst]
images: ['https://images-here-hugo.vercel.app/api/og-image?title=Specify+SST+Region']
---

Especially important if you have a custom domain, explicitly define your region in SST config, and github actions.

Skill issue on my end, I didn't specify a region in my config, meaning it defaults to `us-east-1`
Coupled with specifying it in my github action to deploy to `us-east-2`

Just set this up right the first time, cause migrating regions is a bitch😅
I had to manually delete resources before the tooling could handle automated deployments without name collisions.

The name collisions is what would cause the deployments to throw errors and stop.

## What highlighted the fact that I was in different regions?
Emails were sending with no problem while doing local development (`us-east-1`), but when I deployed to prod (`us-east-2`), emails wouldn't go through😅

This became an issue while trying to get my AWS SES out of sandbox mode & into production, I had to do that for both regions.
My request was accepted for one region, and rejected for the other, despite using the same project description, and multiple appeals.

## SST Config
```ts
export default $config({
	app(input) {
		return {
			name: "gbfm",
			removal: input?.stage === "prod" ? "retain" : "remove",
			home: "aws",
			providers: {
				aws: {
                    // this is the important bit
					region: "us-east-1",
				},
			},
		};
	},
	async run() 
});

```

## Github action

```yaml
 - name: Configure Production AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
        #   fun fact, it's safe to have AWS_ROLE_ARN's in a public place
          role-to-assume: ${{secrets.AWS_ROLE_ARN}}
          role-duration-seconds: 3600 #adjust as needed for your build time
          aws-region: us-east-1
```