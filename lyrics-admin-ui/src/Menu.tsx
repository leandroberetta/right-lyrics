import React from "react";
import Albums from "./pages/albums/Albums";
import SongsPage from "./pages/songs/SongsPage";
import LyricsPage from "./pages/lyrics/LyricsPage";
import AlbumForm from "./pages/albums/AlbumForm";

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
    children: [
      {
        nombre: "Album Form",
        type: MenuType.MAIN,
        icon: "fas fa-form",
        layout: MenuLayout.FULL,
        route: "form",
        component: <AlbumForm></AlbumForm>,
      },
      {
        nombre: "Album Form",
        type: MenuType.MAIN,
        icon: "fas fa-form",
        layout: MenuLayout.FULL,
        route: "form/:id",
        component: <AlbumForm></AlbumForm>,
      },
    ],
  },
  {
    nombre: "Songs",
    type: MenuType.MAIN,
    icon: "fas fa-music",
    layout: MenuLayout.FULL,
    route: "songs",
    component: <SongsPage></SongsPage>,
  },
  {
    nombre: "Lyrics",
    type: MenuType.MAIN,
    icon: "fas fa-file-alt",
    layout: MenuLayout.FULL,
    route: "lyrics",
    component: <LyricsPage></LyricsPage>,
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
