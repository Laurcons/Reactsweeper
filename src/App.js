// import logo from './logo.svg';
import './media/roboto-regular.ttf';
import './App.css';
import Board from './Board';
import React from 'react';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                width: 10,
                height: 10,
                bombs: parseInt(10*10/8),
            },
        };
        this.state.board = <Board key={Date.now()} width={this.state.form.width} height={this.state.form.height} bombs={this.state.form.bombs} />;

        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFormChange(e) {
        const target = e.target;
        const value = /*target.type === 'checkbox' ? target.checked : */target.value;
        const name = target.name;

        let form = this.state.form;
        form[name] = parseInt(value);

        this.setState({
            form
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({
            board: <Board key={Date.now()} width={this.state.form.width} height={this.state.form.height} bombs={this.state.form.bombs} />,
        });
    }

    render() {
        return (
            <div className="App container my-5">
                <a className="btn btn-primary btn-sm" href="https://laurcons.ro/projects">Back to the website</a>
                <div className="boardControl">
                    Regenerate board:
                    <form onSubmit={this.handleSubmit}>
                        <select name="width" value={this.state.form.width} onChange={this.handleFormChange}>
                            {
                                [...Array(15).keys()].map(num => num + 5).map((num) => {
                                    return <option key={num} value={num}>{num}</option>
                                })
                            }
                        </select>
                        x
                        <select name="height" value={this.state.form.height} onChange={this.handleFormChange}>
                            {
                                [...Array(15).keys()].map(num => num + 5).map((num) => {
                                    return <option key={num} value={num}>{num}</option>
                                })
                            }
                        </select>
                        with
                        <select name="bombs" value={this.state.form.bombs} onChange={this.handleFormChange}>
                            {
                                [...Array(parseInt(this.state.form.height * this.state.form.width / 4)).keys()].map((num) => {
                                    return <option key={num} value={num}>{num}</option>
                                })
                            }
                        </select>
                        bombs
                        <button type="submit">
                            Regenerate!
                        </button>
                    </form>
                </div>
                {this.state.board}
            </div>
        );
    }
}

export default App;
