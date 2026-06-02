"use client"

import React, { useEffect } from "react"

import { Provider } from "react-redux"
import { store } from "./store"
import { useAppDispatch } from "./hooks"
import { completeOAuth, restoreSession } from "./slices/auth-slice"

function SessionBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const userId = params.get("userId")
    const secret = params.get("secret")

    // Returning from Google OAuth: exchange the token for a session, then
    // strip the sensitive params from the URL.
    if (userId && secret) {
      dispatch(completeOAuth({ userId, secret })).finally(() => {
        window.history.replaceState({}, "", window.location.pathname)
      })
      return
    }

    dispatch(restoreSession())
  }, [dispatch])

  return <>{children}</>
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionBootstrap>{children}</SessionBootstrap>
    </Provider>
  )
}
