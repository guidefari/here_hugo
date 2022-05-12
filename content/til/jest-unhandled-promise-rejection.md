---
title: "Jest Unhandled Promise Rejection"
date: 2022-01-27T09:13:13+02:00
description: Something I learnt today. Maybe more than one thing👾
tags: [til, testing, jest]
tldr: an unhandled promise rejection was making my tests fail, here are some snippets for future you.
---

## setting the scene
- I was mocking an async function, & was testing for what would happen if that promise got rejected, ie an **unsuccessful** call.

### culprit test code
```ts
it('SHOULD throw an error', async () => {
      const mockNavigator = jest
        .spyOn(navigator.clipboard, 'writeText')
        .mockImplementation(() => Promise.reject(Error('Not Copied')))

      try {
        await copyToClipboard('copy pasta')
      } catch (err) {
        const error = err as Error
        expect(mockNavigator).toBeCalledTimes(1)
        expect(error.message).toEqual('Not Copied')
      }

      mockNavigator.mockClear()
    })
```

for some reason (that I haven't figured out yet), the catch block in the snippet above wasn't executing.


### the error you jest gives you
```bash
(node:33041) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): boom!
(node:33041) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

## how I fixed it
```ts
it('SHOULD throw an error', async () => {
      const mockNavigator = jest
        .spyOn(navigator.clipboard, 'writeText')
        .mockImplementation(() => {
          throw new Error()
        })

      await expect(copyToClipboard('copy pasta')).toEqual({
        message: 'Error copying link, please try again.',
        severity: 'error',
      })
      expect(mockNavigator).toBeCalledTimes(1)

      mockNavigator.mockClear()
    })
	
```

## copyToClipboard
```ts
interface ClipboardStatus {
  message: string
  severity: 'success' | 'error'
}

export default function copyToClipboard(text: string): ClipboardStatus {
  let result: ClipboardStatus

  try {
    navigator.clipboard.writeText(text)
    result = {
      message: 'Link copied to clipboard.',
      severity: 'success',
    }
  } catch (err) {
    result = {
      message: 'Error copying link, please try again.',
      severity: 'error',
    }
  }

  return result
}

```


# conclusion
- Jest somehow has to handle, or expect the error for it not to chew your head off.