/* eslint-disable import/prefer-default-export */
/* eslint-disable jsdoc/require-description-complete-sentence */
import { arrayEach, arrayMap } from '../../../helpers/array';
import { isObject } from '../../../helpers/object';
import { stringify } from '../../../helpers/mixed';
import { HEADER_DEFAULT_SETTINGS } from './constants';
import React from 'react';
// 处理header的配置数据
/**
 * A function that normalizes user-defined settings into one predictable
 * structure. Currently, the developer can declare nested headers by passing
 * the following unstructured (and sometimes uncompleted) array.
 *   [
 *     [{ label: 'A1', colspan: 2 }],
 *     [{ label: true }, 'B2', 4],
 *     [],
 *   ]
 *
 * The normalization process equalizes the length of columns to each header
 * layers to the same length and generates object settings with a common shape.
 * So the above mentioned example will be normalized into this:
 *   [
 *     [
 *       { label: 'A1', colspan: 2, isHidden: false, ... },
 *       { label: '', colspan: 1, isHidden: true, ... },
 *       { label: '', colspan: 1, isHidden: false, ... },
 *     ],
 *     [
 *       { label: 'true', colspan: 1, isHidden: false, ... },
 *       { label: 'B2', colspan: 1, isHidden: false, ... },
 *       { label: '4', colspan: 1, isHidden: false, ... },
 *     ],
 *     [
 *       { label: '', colspan: 1, isHidden: false, ... },
 *       { label: '', colspan: 1, isHidden: false, ... },
 *       { label: '', colspan: 1, isHidden: false, ... },
 *     ],
 *   ]
 *
 * @param {Array[]} sourceSettings An array with defined nested headers settings.
 * @param {number} [columnsLimit=Infinity] A number of columns to which the structure
 *                                         will be trimmed. While trimming the colspan
 *                                         values are adjusted to preserve the original
 *                                         structure.
 * @returns {Array[]}
 */
export function normalizeSettings(sourceSettings, columnsLimit = Infinity) {
  const normalizedSettings = [];

  if (columnsLimit === 0) {
    return normalizedSettings;
  }

  // Normalize array items (header settings) into one shape - literal object with default props.
  arrayEach(sourceSettings, (headersSettings) => {
    const columns = [];
    let columnIndex = 0;

    normalizedSettings.push(columns);
    arrayEach(headersSettings, (sourceHeaderSettings) => {
      const headerSettings = {
        ...HEADER_DEFAULT_SETTINGS,
      };

      if (isObject(sourceHeaderSettings)) {
        const {
          label, colspan, rowspan, // 增加rowspan ryp
        } = sourceHeaderSettings;
        if (React.isValidElement(label)) {
          headerSettings.label = label;
        } else if (React.isValidElement(sourceHeaderSettings)) {
          headerSettings.label = sourceHeaderSettings;
        } else {
          headerSettings.label = stringify(label);
        }

        if (typeof colspan === 'number' && colspan > 1) {
          headerSettings.colspan = colspan;
          headerSettings.origColspan = colspan;
        }
        // start: 增加rowspan ryp
        if (typeof rowspan === 'number' && rowspan > 1) {
          headerSettings.rowspan = rowspan;
          headerSettings.origRowspan = rowspan;
        } // end: // 增加rowspan ryp
      } else {
        headerSettings.label = stringify(sourceHeaderSettings);
      }

      columnIndex += headerSettings.origColspan;

      let cancelProcessing = false;

      if (columnIndex >= columnsLimit) {
        // Adjust the colspan value to not overlap the columns limit.
        headerSettings.colspan = headerSettings.origColspan - (columnIndex - columnsLimit);
        headerSettings.origColspan = headerSettings.colspan;
        cancelProcessing = true;
      }

      columns.push(headerSettings);

      if (headerSettings.colspan > 1) {
        for (let i = 0; i < headerSettings.colspan - 1; i++) {
          columns.push({
            ...HEADER_DEFAULT_SETTINGS,
            isHidden: true,
            isBlank: true,
          });
        }
      }

      return !cancelProcessing;
    });
  });

  const columnsLength = Math.max(...arrayMap(normalizedSettings, (headersSettings => headersSettings.length)));

  // Normalize the length of each header layer to the same columns length.
  arrayEach(normalizedSettings, (headersSettings) => {
    if (headersSettings.length < columnsLength) {
      const defaultSettings = arrayMap(
        new Array(columnsLength - headersSettings.length), () => ({ ...HEADER_DEFAULT_SETTINGS })
      );

      headersSettings.splice(headersSettings.length, 0, ...defaultSettings);
    }
  });
  return normalizedSettings;
}
