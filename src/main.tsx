import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ErrorBoundary } from "react-error-boundary";

import { store } from "./app/store";
import App from "./App.tsx";
import { loadBoardStateFromLocalStorage } from "./features/kanban/kanbanSlice";
import { KANBAN_KEY } from "./config.ts";
import "./index.css";
import ErrorFallback from "./components/ErrorFallback/ErrorFallback.tsx";

function start() {
	store.dispatch(loadBoardStateFromLocalStorage(KANBAN_KEY));

	const root = createRoot(document.getElementById("root")!);

	root.render(
		<StrictMode>
			<Provider store={store}>
				<DndProvider backend={HTML5Backend}>
					<ErrorBoundary fallback={<ErrorFallback />}>
						<App />
					</ErrorBoundary>
				</DndProvider>
			</Provider>
		</StrictMode>
	);
}

start();
