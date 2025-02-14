/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { ColorSchemas } from '@kbn/charts-plugin/common';
import { CustomPaletteParams, PaletteOutput } from '@kbn/coloring';
import { GaugeVisParams } from '../../types';
import { getConfiguration } from './goal';

const params: GaugeVisParams = {
  addTooltip: false,
  addLegend: false,
  isDisplayWarning: true,
  gauge: {
    type: 'meter',
    orientation: 'vertical',
    alignment: 'automatic',
    gaugeType: 'Arc',
    scale: {
      color: 'rgba(105,112,125,0.2)',
      labels: false,
      show: false,
    },
    gaugeStyle: 'Full',
    extendRange: false,
    backStyle: 'Full',
    percentageMode: false,
    percentageFormatPattern: '',
    colorSchema: ColorSchemas.Greys,
    colorsRange: [
      { type: 'range', from: 0, to: 100 },
      { type: 'range', from: 100, to: 200 },
    ],
    labels: {},
    invertColors: false,
    style: {
      bgFill: '',
      bgColor: false,
      labelColor: false,
      subText: '',
      fontSize: 10,
    },
  },
  type: 'gauge',
};

describe('getConfiguration', () => {
  const palette = {
    name: 'custom',
    params: { name: 'custom' },
    type: 'palette',
  } as PaletteOutput<CustomPaletteParams>;

  test('shourd return correct configuration', () => {
    const layerId = 'layer-id';
    const metricAccessor = 'metric-id';
    const breakdownByAccessor = 'bucket-id';
    const metrics = [metricAccessor];
    const buckets = [breakdownByAccessor];
    const maxAccessor = 'max-accessor-id';
    const collapseFn = 'sum';
    expect(
      getConfiguration(layerId, params, palette, {
        metrics,
        buckets,
        maxAccessor,
        columnsWithoutReferenced: [],
        bucketCollapseFn: { [metricAccessor]: collapseFn },
      })
    ).toEqual({
      breakdownByAccessor,
      collapseFn,
      layerId,
      layerType: 'data',
      maxAccessor,
      metricAccessor,
      palette,
    });
  });
});
