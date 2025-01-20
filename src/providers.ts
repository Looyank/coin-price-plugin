import * as path from 'path';
import * as vscode from 'vscode';

export interface CoinType {
  label: string;
  symbol: string;
  iconPath: string;
}

class CoinItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly iconPath: string,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.iconPath = path.join(__dirname, '..', 'resources', iconPath);
    this.tooltip = label;
  }

  contextValue = 'coinItem';
}

export class CoinTreeProvider implements vscode.TreeDataProvider<CoinItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<CoinItem | undefined | null | void> = new vscode.EventEmitter<CoinItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<CoinItem | undefined | null | void> = this._onDidChangeTreeData.event;

  constructor(private data: Record<string, CoinType>) {
    this.data = data;
  }

  public updateData(newData: Record<string, CoinType>) {
    this.data = newData;
    this._onDidChangeTreeData.fire();
  }

  getChildren(
    element?: CoinItem | undefined
  ): vscode.ProviderResult<CoinItem[]> {
    return Object.keys(this.data).map(
      (item) =>
        new CoinItem(
          this.data[item].label,
          vscode.TreeItemCollapsibleState.None,
          this.data[item].iconPath,
        )
    );
  }

  getTreeItem(element: CoinItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
}
