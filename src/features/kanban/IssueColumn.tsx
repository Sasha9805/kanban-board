import { useDrop } from "react-dnd";

import { IssueCard } from "./IssueCard";
import type { ColumnsNames, DragItem, IIssue } from "../../shared/types";
import { DRAG_ITEM_TYPE } from "../../config";
import { useAppDispatch } from "../../app/hooks";
import { moveIssue } from "./kanbanSlice";

interface ColumnProps {
	title: ColumnsNames;
	issues: IIssue[];
}

export const IssueColumn = ({ title, issues }: ColumnProps) => {
	const dispatch = useAppDispatch();
	const [, drop] = useDrop<DragItem>({
		accept: DRAG_ITEM_TYPE,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		drop: (item, monitor: any) => {
			if (monitor.isOver({ shallow: true })) {
				dispatch(
					moveIssue({
						issueIndex: item.index,
						dropIndex: issues.length,
						fromColumn: item.columnName,
						toColumn: title,
					})
				);
			}
		},
	});
	return (
		<div
			ref={(el) => {
				drop(el);
			}}
			className="h-100 d-flex flex-column"
		>
			<h3 className="text-center text-uppercase">{title}</h3>
			<div className="d-flex flex-column flex-grow-1 gap-4 p-4 bg-info">
				{issues.map((issue, index) => (
					<IssueCard
						key={issue.id}
						index={index}
						columnName={title}
						{...issue}
					/>
				))}
			</div>
		</div>
	);
};
