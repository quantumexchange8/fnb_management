// DragHandle.jsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripLine2lIcon, GripVerticalIcon } from './Icon/Outline';

export const DragHandle = ({ id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <GripVerticalIcon className="text-gray-400" />
    </div>
  );
};
