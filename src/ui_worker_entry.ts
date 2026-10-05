/**
 * Executable entrypoint for the internal UI Worker. Loading this module installs
 * the native window and WebView2 command receiver; include it when compiling Workers.
 * @module
 */
import { startUIWorker } from './ui_worker.ts';
startUIWorker();
