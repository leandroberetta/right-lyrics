import { Provider } from "mobx-react";
import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import FullLayout from "./layout/FullLayout";
import SimpleLayout from "./layout/SimpleLayout";
import menu, { MenuItem, MenuLayout } from "./Menu";
import Albums from "./pages/albums/Albums";
import { stores } from "./store";
import "./api/AxiosConfiguration";
import history from "./router/History";
import { ToastProvider } from "react-toast-notifications";

const buildMenuItem = (item: MenuItem) => {
  if (item.layout === MenuLayout.FULL) {
    return <FullLayout>{item.component}</FullLayout>;
  } else {
    return <SimpleLayout>{item.component}</SimpleLayout>;
  }
};

function App() {
  return (
    <Provider {...stores}>
      <ToastProvider>
        <Router history={history}>
          <Switch>
            {menu.map((item) => (
              <Route exact key={item.nombre} path={"/" + item.route}>
                {buildMenuItem(item)}
              </Route>
            ))}
            {menu
              .filter((item) => item.children)
              .flatMap((item) => {
                const children = item.children;

                return children?.map((child) => (
                  <Route
                    exact
                    key={child.nombre}
                    path={"/" + item.route + "/" + child.route}
                  >
                    {buildMenuItem(child)}
                  </Route>
                ));
              })}
            <Route path="*">
              <FullLayout>
                <Albums></Albums>
              </FullLayout>
            </Route>
          </Switch>
        </Router>
      </ToastProvider>
    </Provider>
  );
}

export default App;
