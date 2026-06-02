import "server-only"

import { Client, Users, Databases, Account } from "node-appwrite"
import { appwriteEndpoint, appwriteProjectId } from "./config"

/**
 * Server-only Appwrite client backed by an API key. This must NEVER be imported
 * into a client component — the `server-only` package throws at build time if it
 * is. The API key is read from a non-public env var and grants admin access used
 * for privileged operations (creating users, deactivating accounts).
 */
export function createAdminClient() {
  const apiKey = process.env.APPWRITE_API_KEY
  if (!apiKey) {
    throw new Error("APPWRITE_API_KEY is not set. Configure it in .env.local.")
  }

  const client = new Client()
    .setEndpoint(appwriteEndpoint)
    .setProject(appwriteProjectId)
    .setKey(apiKey)

  return {
    client,
    users: new Users(client),
    databases: new Databases(client),
  }
}

/**
 * Client scoped to a caller's short-lived JWT (created on the browser via
 * account.createJWT()). Used to authenticate the requester and read their
 * identity server-side before performing privileged actions.
 */
export function createSessionClient(jwt: string) {
  const client = new Client()
    .setEndpoint(appwriteEndpoint)
    .setProject(appwriteProjectId)
    .setJWT(jwt)

  return { client, account: new Account(client) }
}
