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

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;