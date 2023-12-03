import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import ErrorFallback from "./components/ErrorFallback/ErrorFallback";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store/store";
import RouterRender from "./routes/routerRender";
import Loader from "./components/Loader/Loader";
import { PersistGate } from "redux-persist/integration/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			refetchInterval: 30_000,
		},
	},
});

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<QueryClientProvider client={queryClient}>
					<ErrorBoundary FallbackComponent={ErrorFallback}>
						<Suspense fallback={<Loader />}>
							<LocalizationProvider dateAdapter={AdapterMoment}>
								<RouterRender />
							</LocalizationProvider>
						</Suspense>
					</ErrorBoundary>
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
				<ToastContainer position="top-center" />
			</PersistGate>
		</Provider>
	);
}

export default App;
