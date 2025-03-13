import { render as RtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import { ReactElement } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { configureStore } from "@reduxjs/toolkit";
import kanbanReducer from "../features/kanban/kanbanSlice";

function createTestStore() {
	return configureStore({
		reducer: {
			kanban: kanbanReducer,
		},
	});
}

function customRender(ui: ReactElement) {
	const store = createTestStore();
	return RtlRender(
		<Provider store={store}>
			<DndProvider backend={HTML5Backend}>{ui}</DndProvider>
		</Provider>
	);
}

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
