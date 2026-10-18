// import Home from "./pages/Home";

// function App() {
//   return <Home />;

// }

// export default App;
// import TestApi from "./pages/TestApi";

// function App() {
//   return <TestApi />;
// }
// 5172
// export default App;

// import AppRoutes from "./routes/AppRoutes";

// function App() {
//   return <AppRoutes />;
// }

// export default App;

import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;