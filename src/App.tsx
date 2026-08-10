import { AppProvider } from "./app/providers/AppProvider";
import { AppRoutes } from "./routes";

// checking if branch protection works

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;