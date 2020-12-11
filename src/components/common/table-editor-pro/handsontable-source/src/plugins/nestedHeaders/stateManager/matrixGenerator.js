/* eslint-disable import/prefer-default-export */
/* eslint-disable jsdoc/require-description-complete-sentence */
import { arrayEach } from '../../../helpers/array';
import { HEADER_DEFAULT_SETTINGS } from './constants';

/**
 * A function that dump a tree structure into multidimensional array. That structure is
 * later processed by header renderers to modify TH elements to achieve a proper
 * DOM structure.
 *
 * That structure contains settings object for every TH element generated by Walkontable.
 * The matrix operates on visual column index.
 *
 * Output example:
 *   [
 *     [
 *       { label: 'A1', colspan: 2, origColspan: 2, isHidden: false, ... },
 *       { label: '', colspan: 1, origColspan: 1, isHidden: true, ... },
 *       { label: '', colspan: 1, origColspan: 1, isHidden: false, ... },
 *     ],
 *     [
 *       { label: 'true', colspan: 1, origColspan: 1, isHidden: false, ... },
 *       { label: 'B2', colspan: 1, origColspan: 1, isHidden: false, ... },
 *       { label: '4', colspan: 1, origColspan: 1, isHidden: false, ... },
 *     ],
 *     [
 *       { label: '', colspan: 1, origColspan: 1, isHidden: false, ... },
 *       { label: '', colspan: 1, origColspan: 1, isHidden: false, ... },
 *       { label: '', colspan: 1, origColspan: 1, isHidden: false, ... },
 *     ],
 *   ]
 *
 * @param {TreeNode[]} headerRoots An array of root nodes.
 * @returns {Array[]}
 */
export function generateMatrix(headerRoots) {
  const matrix = [];
  arrayEach(headerRoots, (rootNode) => {
    rootNode.walkDown((node) => {
      const { data: { colspan, origColspan, label, isHidden, headerLevel, collapsible, isCollapsed, rowspan } } = node; // 增加rowspan ryp
      const colspanHeaderLayer = createNestedArrayIfNecessary(matrix, headerLevel);

      colspanHeaderLayer.push({
        label,
        colspan,
        origColspan,
        collapsible,
        isCollapsed,
        isHidden,
        isBlank: false,
        rowspan, // 将rowspan的属性加入进去 增加rowspan ryp
      });

      if (origColspan > 1) {
        for (let i = 0; i < origColspan - 1; i++) {
          colspanHeaderLayer.push({
            ...HEADER_DEFAULT_SETTINGS,
            origColspan,
            isHidden: true,
            isBlank: true,
          });
        }
      }
    });
  });

  return matrix;
}

/**
 * Internal helper which ensures that subarray exists under specified index.
 *
 * @param {Array[]} array An array to check.
 * @param {number} index An array index under the subarray should be checked.
 * @returns {Array}
 */
function createNestedArrayIfNecessary(array, index) {
  let subArray;

  if (Array.isArray(array[index])) {
    subArray = array[index];
  } else {
    subArray = [];
    array[index] = subArray;
  }

  return subArray;
}
