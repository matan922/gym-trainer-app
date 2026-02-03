import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import App from "./App.tsx"
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ClerkProvider } from '@clerk/react-router'

const queryClient = new QueryClient()
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!clerkPublishableKey) {
	throw new Error('Missing Publishable Key')
}
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<ClerkProvider publishableKey={clerkPublishableKey}>
					<div dir="rtl">
						<App />
					</div>
				</ClerkProvider>
			</BrowserRouter>
			<ReactQueryDevtools />
		</QueryClientProvider>
	</StrictMode>,
)
