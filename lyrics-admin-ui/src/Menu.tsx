import React from "react";
import Albums from "./pages/albums/Albums";

export enum MenuType {
  MAIN,
}

export enum MenuLayout {
  FULL,
  SIMPLE,
}

export interface MenuItem {
  nombre: string;
  color?: string;
  icon?: string;
  route: string;
  layout: MenuLayout;
  component: any;
  type?: MenuType;
  children?: MenuItem[];
  visible?: boolean;
}

const menu: MenuItem[] = [
  {
    nombre: "Albums",
    type: MenuType.MAIN,
    icon: "fas fa-record-vinyl",
    layout: MenuLayout.FULL,
    route: "albums",
    component: <Albums></Albums>,
  },
  {
    nombre: "Prueba 1",
    type: MenuType.MAIN,
    layout: MenuLayout.FULL,
    route: "prueba1",
    component: <Albums></Albums>,
  },
  {
    nombre: "Prueba 2",
    type: MenuType.MAIN,
    layout: MenuLayout.FULL,
    route: "prueba2",
    component: <Albums></Albums>,
  },
  //   {
  //     nombre: "Admin",
  //     color: "black",
  //     type: MenuType.MAIN,
  //     layout: MenuLayout.FULL,
  //     route: "admin",
  //     component: <Admin></Admin>,
  //     children: [
  //       {
  //         nombre: "Dashboard",
  //         color: "black",
  //         type: MenuType.MAIN,
  //         layout: MenuLayout.FULL,
  //         route: "dashboard",
  //         component: <Dashboard></Dashboard>,
  //       },
  //       {
  //         nombre: "Competencias",
  //         color: "black",
  //         type: MenuType.MAIN,
  //         layout: MenuLayout.FULL,
  //         route: "competencias",
  //         component: <Competencias></Competencias>,
  //       },
  //       {
  //         nombre: "Equipos",
  //         color: "black",
  //         type: MenuType.MAIN,
  //         layout: MenuLayout.FULL,
  //         route: "equipos",
  //         component: <Equipos></Equipos>,
  //       },
  //       {
  //         nombre: "Usuarios",
  //         color: "black",
  //         type: MenuType.MAIN,
  //         layout: MenuLayout.FULL,
  //         route: "usuarios",
  //         component: <Usuarios></Usuarios>,
  //       },
  //       {
  //         nombre: "UsuariosForm",
  //         color: "black",
  //         type: MenuType.MAIN,
  //         layout: MenuLayout.FULL,
  //         route: "usuarios/form",
  //         component: <UsuariosForm></UsuariosForm>,
  //         visible: false,
  //       },
  //       {
  //         nombre: "UsuariosForm",
  //         color: "black",
  //         type: MenuType.MAIN,
  //         layout: MenuLayout.FULL,
  //         route: "usuarios/form/:id",
  //         component: <UsuariosForm></UsuariosForm>,
  //         visible: false,
  //       },
  //       {
  //         nombre: "Locaciones",
  //         color: "black",
  //         type: MenuType.MAIN,
  //         layout: MenuLayout.FULL,
  //         route: "locaciones",
  //         component: <Locaciones></Locaciones>,
  //       },
  //       {
  //         nombre: "LocacionesForm",
  //         color: "black",
  //         type: MenuType.MAIN,
  //         layout: MenuLayout.FULL,
  //         route: "locaciones/form",
  //         component: <LocacionesForm></LocacionesForm>,
  //         visible: false,
  //       },
  //       {
  //         nombre: "LocacionesForm",
  //         color: "black",
  //         type: MenuType.MAIN,
  //         layout: MenuLayout.FULL,
  //         route: "locaciones/form/:id",
  //         component: <LocacionesForm></LocacionesForm>,
  //         visible: false,
  //       },
  // ]
  //   }
];

export const findByName = (name: string) =>
  menu.filter((elem) => elem.nombre === name);

export default menu;
