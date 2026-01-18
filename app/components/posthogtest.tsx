'use client'

import posthog from 'posthog-js'

export default function PosthogTest() {
  return (
    <button onClick={() => {
        posthog.capture('posthog_test_event')
        console.log("aijiwjea")
        }}>
      Test PostHog
    </button>
  )
}
