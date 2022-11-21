import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

const root = ReactDOM.createRoot(document.getElementById("root"))

function Box(props) {
	const color = props.value === "X"? "var(--second)":
					props.value === "O"? "var(--third)":"transparent",
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
				console.log("here")
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
				status = this.state.status !== "playing" ? `Winner: ${this.state.status}`:`Next Player: ${this.state.next}`
		
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
