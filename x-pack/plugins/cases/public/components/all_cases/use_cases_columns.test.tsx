/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { mount } from 'enzyme';
import { licensingMock } from '@kbn/licensing-plugin/public/mocks';

import '../../common/mock/match_media';
import { ExternalServiceColumn, GetCasesColumn, useCasesColumns } from './use_cases_columns';
import { useGetCasesMockState } from '../../containers/mock';
import { connectors } from '../configure_cases/__mock__';
import {
  AppMockRenderer,
  createAppMockRenderer,
  readCasesPermissions,
  TestProviders,
} from '../../common/mock';
import { renderHook } from '@testing-library/react-hooks';
import { CaseStatuses } from '../../../common';
import { userProfilesMap, userProfiles } from '../../containers/user_profiles/api.mock';

describe('useCasesColumns ', () => {
  let appMockRender: AppMockRenderer;
  const useCasesColumnsProps: GetCasesColumn = {
    filterStatus: CaseStatuses.open,
    userProfiles: userProfilesMap,
    currentUserProfile: userProfiles[0],
    isSelectorView: false,
    showSolutionColumn: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    appMockRender = createAppMockRenderer();
  });

  it('return all columns correctly', async () => {
    const license = licensingMock.createLicense({
      license: { type: 'platinum' },
    });

    appMockRender = createAppMockRenderer({ license });

    const { result } = renderHook(() => useCasesColumns(useCasesColumnsProps), {
      wrapper: appMockRender.AppWrapper,
    });

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "columns": Array [
          Object {
            "name": "Name",
            "render": [Function],
          },
          Object {
            "field": "assignees",
            "name": "Assignees",
            "render": [Function],
          },
          Object {
            "field": "tags",
            "name": "Tags",
            "render": [Function],
            "truncateText": true,
          },
          Object {
            "align": "right",
            "field": "totalAlerts",
            "name": "Alerts",
            "render": [Function],
          },
          Object {
            "align": "right",
            "field": "owner",
            "name": "Solution",
            "render": [Function],
          },
          Object {
            "align": "right",
            "field": "totalComment",
            "name": "Comments",
            "render": [Function],
          },
          Object {
            "field": "createdAt",
            "name": "Created on",
            "render": [Function],
            "sortable": true,
          },
          Object {
            "name": "External Incident",
            "render": [Function],
          },
          Object {
            "name": "Status",
            "render": [Function],
          },
          Object {
            "name": "Severity",
            "render": [Function],
          },
          Object {
            "align": "right",
            "name": "Actions",
            "render": [Function],
          },
        ],
      }
    `);
  });

  it('does not render the solution columns', async () => {
    const license = licensingMock.createLicense({
      license: { type: 'platinum' },
    });

    appMockRender = createAppMockRenderer({ license });

    const { result } = renderHook(
      () => useCasesColumns({ ...useCasesColumnsProps, showSolutionColumn: false }),
      {
        wrapper: appMockRender.AppWrapper,
      }
    );

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "columns": Array [
          Object {
            "name": "Name",
            "render": [Function],
          },
          Object {
            "field": "assignees",
            "name": "Assignees",
            "render": [Function],
          },
          Object {
            "field": "tags",
            "name": "Tags",
            "render": [Function],
            "truncateText": true,
          },
          Object {
            "align": "right",
            "field": "totalAlerts",
            "name": "Alerts",
            "render": [Function],
          },
          Object {
            "align": "right",
            "field": "totalComment",
            "name": "Comments",
            "render": [Function],
          },
          Object {
            "field": "createdAt",
            "name": "Created on",
            "render": [Function],
            "sortable": true,
          },
          Object {
            "name": "External Incident",
            "render": [Function],
          },
          Object {
            "name": "Status",
            "render": [Function],
          },
          Object {
            "name": "Severity",
            "render": [Function],
          },
          Object {
            "align": "right",
            "name": "Actions",
            "render": [Function],
          },
        ],
      }
    `);
  });

  it('does not return the alerts column', async () => {
    const license = licensingMock.createLicense({
      license: { type: 'platinum' },
    });

    appMockRender = createAppMockRenderer({ license, features: { alerts: { enabled: false } } });

    const { result } = renderHook(() => useCasesColumns(useCasesColumnsProps), {
      wrapper: appMockRender.AppWrapper,
    });

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "columns": Array [
          Object {
            "name": "Name",
            "render": [Function],
          },
          Object {
            "field": "assignees",
            "name": "Assignees",
            "render": [Function],
          },
          Object {
            "field": "tags",
            "name": "Tags",
            "render": [Function],
            "truncateText": true,
          },
          Object {
            "align": "right",
            "field": "owner",
            "name": "Solution",
            "render": [Function],
          },
          Object {
            "align": "right",
            "field": "totalComment",
            "name": "Comments",
            "render": [Function],
          },
          Object {
            "field": "createdAt",
            "name": "Created on",
            "render": [Function],
            "sortable": true,
          },
          Object {
            "name": "External Incident",
            "render": [Function],
          },
          Object {
            "name": "Status",
            "render": [Function],
          },
          Object {
            "name": "Severity",
            "render": [Function],
          },
          Object {
            "align": "right",
            "name": "Actions",
            "render": [Function],
          },
        ],
      }
    `);
  });

  it('does not return the assignees column', async () => {
    const { result } = renderHook(() => useCasesColumns(useCasesColumnsProps), {
      wrapper: appMockRender.AppWrapper,
    });

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "columns": Array [
          Object {
            "name": "Name",
            "render": [Function],
          },
          Object {
            "field": "tags",
            "name": "Tags",
            "render": [Function],
            "truncateText": true,
          },
          Object {
            "align": "right",
            "field": "totalAlerts",
            "name": "Alerts",
            "render": [Function],
          },
          Object {
            "align": "right",
            "field": "owner",
            "name": "Solution",
            "render": [Function],
          },
          Object {
            "align": "right",
            "field": "totalComment",
            "name": "Comments",
            "render": [Function],
          },
          Object {
            "field": "createdAt",
            "name": "Created on",
            "render": [Function],
            "sortable": true,
          },
          Object {
            "name": "External Incident",
            "render": [Function],
          },
          Object {
            "name": "Status",
            "render": [Function],
          },
          Object {
            "name": "Severity",
            "render": [Function],
          },
          Object {
            "align": "right",
            "name": "Actions",
            "render": [Function],
          },
        ],
      }
    `);
  });

  it('shows the closedAt column if the filterStatus=closed', async () => {
    appMockRender = createAppMockRenderer();

    const { result } = renderHook(
      () => useCasesColumns({ ...useCasesColumnsProps, filterStatus: CaseStatuses.closed }),
      {
        wrapper: appMockRender.AppWrapper,
      }
    );

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "columns": Array [
          Object {
            "name": "Name",
            "render": [Function],
          },
          Object {
            "field": "tags",
            "name": "Tags",
            "render": [Function],
            "truncateText": true,
          },
          Object {
            "align": "right",
            "field": "totalAlerts",
            "name": "Alerts",
            "render": [Function],
          },
          Object {
            "align": "right",
            "field": "owner",
            "name": "Solution",
            "render": [Function],
          },
          Object {
            "align": "right",
            "field": "totalComment",
            "name": "Comments",
            "render": [Function],
          },
          Object {
            "field": "closedAt",
            "name": "Closed on",
            "render": [Function],
            "sortable": true,
          },
          Object {
            "name": "External Incident",
            "render": [Function],
          },
          Object {
            "name": "Status",
            "render": [Function],
          },
          Object {
            "name": "Severity",
            "render": [Function],
          },
          Object {
            "align": "right",
            "name": "Actions",
            "render": [Function],
          },
        ],
      }
    `);
  });

  it('shows the select button if isSelectorView=true', async () => {
    const { result } = renderHook(
      () => useCasesColumns({ ...useCasesColumnsProps, isSelectorView: true }),
      {
        wrapper: appMockRender.AppWrapper,
      }
    );

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "columns": Array [
          Object {
            "name": "Name",
            "render": [Function],
          },
          Object {
            "field": "tags",
            "name": "Tags",
            "render": [Function],
            "truncateText": true,
          },
          Object {
            "align": "right",
            "field": "totalAlerts",
            "name": "Alerts",
            "render": [Function],
          },
          Object {
            "align": "right",
            "field": "owner",
            "name": "Solution",
            "render": [Function],
          },
          Object {
            "align": "right",
            "field": "totalComment",
            "name": "Comments",
            "render": [Function],
          },
          Object {
            "field": "createdAt",
            "name": "Created on",
            "render": [Function],
            "sortable": true,
          },
          Object {
            "name": "External Incident",
            "render": [Function],
          },
          Object {
            "name": "Status",
            "render": [Function],
          },
          Object {
            "name": "Severity",
            "render": [Function],
          },
          Object {
            "align": "right",
            "render": [Function],
          },
        ],
      }
    `);
  });

  it('does not shows the actions if isSelectorView=true', async () => {
    const { result } = renderHook(
      () => useCasesColumns({ ...useCasesColumnsProps, isSelectorView: true }),
      {
        wrapper: appMockRender.AppWrapper,
      }
    );

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "columns": Array [
          Object {
            "name": "Name",
            "render": [Function],
          },
          Object {
            "field": "tags",
            "name": "Tags",
            "render": [Function],
            "truncateText": true,
          },
          Object {
            "align": "right",
            "field": "totalAlerts",
            "name": "Alerts",
            "render": [Function],
          },
          Object {
            "align": "right",
            "field": "owner",
            "name": "Solution",
            "render": [Function],
          },
          Object {
            "align": "right",
            "field": "totalComment",
            "name": "Comments",
            "render": [Function],
          },
          Object {
            "field": "createdAt",
            "name": "Created on",
            "render": [Function],
            "sortable": true,
          },
          Object {
            "name": "External Incident",
            "render": [Function],
          },
          Object {
            "name": "Status",
            "render": [Function],
          },
          Object {
            "name": "Severity",
            "render": [Function],
          },
          Object {
            "align": "right",
            "render": [Function],
          },
        ],
      }
    `);
  });

  it('does not shows the actions if the user does not have the right permissions', async () => {
    appMockRender = createAppMockRenderer({ permissions: readCasesPermissions() });

    const { result } = renderHook(() => useCasesColumns(useCasesColumnsProps), {
      wrapper: appMockRender.AppWrapper,
    });

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "columns": Array [
          Object {
            "name": "Name",
            "render": [Function],
          },
          Object {
            "field": "tags",
            "name": "Tags",
            "render": [Function],
            "truncateText": true,
          },
          Object {
            "align": "right",
            "field": "totalAlerts",
            "name": "Alerts",
            "render": [Function],
          },
          Object {
            "align": "right",
            "field": "owner",
            "name": "Solution",
            "render": [Function],
          },
          Object {
            "align": "right",
            "field": "totalComment",
            "name": "Comments",
            "render": [Function],
          },
          Object {
            "field": "createdAt",
            "name": "Created on",
            "render": [Function],
            "sortable": true,
          },
          Object {
            "name": "External Incident",
            "render": [Function],
          },
          Object {
            "name": "Status",
            "render": [Function],
          },
          Object {
            "name": "Severity",
            "render": [Function],
          },
        ],
      }
    `);
  });

  describe('ExternalServiceColumn ', () => {
    it('Not pushed render', () => {
      const wrapper = mount(
        <TestProviders>
          <ExternalServiceColumn
            theCase={useGetCasesMockState.data.cases[0]}
            connectors={connectors}
          />
        </TestProviders>
      );

      expect(
        wrapper.find(`[data-test-subj="case-table-column-external-notPushed"]`).last().exists()
      ).toBeTruthy();
    });

    it('Up to date', () => {
      const wrapper = mount(
        <TestProviders>
          <ExternalServiceColumn
            theCase={useGetCasesMockState.data.cases[1]}
            connectors={connectors}
          />
        </TestProviders>
      );

      expect(
        wrapper.find(`[data-test-subj="case-table-column-external-upToDate"]`).last().exists()
      ).toBeTruthy();
    });

    it('Needs update', () => {
      const wrapper = mount(
        <TestProviders>
          <ExternalServiceColumn
            theCase={useGetCasesMockState.data.cases[2]}
            connectors={connectors}
          />
        </TestProviders>
      );

      expect(
        wrapper.find(`[data-test-subj="case-table-column-external-requiresUpdate"]`).last().exists()
      ).toBeTruthy();
    });

    it('it does not throw when accessing the icon if the connector type is not registered', () => {
      // If the component throws the test will fail
      expect(() =>
        mount(
          <TestProviders>
            <ExternalServiceColumn
              theCase={useGetCasesMockState.data.cases[2]}
              connectors={[
                {
                  id: 'none',
                  actionTypeId: '.none',
                  name: 'None',
                  config: {},
                  isPreconfigured: false,
                  isDeprecated: false,
                },
              ]}
            />
          </TestProviders>
        )
      ).not.toThrowError();
    });

    it('shows the connectors icon if the user has read access to actions', async () => {
      const result = appMockRender.render(
        <ExternalServiceColumn
          theCase={useGetCasesMockState.data.cases[1]}
          connectors={connectors}
        />
      );

      expect(result.getByTestId('cases-table-connector-icon')).toBeInTheDocument();
    });

    it('hides the connectors icon if the user does not have read access to actions', async () => {
      appMockRender.coreStart.application.capabilities = {
        ...appMockRender.coreStart.application.capabilities,
        actions: { save: false, show: false },
      };

      const result = appMockRender.render(
        <ExternalServiceColumn
          theCase={useGetCasesMockState.data.cases[1]}
          connectors={connectors}
        />
      );

      expect(result.queryByTestId('cases-table-connector-icon')).toBe(null);
    });
  });
});
