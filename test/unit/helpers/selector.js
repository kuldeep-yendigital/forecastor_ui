/**
 * A lightweight version of the selector used within the
 * cucumber tests in that this version does not use
 * definitions within a configuration file but applies the
 * same selector syntax, i.e.

   `ribbon|dimension.company` -> `[data-selector~="ribbon"] [data-selector~="dimension company"]`

 * @param exp  the selector expression
 */
export const selector = exp =>
  exp.replace(' ', '').split('|').map(subexp =>
    `[data-selector~="${subexp.replace('.', ' ')}"]`).join(' ');
