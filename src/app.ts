import * as vscode from 'vscode';
import {
  getConfigFavouriteCoin,
  getConfigAllCoinList,
  getConfigPollingTime,
  getConfigPriceChangeIcon,
  getConfigTimezone,
} from './utils';
import axios from 'axios';
import { BASIC_URL, TOTAL_COIN } from './config';
import { CoinTreeProvider, CoinType } from './providers';

export class App {
  /**
   * pull all coin price
   */
  private displayAllCoins = false;
  /**
   * display favourite coin list
   */
  private favouriteCoins: string[] = [];
  /**
   * request timer
   */
  private timer: any;
  /**
   * request timeout(ms)
   */
  private pollingTime = 2500;
  private treeProvider: CoinTreeProvider | undefined;

  constructor(context: vscode.ExtensionContext) {
    this.timer = null;
    this.initialValue();
    this.configChange();
    context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration(() => this.configChange())
    );
  }

  initialValue() {
    this.displayAllCoins = getConfigAllCoinList();
    this.favouriteCoins = getConfigFavouriteCoin();
    this.pollingTime = getConfigPollingTime();
  }

  getCoinMarketPrice() {
    axios
      .get(TOTAL_COIN, {
        baseURL: BASIC_URL,
      })
      .then((res) => {
        const result = res.data;
        if (res.status === 200 && result.data.length) {
          this.setActivityBar(result.data);
        }
      });
  }

  public async setActivityBar(data: any) {
    const coinData = this.formatCoinData(data);

    if (!this.treeProvider) {
      // 首次创建 provider
      this.treeProvider = new CoinTreeProvider(coinData);
      vscode.window.registerTreeDataProvider('coin', this.treeProvider);
    } else {
      // 更新现有 provider 的数据
      this.treeProvider.updateData(coinData);
    }
  }

  public formatCoinData(data: any[]) {
    const coinListObj: Record<string, CoinType> = {};
    const timezone = getConfigTimezone();
    data.map((item: any) => {
      const { instId } = item;
      // btc-usdt-swap
      const [targetCoin, unit] = instId.split('-');
      if (!this.displayAllCoins) {
        if (!this.favouriteCoins.includes(targetCoin)) {
          return;
        }
      }
      if (unit !== 'USDT') {
        return;
      }
      const coinItem = {
        label:
          `${targetCoin}`.padEnd(10) +
          `${item.bidPx}`.padEnd(15) +
          `${(((item.bidPx - item[timezone]) / item[timezone]) * 100).toFixed(2)}%`,
        symbol: targetCoin,
        iconPath: '',
      };
      if (getConfigPriceChangeIcon()) {
        coinItem.iconPath = `${item.bidPx > item[timezone] ? 'up' : 'down'}.svg`;
      }
      coinListObj[targetCoin] = coinItem;
    });
    if (!this.displayAllCoins && this.favouriteCoins.length) {
      return Object.fromEntries(
        this.favouriteCoins
          .filter((key) => coinListObj.hasOwnProperty(key))
          .map((key) => [key, coinListObj[key]])
      );
    }
    return coinListObj;
  }

  pollingMarketPrice() {
    this.getCoinMarketPrice();
    this.timer = setInterval(() => {
      this.getCoinMarketPrice();
    }, this.pollingTime);
  }

  configChange() {
    try {
      this.timer && clearInterval(this.timer);
      this.initialValue();
      this.pollingMarketPrice();
    } catch (error) {
      console.log('err', error);
    }
  }
}
