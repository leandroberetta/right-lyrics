import { observable, action, decorate } from "mobx";

export class HeaderStore {
  title = "";
  setTitle(title: string) {
    this.title = title;
  }
}

decorate(HeaderStore, {
  title: observable,
  setTitle: action,
});

export const headerStore = new HeaderStore();
