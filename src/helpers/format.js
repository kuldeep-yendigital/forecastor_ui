export const formatCamelCase = str =>
  str && str.split && str.split('').reduce((a, v) => v.match(/[A-Z]/) ? a += ' ' + v : a + v);
export const formatKebabCase = str => 
  str && str.replace && str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase();