/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { uiCapabilitiesForFeatures } from './ui_capabilities_for_features';
import { Feature, FeatureConfig } from '.';
import { SubFeaturePrivilegeGroupConfig } from '../common';

function createFeaturePrivilege(key: string, capabilities: string[] = []) {
  return {
    [key]: {
      savedObject: {
        all: [],
        read: [],
      },
      app: [],
      ui: [...capabilities],
    },
  };
}

function createSubFeaturePrivilege(privilegeId: string, capabilities: string[] = []) {
  return {
    id: privilegeId,
    name: `sub-feature privilege ${privilegeId}`,
    includeIn: 'none',
    savedObject: {
      all: [],
      read: [],
    },
    app: [],
    ui: [...capabilities],
  };
}

describe('populateUICapabilities', () => {
  it('handles no original uiCapabilities and no registered features gracefully', () => {
    expect(uiCapabilitiesForFeatures([])).toEqual({});
  });

  it('handles features with no registered capabilities', () => {
    expect(
      uiCapabilitiesForFeatures([
        new Feature({
          id: 'newFeature',
          name: 'my new feature',
          app: ['bar-app'],
          privileges: ({
            ...createFeaturePrivilege('all'),
          } as unknown) as FeatureConfig['privileges'],
        }),
      ])
    ).toEqual({
      catalogue: {},
      newFeature: {},
    });
  });

  it('augments the original uiCapabilities with registered feature capabilities', () => {
    expect(
      uiCapabilitiesForFeatures([
        new Feature({
          id: 'newFeature',
          name: 'my new feature',
          navLinkId: 'newFeatureNavLink',
          app: ['bar-app'],
          privileges: ({
            ...createFeaturePrivilege('all', ['capability1', 'capability2']),
          } as unknown) as FeatureConfig['privileges'],
        }),
      ])
    ).toEqual({
      catalogue: {},
      newFeature: {
        capability1: true,
        capability2: true,
      },
    });
  });

  it('combines catalogue entries from multiple features', () => {
    expect(
      uiCapabilitiesForFeatures([
        new Feature({
          id: 'newFeature',
          name: 'my new feature',
          navLinkId: 'newFeatureNavLink',
          app: ['bar-app'],
          catalogue: ['anotherFooEntry', 'anotherBarEntry'],
          privileges: ({
            ...createFeaturePrivilege('foo', ['capability1', 'capability2']),
            ...createFeaturePrivilege('bar', ['capability3', 'capability4']),
            ...createFeaturePrivilege('baz'),
          } as unknown) as FeatureConfig['privileges'],
        }),
      ])
    ).toEqual({
      catalogue: {
        anotherFooEntry: true,
        anotherBarEntry: true,
      },
      newFeature: {
        capability1: true,
        capability2: true,
        capability3: true,
        capability4: true,
      },
    });
  });

  it(`merges capabilities from all feature privileges`, () => {
    expect(
      uiCapabilitiesForFeatures([
        new Feature({
          id: 'newFeature',
          name: 'my new feature',
          navLinkId: 'newFeatureNavLink',
          app: ['bar-app'],
          privileges: ({
            ...createFeaturePrivilege('foo', ['capability1', 'capability2']),
            ...createFeaturePrivilege('bar', ['capability3', 'capability4']),
            ...createFeaturePrivilege('baz', ['capability1', 'capability5']),
          } as unknown) as FeatureConfig['privileges'],
        }),
      ])
    ).toEqual({
      catalogue: {},
      newFeature: {
        capability1: true,
        capability2: true,
        capability3: true,
        capability4: true,
        capability5: true,
      },
    });
  });

  it(`supports merging features with sub privileges`, () => {
    expect(
      uiCapabilitiesForFeatures([
        new Feature({
          id: 'newFeature',
          name: 'my new feature',
          navLinkId: 'newFeatureNavLink',
          app: ['bar-app'],
          privileges: ({
            ...createFeaturePrivilege('foo', ['capability1', 'capability2']),
            ...createFeaturePrivilege('bar', ['capability3', 'capability4']),
          } as unknown) as FeatureConfig['privileges'],
          subFeatures: [
            {
              name: 'sub-feature-1',
              privilegeGroups: [
                {
                  groupType: 'independent',
                  privileges: [
                    createSubFeaturePrivilege('privilege-1', ['capability5']),
                    createSubFeaturePrivilege('privilege-2', ['capability6']),
                  ],
                } as SubFeaturePrivilegeGroupConfig,
                {
                  groupType: 'mutually_exclusive',
                  privileges: [
                    createSubFeaturePrivilege('privilege-3', ['capability7']),
                    createSubFeaturePrivilege('privilege-4', ['capability8']),
                  ],
                } as SubFeaturePrivilegeGroupConfig,
              ],
            },
            {
              name: 'sub-feature-2',
              privilegeGroups: [
                {
                  name: 'Group Name',
                  groupType: 'independent',
                  privileges: [
                    createSubFeaturePrivilege('privilege-5', ['capability9', 'capability10']),
                  ],
                } as SubFeaturePrivilegeGroupConfig,
              ],
            },
          ],
        }),
      ])
    ).toEqual({
      catalogue: {},
      newFeature: {
        capability1: true,
        capability2: true,
        capability3: true,
        capability4: true,
        capability5: true,
        capability6: true,
        capability7: true,
        capability8: true,
        capability9: true,
        capability10: true,
      },
    });
  });

  it('supports merging multiple features with multiple privileges each', () => {
    expect(
      uiCapabilitiesForFeatures([
        new Feature({
          id: 'newFeature',
          name: 'my new feature',
          navLinkId: 'newFeatureNavLink',
          app: ['bar-app'],
          privileges: ({
            ...createFeaturePrivilege('foo', ['capability1', 'capability2']),
            ...createFeaturePrivilege('bar', ['capability3', 'capability4']),
            ...createFeaturePrivilege('baz', ['capability1', 'capability5']),
          } as unknown) as FeatureConfig['privileges'],
        }),
        new Feature({
          id: 'anotherNewFeature',
          name: 'another new feature',
          app: ['bar-app'],
          privileges: ({
            ...createFeaturePrivilege('foo', ['capability1', 'capability2']),
            ...createFeaturePrivilege('bar', ['capability3', 'capability4']),
          } as unknown) as FeatureConfig['privileges'],
        }),
        new Feature({
          id: 'yetAnotherNewFeature',
          name: 'yet another new feature',
          navLinkId: 'yetAnotherNavLink',
          app: ['bar-app'],
          privileges: ({
            ...createFeaturePrivilege('all', ['capability1', 'capability2']),
            ...createFeaturePrivilege('read', []),
            ...createFeaturePrivilege('somethingInBetween', [
              'something1',
              'something2',
              'something3',
            ]),
          } as unknown) as FeatureConfig['privileges'],
          subFeatures: [
            {
              name: 'sub-feature-1',
              privilegeGroups: [
                {
                  groupType: 'independent',
                  privileges: [
                    createSubFeaturePrivilege('privilege-1', ['capability3']),
                    createSubFeaturePrivilege('privilege-2', ['capability4']),
                  ],
                } as SubFeaturePrivilegeGroupConfig,
              ],
            },
          ],
        }),
      ])
    ).toEqual({
      anotherNewFeature: {
        capability1: true,
        capability2: true,
        capability3: true,
        capability4: true,
      },
      catalogue: {},
      newFeature: {
        capability1: true,
        capability2: true,
        capability3: true,
        capability4: true,
        capability5: true,
      },
      yetAnotherNewFeature: {
        capability1: true,
        capability2: true,
        capability3: true,
        capability4: true,
        something1: true,
        something2: true,
        something3: true,
      },
    });
  });
});
