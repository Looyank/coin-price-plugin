import * as vscode from 'vscode';

export const getConfigFavouriteCoin = () => {
  return vscode.workspace
    .getConfiguration()
    .get('coin-favourite-list', [] as string[])
    .map((coin) => coin.toUpperCase());
};

export const getConfigPollingTime = () => {
  return vscode.workspace.getConfiguration().get('coin-polling-time', 2500);
};

export const getConfigAllCoinList = () => {
  return vscode.workspace.getConfiguration().get('coin-all-list', false);
};

export const getConfigPriceChangeIcon = () => {
  return vscode.workspace.getConfiguration().get('coin-price-change-icon', false);
};

export const getConfigTimezone = () => {
  return vscode.workspace.getConfiguration().get('coin-timezone', 'sodUtc8');
};

export function getRootPath() {
  const rootPath = vscode.workspace?.workspaceFolders?.length
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : undefined;
  return rootPath;
}

export const judgeFavourite = (targetCoin: string) => {
  let userCoinList = getConfigFavouriteCoin();
  return userCoinList.includes(targetCoin);
};
