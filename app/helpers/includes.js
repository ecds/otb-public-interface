import { helper } from '@ember/component/helper';

export function includes([list, item]) {
  if (list && item) {
    return list.includes(item);
  }
  return false;
}

export default helper(includes);
