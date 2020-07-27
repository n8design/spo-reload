import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'SpoLiveReloadApplicationCustomizerStrings';
import styles from './SpoLiveReload.module.scss';

const LOG_SOURCE: string = 'SPO Live Reload';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISpoLiveReloadApplicationCustomizerProperties {
  // This is an example; replace with your own property
  Bottom: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SpoLiveReloadApplicationCustomizer
  extends BaseApplicationCustomizer<ISpoLiveReloadApplicationCustomizerProperties> {

  private _bottomPlaceholder: PlaceholderContent | undefined;

  private registerLiveReload() {

    // create a new <script> element
    let script = document.createElement('script');
    // assign the src attribute to the livereload serve
    script.src = "//localhost:35729/livereload.js?snipver=1";
    // add script to the head section of the page
    document.head.appendChild(script);

  }

  private _renderStatusBar() {


    console.debug(window["LiveReload"]);
    // window.WebSocket.length !== 0 && window.WebSocket[0].Initialized

    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._bottomPlaceholder) {
        console.error("The expected placeholder (Bottom) was not found.");
        return;
      }

      if (this.properties) {
        let bottomString: string = this.properties.Bottom;
        if (!bottomString) {
          bottomString = "(Bottom property was not defined.)";
        }

        if (this._bottomPlaceholder.domElement) {
          this._bottomPlaceholder.domElement.innerHTML = `
          <div class=${styles.statusBar}>
                <div class=${styles.statusLabel}>
                SPO Live Reload ${this.manifest.version}
                </div>
          </div>`;
        }
      }
    }
  }

  @override
  public onInit(): Promise<void> {

    console.debug(LOG_SOURCE, `Initialized ${strings.Title}`);
    console.debug(LOG_SOURCE, this);

    this.registerLiveReload();

    this.context.placeholderProvider.changedEvent.add(this, this._renderStatusBar);

    // if (!message) {
    //   message = '(No properties were provided.)';
    // }

    return Promise.resolve();
  }

  private _onDispose(): void {
    console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }

}
