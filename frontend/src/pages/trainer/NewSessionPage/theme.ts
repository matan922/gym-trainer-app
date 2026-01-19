import { createTheme } from "@mui/material/styles"
import createCache from "@emotion/cache"
import { prefixer } from "stylis"
import rtlPlugin from "@mui/stylis-plugin-rtl"

// Create RTL cache for Emotion
export const rtlCache = createCache({
	key: "muirtl",
	stylisPlugins: [prefixer, rtlPlugin],
})

// Create MUI theme with RTL direction
export const theme = createTheme({
	direction: "rtl",
	components: {
		MuiAutocomplete: {
			styleOverrides: {
				root: {
					
				}
			}
		}
	}
})
