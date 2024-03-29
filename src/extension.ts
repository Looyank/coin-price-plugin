// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { App } from './app';

function installTips(context: vscode.ExtensionContext) {
  const currentVersion = vscode.extensions.getExtension(
    'blackberry009.coin-watch-real-time'
  )?.packageJSON?.version;
  let storedVersion = context.globalState.get('extensionVersion');
  if (!storedVersion || storedVersion !== currentVersion) {
    vscode.window
      .showInformationMessage(
        'welcome to use this plugin , please reload window to use!!!',
        'reload'
      )
      .then((choice) => {
        if (choice === 'reload') {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
      });

    context.globalState.update('extensionVersion', currentVersion);
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "coin-watch-real-time" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'coin-watch-real-time.helloWorld',
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        'Hello World from coin-watch-real-time!'
      );
    }
  );

  context.subscriptions.push(disposable);

  installTips(context);
  new App(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
