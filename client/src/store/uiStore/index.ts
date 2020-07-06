import {action, observable} from 'mobx';
import {persist} from 'mobx-persist';

export class UIStore {
  @persist
  @observable
  jwt?: string;

  @persist
  @observable
  playerName: string = '';

  @action setJwt(jwt: string) {
    this.jwt = jwt;
  }

  @action setPlayerName(playerName: string) {
    this.playerName = playerName;
  }
}

export const uiStore = new UIStore();
export type UIStoreProps = {uiStore: UIStore};
