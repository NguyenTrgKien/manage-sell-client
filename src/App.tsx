import { Route, Routes } from "react-router-dom";
import routerInits from "./routers/routeInit";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        {routerInits.map((route, index) => {
          const Element = route.element;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                route.isPrivate ? (
                  <PrivateRoute>
                    <Element />
                  </PrivateRoute>
                ) : (
                  <Element />
                )
              }
            />
          );
        })}
      </Routes>
      <ToastContainer
        aria-label={"Thông báo"}
        position="top-right"
        autoClose={1000}
        theme="light"
      />
    </>
  );
}

export default App;
