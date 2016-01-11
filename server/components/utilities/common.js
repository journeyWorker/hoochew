/**
 * Created by itmnext13 on 2016. 1. 12..
 */

'use strict';

export function validateEmail(email) {
  return (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i).test(email);
}
export function sortByRole(o) {
  switch (o.role) {
    case 'OWNER':
      return 1;
    case 'MEMBER':
      return 2;
    case 'GUEST':
      return 3;
    default:
      return 4;
  }
}
