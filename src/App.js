import React, { Component } from "react";
import { HGroup, VGroup } from "v-block.lite/layout";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Button, DatePicker, Input } from 'antd';
import SourceBox from "./SourceBox";
import TargetBox from "./TargetBox";
import SortableBox from './SortableBox';
const update = require("immutability-helper");

const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: "5rem",
    height: "2rem",
    color: '#3d3d3d',
    backgroundColor: "#e8e8e8",
    borderRadius: '8px',
    cursor: "move"
};

const cardActiveStyle = {
    backgroundColor: 'highlight'
};

function CardList(props) {

    const { cards, onAdd } = props;
    
    const cardItems = cards.map(({type}) => {
        return <SourceBox key={type} type={type} onEndDrag={onAdd} style={cardStyle} activeStyle={cardActiveStyle}>{type}</SourceBox>
    })
    return <VGroup width="120px" padding="1rem 0" horizontalAlign="center" gap={10}>{cardItems}</VGroup>;
}

const stencilStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#e8e8e8",
    borderRadius: '5px',
    cursor: "move",
    opacity: 1
};

const stencilActiveStyle = {
    opacity: 0
};

function getStencilByType(type) {

    if (type === 'button') {
        return <Button type="primary">我是一个按钮</Button>;
    }

    if (type === 'input') {
        return <Input placeholder="请输入内容..."/>;
    }

    if (type === 'date') {
        return <DatePicker />
    }
}

function Stencils(props) {

    const { stencils, onMove } = props;
    
    return (
        <VGroup gap={10}>
            {stencils.map((stencil, i) => (
                <SortableBox
                    key={stencil.id}
                    index={i}
                    id={stencil.id}
                    moveStencil={onMove}
                    style={stencilStyle}
                    activeStyle={stencilActiveStyle}
                >
                { getStencilByType(stencil.type) }
                </SortableBox>
            ))}
        </VGroup>
    );
}

const boxStyle = {
    width: 'inherit',
    padding: "1rem",
    border: "1px solid #e8e8e8"
};

const boxActiveStyle = {
    border: "1px solid red"
};

class App extends Component {
    
    state = {
        stencils: [
          {
            id: 1,
            type: "date"
          },
          {
            id: 2,
            type: "input"
          },
          {
            id: 3,
            type: "button"
          }
        ],
        cards: [
            {type: 'input'},
            {type: 'date'},
            {type: 'button'}
        ]
    };

    handleMove = (dragIndex, hoverIndex) => {
        const { stencils } = this.state;
        const dragStencil = stencils[dragIndex];
    
        this.setState(
          update(this.state, {
            stencils: {
              $splice: [[dragIndex, 1], [hoverIndex, 0, dragStencil]]
            }
          })
        );
    };

    addCard = (type) => {
        
        const { stencils } = this.state;
        const id = stencils.length + 1;

        this.setState(
            update(this.state, {
                stencils: {
                    $push: [{id, type}]
                }
            })
        )
    }


    render() {
        return (
            <HGroup gap={10} style={{ width: '100%'}} >
                <CardList cards={this.state.cards}  onAdd={this.addCard}/>
                <TargetBox style={boxStyle} activeStyle={boxActiveStyle}>
                    <Stencils stencils={this.state.stencils}  onMove={this.handleMove} />
                </TargetBox>
            </HGroup>
        );
    }
}

export default DragDropContext(HTML5Backend)(App);