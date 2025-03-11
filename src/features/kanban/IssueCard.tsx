import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import Card from "react-bootstrap/Card";

import { useAppDispatch } from "../../app/hooks";
import type { ColumnsNames, DragItem, IIssue } from "../../shared/types";
import { formatDateAgo } from "../../utils/helpers";
import { DRAG_ITEM_TYPE } from "../../config";
import { moveIssue } from "./kanbanSlice";

type IssueCardProps = IIssue & {
	index: number;
	columnName: ColumnsNames;
};

export const IssueCard = ({
	id,
	index,
	title,
	columnName,
	author,
	created_at,
	comments,
	number,
}: IssueCardProps) => {
	const ref = useRef<HTMLDivElement>(null);

	const dispatch = useAppDispatch();

	const [{ isDragging, currentDragId }, drag] = useDrag({
		type: DRAG_ITEM_TYPE,
		item: () => {
			return { id, index, columnName };
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		collect: (monitor: any) => ({
			isDragging: monitor.isDragging(),
			currentDragId: monitor.getItem()?.id,
		}),
	});

	const [, drop] = useDrop<DragItem>({
		accept: DRAG_ITEM_TYPE,
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			};
		},
		hover(item: DragItem) {
			if (!ref.current) {
				return;
			}
			const dragIndex = item.index;
			const hoverIndex = index;

			if (dragIndex === hoverIndex && item.columnName === columnName) {
				return;
			}

			dispatch(
				moveIssue({
					issueIndex: dragIndex,
					dropIndex: hoverIndex,
					fromColumn: item.columnName,
					toColumn: columnName,
				})
			);

			item.index = hoverIndex;
			item.columnName = columnName;
		},
	});
	drag(drop(ref));

	const opacity = isDragging || currentDragId === id ? 0.5 : 1;

	return (
		<Card ref={ref} style={{ opacity }}>
			<Card.Title className="text-truncate h6 p-3" title={title}>
				{title}
			</Card.Title>
			<Card.Body>
				<Card.Text>
					#{number} {formatDateAgo(created_at)}
				</Card.Text>
				<Card.Text>
					{author} Comments: {comments || 0}
				</Card.Text>
			</Card.Body>
		</Card>
	);
};
