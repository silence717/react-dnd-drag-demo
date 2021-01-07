import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { Button, Icon } from 'cloud-react';

import List from './list';
import { View, Text } from './components';

const source = {
	beginDrag(props) {
		const { parentId, item } = props;
		const { id, type, childrens } = item;
		return {
			id,
			parentId,
			type,
			items: childrens
		};
	},

	canDrag(props) {
		if (props.item.id === 1) return false;
		return true;
	},

	isDragging(props, monitor) {
		return props.item.id === monitor.getItem().id;
	},

	endDrag(props, monitor) {
		const result = monitor.getDropResult();
		if (result.dragItem) {
			const { dragItem, overItem } = result;
			props.move(dragItem, overItem);
		}
	}
};

function sourceCollect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging()
	};
}

const target = {
	canDrop(props, monitor) {
		// 被拖拽的组件类型
		// const dragType = monitor.getItem().type;
		// // 放置的组件类型
		// const dropType = props.item.type;

		// // SwiperItem 只可以放置在 Swiper 中
		// if (dragType === 'SwiperItem') {
		// 	return dropType === 'Swiper';
		// }
		return true;
	},

	drop(props, monitor) {
		const didDrop = monitor.didDrop();

		if (didDrop) {
			return undefined;
		}

		const { id: draggedId, parentId: dragParentId } = monitor.getItem();
		const { parentId: overParentId } = props;
		const { id: overId, type: overType } = props.item;

		if (draggedId) {
			if (draggedId === overId || draggedId === overParentId || dragParentId === overId || overParentId === null) return undefined;
			return {
				dragItem: { draggedId, dragParentId },
				overItem: { overId, overType, overParentId }
			};
		}
		return { id: overId };
	}
};

function targetCollect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver({ shallow: true }),
		canDrop: monitor.canDrop()
	};
}

const Components = {
	View,
	Text,
	Icon,
	Button,
};

class Item extends Component {
	render() {
		const { connectDropTarget, connectDragSource, canDrop, isOver, parentId, item, move } = this.props;

		const { id, type, childrens } = item;
		const CurrentComponet = Components[type];

		// const classes = classnames('', {
		// 	draggable: canPlace,
		// 	active: canDrop && isOver
		// });

		return (
			<CurrentComponet
				id={id}
				type={type}
				ref={instance => {
					// eslint-disable-next-line
					const node = findDOMNode(instance);
					connectDragSource(node);
					connectDropTarget(node);
				}}
				>
				<List parentId={id} items={childrens} move={move} />
			</CurrentComponet>
		);
	}
}

export default DropTarget('ITEM', target, targetCollect)(DragSource('ITEM', source, sourceCollect)(Item));
