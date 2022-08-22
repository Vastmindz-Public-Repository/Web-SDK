import { MessageEvents } from "./RPPGEvents.types"

/**
 * RPPGSocketConfig
 */
export interface RPPGSocketConfig {
  /***/
  url?: string;

  /***/
  query?: string;

  /***/
  authToken: string;

  /***/
  onConnect?: (arg0: Event) => void;

  /***/
  onClose?: (arg0: CloseEvent) => void;

  /***/
  onError?: (arg0: Event) => void;

  /***/
  onMessage?: (
    arg0: string,
    arg1: MessageEvents) => void;

  onEvent?: (
    arg0: string,
    arg1: MessageEvents) => void;
}


/**
 * RPPGSocketSendMessage
 */
export interface RPPGSocketSendMessage {
  /***/
  bgrSignal: number[];

  /***/
  timestamp: number;
}

export interface RPPGSocketInterface {
  config: RPPGSocketConfig;
  init: () => Promise<Event>;
  send: (message: RPPGSocketSendMessage) => void;
  close: () => Promise<void>;
}
