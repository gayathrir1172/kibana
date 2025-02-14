/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import uuid from 'uuid';
import { parseTimeShift } from '@kbn/data-plugin/common';
import {
  FormulaColumn,
  getIndexPatternIds,
  StaticValueColumn,
} from '@kbn/visualizations-plugin/common/convert_to_lens';
import { PANEL_TYPES, TSVB_METRIC_TYPES } from '../../../common/enums';
import { Metric } from '../../../common/types';
import { getDataViewsStart } from '../../services';
import { getDataSourceInfo } from '../lib/datasource';
import { getMetricsColumns, getBucketsColumns } from '../lib/series';
import { getConfigurationForGauge as getConfiguration } from '../lib/configurations/metric';
import {
  getFormulaFromMetric,
  getReducedTimeRange,
  isValidMetrics,
  SUPPORTED_METRICS,
} from '../lib/metrics';
import { ConvertTsvbToLensVisualization } from '../types';
import {
  Column,
  createFormulaColumnWithoutMeta,
  createStaticValueColumn,
  Layer as ExtendedLayer,
} from '../lib/convert';
import { excludeMetaFromLayers, findMetricColumn, getMetricWithCollapseFn } from '../utils';

const getMaxFormula = (metric: Metric, column?: Column) => {
  const baseFormula = `overall_max`;
  if (column && column.operationType === 'formula') {
    return `${baseFormula}(${column.params.formula})`;
  }

  return `${baseFormula}(${getFormulaFromMetric(SUPPORTED_METRICS[metric.type]!)}(${
    metric.field ?? ''
  }))`;
};

export const convertToLens: ConvertTsvbToLensVisualization = async (model, timeRange) => {
  const dataViews = getDataViewsStart();

  const series = model.series[0];
  // not valid time shift
  if (series.offset_time && parseTimeShift(series.offset_time) === 'invalid') {
    return null;
  }

  if (!isValidMetrics(series.metrics, PANEL_TYPES.GAUGE, series.time_range_mode)) {
    return null;
  }

  if (series.metrics[series.metrics.length - 1].type === TSVB_METRIC_TYPES.STATIC) {
    return null;
  }

  const reducedTimeRange = getReducedTimeRange(model, series, timeRange);
  const datasourceInfo = await getDataSourceInfo(
    model.index_pattern,
    model.time_field,
    Boolean(series.override_index_pattern),
    series.series_index_pattern,
    series.series_time_field,
    dataViews
  );

  if (!datasourceInfo) {
    return null;
  }

  const { indexPatternId, indexPattern } = datasourceInfo;

  // handle multiple metrics
  const metricsColumns = getMetricsColumns(series, indexPattern!, model.series.length, {
    reducedTimeRange,
  });
  if (metricsColumns === null) {
    return null;
  }

  const bucketsColumns = getBucketsColumns(model, series, metricsColumns, indexPattern!, false);

  if (bucketsColumns === null) {
    return null;
  }

  const [bucket] = bucketsColumns;

  const extendedLayer: ExtendedLayer = {
    indexPatternId,
    layerId: uuid(),
    columns: [...metricsColumns, ...(bucket ? [bucket] : [])],
    columnOrder: [],
  };

  const primarySeries = model.series[0];
  const primaryMetricWithCollapseFn = getMetricWithCollapseFn(primarySeries);

  if (!primaryMetricWithCollapseFn || !primaryMetricWithCollapseFn.metric) {
    return null;
  }

  const primaryColumn = findMetricColumn(primaryMetricWithCollapseFn.metric, extendedLayer.columns);
  if (!primaryColumn) {
    return null;
  }

  let gaugeMaxColumn: StaticValueColumn | FormulaColumn | null = createFormulaColumnWithoutMeta(
    getMaxFormula(primaryMetricWithCollapseFn.metric, primaryColumn)
  );
  if (model.gauge_max !== undefined && model.gauge_max !== '') {
    gaugeMaxColumn = createStaticValueColumn(model.gauge_max);
  }

  const layer = {
    ...extendedLayer,
    columns: [...extendedLayer.columns, gaugeMaxColumn],
  };
  const configuration = getConfiguration(model, layer, bucket, gaugeMaxColumn ?? undefined);
  if (!configuration) {
    return null;
  }

  const layers = Object.values(excludeMetaFromLayers({ 0: layer }));
  return {
    type: 'lnsMetric',
    layers,
    configuration,
    indexPatternIds: getIndexPatternIds(layers),
  };
};
