import { Provider } from "mobx-react";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FullLayout from "./layout/FullLayout";
import SimpleLayout from "./layout/SimpleLayout";
import menu, { MenuItem, MenuLayout } from "./Menu";
import Albums from "./pages/albums/Albums";
import { stores } from "./store";
import "./api/AxiosConfiguration";

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
      <Router>
        <Switch>
          {menu.map((item) => (
            <Route key={item.nombre} path={"/" + item.route}>
              {buildMenuItem(item)}
            </Route>
          ))}
          <Route path="*">
            <FullLayout>
              <Albums></Albums>
            </FullLayout>
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
