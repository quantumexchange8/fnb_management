import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table } from 'antd';
import { useEffect, useState } from 'react';


// Put this above your component return, or in another file
const DraggableTable = ({ dataSource, onChange }) => {
  const sensors = useSensors(useSensor(PointerSensor));
  const [items, setItems] = useState(dataSource.map(i => i.id));

  useEffect(() => {
    setItems(dataSource.map(i => i.id));
  }, [dataSource]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over.id);
    const newOrder = arrayMove(dataSource, oldIndex, newIndex);

    // Call parent to update state
    onChange(newOrder.map((item, index) => ({ ...item, sort_order: index + 1 })));
  };

  const rowKey = (record) => record.id;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <Table
          rowKey={rowKey}
          columns={modifierItemColumns}
          dataSource={dataSource}
          components={{
            body: {
              row: (props) => {
                const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
                  id: props['data-row-key'],
                });

                const style = {
                  ...props.style,
                  transform: CSS.Transform.toString(transform),
                  transition,
                };

                return (
                  <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
                    {props.children}
                  </tr>
                );
              },
            },
          }}
          pagination={false}
        />
      </SortableContext>
    </DndContext>
  );
};

export default DraggableTable;