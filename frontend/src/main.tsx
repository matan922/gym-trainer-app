import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, useNavigate } from "react-router"
import App from "./App.tsx"
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ClerkProvider } from '@clerk/react'

const queryClient = new QueryClient()
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// TO DELETE
console.log(clerkPublishableKey)
// TO DELETE

if (!clerkPublishableKey) {
	throw new Error('Missing Publishable Key')
}


function RootLayout() {
	const navigate = useNavigate()
	
	return (
		<ClerkProvider
			routerPush={(to) => navigate(to)}
			routerReplace={(to) => navigate(to, { replace: true })}
			publishableKey={clerkPublishableKey}>
			<div dir="rtl">
				<App />
			</div>
		</ClerkProvider>
	)
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<RootLayout />
			</BrowserRouter>
			<ReactQueryDevtools />
		</QueryClientProvider>
	</StrictMode>,
)
