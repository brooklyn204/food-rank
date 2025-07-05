import SortableItem from "./SortableItem";

export default function ItemArray({ items, vals, interactive = true, linePosition = -1 }) {
  // TODO: add error handling for items and vals
  return (
    <div>
      {items.map((id) => (
        <SortableItem
          key={id}
          id={id}
          text={vals[id]}
          draggable={interactive}
        />
      ))}
    </div>
  );
}