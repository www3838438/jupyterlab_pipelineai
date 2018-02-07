import {
  JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
  ICommandPalette, InstanceTracker
} from '@jupyterlab/apputils';

import {
  JSONExt // new
} from '@phosphor/coreutils';

import {
  Message
} from '@phosphor/messaging';

import {
  Widget
} from '@phosphor/widgets';

import '../style/index.css';


/**
 * A viewer.
 */
class PipelineAIWidget extends Widget {
  /**
   * Construct a new widget.
   */
  constructor() {
    super();

    this.id = 'pipelineai-jupyterlab';
    this.title.label = 'pipeline.ai';
    this.title.closable = true;
    this.addClass('jp-pipelineaiWidget');

    this.img = document.createElement('img');
    this.img.className = 'jp-pipelineai';
    this.node.appendChild(this.img);

    this.img.insertAdjacentHTML('afterend',
      `<div class="jp-pipelineaipipelineaiAttribution">
        <a href="http://pipeline.ai" class="jp-pipelineaiAttribution" target="_blank">
          <img src="http://pipeline.ai/assets/img/logo/pipelineai-logo-community-100x36.png" />
        </a>
      </div>`
    );
  }

  /**
   * The image element associated with the widget.
   */
  readonly img: HTMLImageElement;

  /**
   * Handle update requests for the widget.
   */
  onUpdateRequest(msg: Message): void {
    fetch('https://egszlpbmle.execute-api.us-east-1.amazonaws.com/prod').then(response => {
      return response.json();
    }).then(data => {
      this.img.src = data.img;
      this.img.alt = data.title;
      this.img.title = data.alt;
    });
  }
};


/**
 * Activate the xckd widget extension.
 */
function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
  console.log('JupyterLab extension jupyterlab_pipelineai is activated!');

  // Declare a widget variable
  let widget: PipelineAIWidget;

  // Add an application command
  const command: string = 'pipelineai:open';
  app.commands.addCommand(command, {
    label: 'PipelineAI',
    execute: () => {
      if (!widget) {
        // Create a new widget if one does not exist
        widget = new PipelineAIWidget();
        widget.update();
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the main area if it's not there
        app.shell.addToMainArea(widget);
      } else {
        // Refresh the comic in the widget
        widget.update();
      }
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({ command, category: 'Tutorial' });

  // Track and restore the widget state
  let tracker = new InstanceTracker<Widget>({ namespace: 'pipelineai' });
  restorer.restore(tracker, {
    command,
    args: () => JSONExt.emptyObject,
    name: () => 'pipelineai'
  });
};

/**
 * Initialization data for the jupyterlab_pipelineai extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab_pipelineai',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;
