import { AppProvider } from "@/app/provider.tsx";
import { AppRouter } from "@/app/router.tsx";

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
