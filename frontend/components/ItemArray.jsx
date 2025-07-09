import SortableItem from "./SortableItem";
import DividerItem from "./DividerItem";

export default function ItemArray({ items, vals, interactive = true, linePosition = -1 }) {
  // TODO: add error handling for items and vals
  // TODO: rename all these confusing variables
  console.log('ItemArray rendered with items:', items, 'and vals:', vals);
  return (
    <div>
        {/* TODO: fix funky issue where item shrinks to size 0 when dragging across line */}
      {items.map((location, index) => {
      const isLine = location == -1;
      return isLine ? (
        <DividerItem key={location} id={location} />
        ) : (
        <SortableItem
          key={location}
          id={location}
          text={vals[location].name}
          draggable={interactive}
        />
      );
    })}
    </div>
  );
}