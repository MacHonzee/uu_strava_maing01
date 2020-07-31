const MAX_NUMBER_OF_ITEMS = 20;

function overridenTextInputFind(items, foundValue) {
  let values = [];

  if (foundValue) {
    let foundValueLower = foundValue.toLowerCase();
    for (let item of items) {
      if (values.length >= MAX_NUMBER_OF_ITEMS) {
        break;
      }

      if (item.value.startsWith(foundValueLower)) {
        values.push(item);
      } else if (item.value.indexOf(foundValueLower) > -1) {
        values.push(item);
      }
    }
  }

  return values.length ? values : null;
}

export default overridenTextInputFind;
