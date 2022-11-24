/*
	<Tic Tac Toe: An implementation of the classic game>
    Copyright (C) <2022>  <Cromega>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

const root = ReactDOM.createRoot(document.getElementById("root")),
		style = document.documentElement.style

function Box(props) {
	const color = props.value === "X"? "var(--third)":
					props.value === "O"? "var(--second)":"transparent",
			boxStyle ={
				backgroundColor: color,
			}

	return(
		<button className="box" style={boxStyle} onClick={props.action}>
		</button>
	)
}

class Board extends React.Component {

	renderBox(index) {
		return (
			<Box value={this.props.boxes[index]} action={() => this.props.action(index)}/>
		)
	}

	render() {
		return(
			<div>
				<div className="row">
					{this.renderBox(0)}
					{this.renderBox(1)}
					{this.renderBox(2)}
				</div>
				<div className="row">
					{this.renderBox(3)}
					{this.renderBox(4)}
					{this.renderBox(5)}
				</div>
				<div className="row">
					{this.renderBox(6)}
					{this.renderBox(7)}
					{this.renderBox(8)}
				</div>				
			</div>
		) 
	}
}

class Game extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			history: [{
				boxes: Array(9).fill(null)
			}],
			step: 0,
			next: "X",
			status: "playing",
		}
	}

	checkWinner(boxes) {
		const lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6]
		]
		
		for (let index = 0; index < lines.length; ++index) {
			const [first, second, third] = lines[index],
					conditions = [
						boxes[first]?? false,
						boxes[first] === boxes[second],
						boxes[first] === boxes[third]
					]
			if (conditions.every(condition => condition !== false)) {
				this.setState({
					status: boxes[first],
				})
				return true
			}
		}
		return false
	}


	actionClick(index) {
		const history = this.state.history.slice(0, this.state.step + 1),
				current = history[history.length - 1],
				boxes = current.boxes.slice()
		if (this.checkWinner(boxes) || boxes[index]) return

		boxes[index] = this.state.next
		this.setState({
			history: history.concat([{boxes: boxes}]),
			step: history.length,
			next: this.state.next === "X"? "O":"X"
		})

		this.checkWinner(boxes)
	}

	loadFrom(step) {
		this.setState({
			step: step,
			next: (step % 2) === 0? "X":"O",
			status: "playing"
		})
	}

	changeNextPlayerRotation() {
		if (this.state.status !== "playing") return
		
		style.setProperty(
			"--current-player",
			this.state.next === "X"? "90deg":"270deg"
		)
	}

	renderLoad(step, move, destiny) {
		return(
			<li key={move}>
				<button onClick={() => this.loadFrom(move)}>
					{destiny} <span>&#x21a9;</span>
				</button>
			</li>
		)
	}

	render() {

		const history = this.state.history,
				moves = history.map((step, move) => {
					return this.renderLoad(
						step, move,
						move? `Load from move: #${move}`:"Load from start"
					)
				}),
				current = history[this.state.step],
				status = this.state.status !== "playing" ?
							`Winner: ${this.state.status === "X"? "Player 1":"Player 2"}`:
							`Next Player: ${this.state.next === "X"? "Player 1":"Player 2"}`

		this.changeNextPlayerRotation()
		
		return (
			<div className="content">
				<header className="title">
					<h1>{status}</h1>
					<h1 className="shadow">{status}</h1>
				</header>
				<main className="game">
					<section className="board">
						<Board boxes={current.boxes} action={index => this.actionClick(index)}/>
					</section>
					<section className="info">
						<p>Loading Points</p>
						<ol>{moves}</ol>
					</section>
				</main>
			</div>
		)
	}
}

root.render(<Game />)
