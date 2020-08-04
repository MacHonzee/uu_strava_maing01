const MAX_NUMBER_OF_ITEMS = 20;

function overridenTextInputFind(items, foundValue) {
  let values = [];

  if (foundValue) {
    let foundValueLower = foundValue.toLowerCase();
    for (let item of items) {
      if (values.length >= MAX_NUMBER_OF_ITEMS) {
        break;
      }

      let lowerCased = item.value.toLowerCase()
      if (lowerCased.startsWith(foundValueLower)) {
        values.push(item);
      } else if (lowerCased.indexOf(foundValueLower) > -1) {
        values.push(item);
      }
    }
  }

  return values.length ? values : null;
}

export default overridenTextInputFind;
