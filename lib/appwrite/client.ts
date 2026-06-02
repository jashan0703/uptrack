"use client"

import { Client, Account, Databases } from "appwrite"
import { appwriteEndpoint, appwriteProjectId } from "./config"

/**
 * Browser-side Appwrite client. Uses only public configuration and the
 * logged-in user's session cookie — never an API key. All access is governed
 * by Appwrite document/collection permissions.
 */
const client = new Client().setEndpoint(appwriteEndpoint).setProject(appwriteProjectId)

export const account = new Account(client)
export const databases = new Databases(client)
export { client }
