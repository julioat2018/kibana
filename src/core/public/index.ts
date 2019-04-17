/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { BasePathSetup } from './base_path';
import { Capabilities, CapabilitiesSetup } from './capabilities';
import { ChromeBrand, ChromeBreadcrumb, ChromeHelpExtension, ChromeSetup } from './chrome';
import { FatalErrorsSetup } from './fatal_errors';
import { HttpSetup } from './http';
import { I18nSetup } from './i18n';
import { InjectedMetadataParams, InjectedMetadataSetup } from './injected_metadata';
import { NotificationsSetup, Toast, ToastInput, ToastsSetup } from './notifications';
import { FlyoutRef, OverlaySetup } from './overlays';
import { Plugin, PluginInitializer, PluginInitializerContext, PluginSetupContext } from './plugins';
import { UiSettingsClient, UiSettingsSetup, UiSettingsState } from './ui_settings';

export { CoreContext, CoreSystem } from './core_system';

/**
 * Core services exposed to the start lifecycle
 *
 * @public
 *
 * @internalRemarks We document the properties with \@link tags to improve
 * navigation in the generated docs until there's a fix for
 * https://github.com/Microsoft/web-build-tools/issues/1237
 */
export interface CoreSetup {
  /** {@link I18nSetup} */
  i18n: I18nSetup;
  /** {@link InjectedMetadataSetup} */
  injectedMetadata: InjectedMetadataSetup;
  /** {@link FatalErrorsSetup} */
  fatalErrors: FatalErrorsSetup;
  /** {@link NotificationsSetup} */
  notifications: NotificationsSetup;
  /** {@link HttpSetup} */
  http: HttpSetup;
  /** {@link BasePathSetup} */
  basePath: BasePathSetup;
  /** {@link CapabilitiesSetup} */
  capabilities: CapabilitiesSetup;
  /** {@link UiSettingsSetup} */
  uiSettings: UiSettingsSetup;
  /** {@link ChromeSetup} */
  chrome: ChromeSetup;
  /** {@link OverlaySetup} */
  overlays: OverlaySetup;
}

export {
  BasePathSetup,
  HttpSetup,
  FatalErrorsSetup,
  CapabilitiesSetup,
  Capabilities,
  ChromeSetup,
  ChromeBreadcrumb,
  ChromeBrand,
  ChromeHelpExtension,
  I18nSetup,
  InjectedMetadataSetup,
  InjectedMetadataParams,
  Plugin,
  PluginInitializer,
  PluginInitializerContext,
  PluginSetupContext,
  NotificationsSetup,
  OverlaySetup,
  FlyoutRef,
  Toast,
  ToastInput,
  ToastsSetup,
  UiSettingsClient,
  UiSettingsState,
  UiSettingsSetup,
};
