
/**
 * @constant TABLE_HEIGHT 表格scroll-y 需要减去的额外高度(默认状态，表格上方有操作按钮组和分页)
 */
const TABLE_HEIGHT = 330;

/**
 * @constant TABLE_HEIGHT_NOACTION 表格scroll-y 需要减去的额外高度(表格有分页，但上方不含操作按钮组)
 */
const TABLE_HEIGHT_NOACTION = 284;

/**
 * @constant TABLE_HEIGHT_NOPAGE 表格scroll-y 需要减去的额外高度 (表格有操作按钮组，但无分页)
 */
const TABLE_HEIGHT_NOPAGE = 284;

/**
 * @constant TABLE_HEIGHT_NOPAGE_NOACTION 表格scroll-y 需要减去的额外高度 (表格即无操作按钮组，也无分页)
 */
const TABLE_HEIGHT_NOPAGE_NOACTION = 220;


export {
  TABLE_HEIGHT,
  TABLE_HEIGHT_NOACTION,
  TABLE_HEIGHT_NOPAGE,
  TABLE_HEIGHT_NOPAGE_NOACTION,
};
