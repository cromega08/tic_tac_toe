import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

const root = ReactDOM.createRoot(document.getElementById("root"))

function checkWinner(boxes) {
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
					boxes[second] === boxes[third]
				]
		if (conditions.every(condition => condition === true)) {
			return boxes[first]
		}
	}

	return null
}

function Box(props) {
	return(
		<button className="box" onClick={props.action}>
			{props.value}
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
		}
	}

	actionClick(index) {
		const history = this.state.history.slice(0, this.state.step + 1),
				current = history[history.length - 1],
				boxes = current.boxes.slice()

		boxes[index] = this.state.next
		this.setState({
			history: history.concat([{boxes: boxes}]),
			step: history.length,
			next: this.state.next === "X"? "O":"X"
		})
	}

	loadFrom(step) {
		this.setState({
			step: step,
			next: (step % 2) === 0? "X":"O"
		})
	}

	render() {
		const history = this.state.history,
				moves = history.map((step, move) => {
					const destiny = move? `Load from move: #${move}`:"Restart the game"
					return (
						<li key={move}>
							<button onClick={() => this.loadFrom(move)}>
								{destiny}
							</button>
						</li>
					)
				}),
				current = history[this.state.step],
				winner = checkWinner(current.boxes),
				status = winner? `Winner: ${winner}`:`Next Player: ${this.state.next}`
		
		return (
			<main className="game">
				<section className="board">
					<Board boxes={current.boxes} action={index => this.actionClick(index)}/>
				</section>
				<section className="info">
					<article>{status}</article>
					<ol>{moves}</ol>
				</section>
			</main>
		)
	}
}

class Website extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			status: ""
		}
	}

	changeHeader(newText) {
		this.setState({
			status: newText
		})
	}

	render() {
		return (
			<header>
				<h1>{this.state.status}</h1>
			</header>
			
		)
	}
}

root.render(<Game />)
