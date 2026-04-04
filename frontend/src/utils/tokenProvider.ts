/**
 * Token Provider Pattern
 *
 * This module provides a bridge between React hooks (useAuth) and axios interceptors.
 * Since hooks can only be called in React components, we use a provider pattern
 * to make the Clerk getToken function accessible to axios.
 */

type TokenGetter = () => Promise<string | null>

let clerkTokenGetter: TokenGetter | null = null

/**
 * Register the Clerk getToken function
 * Called once in App.tsx with useAuth().getToken
 */
export const setClerkTokenGetter = (getter: TokenGetter) => {
	clerkTokenGetter = getter
}

/**
 * Get a fresh Clerk token
 * Called by axios interceptor before each API request
 * Returns null if Clerk is not initialized yet
 */
export const getClerkToken = async (): Promise<string | null> => {
	if (!clerkTokenGetter) {
		console.warn('Clerk token getter not registered yet')
		return null
	}

	try {
		const token = await clerkTokenGetter()
		return token
	} catch (error) {
		console.error('Failed to get Clerk token:', error)
		return null
	}
}
