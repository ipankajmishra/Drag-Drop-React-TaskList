import React, { Component } from "react";
import "./DragAndDrop.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      titles: [],
      dragSource: null,
      dragTarget: null,
      taskToAdd: "",
      titleName: "",
    };
    this.onDrop = this.onDrop.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDragExit = this.onDragExit.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.isDragSource = this.isDragSource.bind(this);
    this.isValidDragTarget = this.isValidDragTarget.bind(this);
    this.isDragTarget = this.isDragTarget.bind(this);
    this.moveElement = this.moveElement.bind(this);
  }

  componentDidMount() {
    let elements = localStorage.getItem("myData");
    let titles = localStorage.getItem("myTitles");
    if (!elements) {
      elements = [];
    }
    if (!titles) {
      titles = [];
    }
    this.setState({
      elements: JSON.parse(elements),
      titles: JSON.parse(titles),
    });
  }

  onDrop(e) {
    if (this.isValidDragTarget(this.state.dragTarget)) {
      e.preventDefault();
      const elementId = e.dataTransfer.getData("text/plain");
      this.moveElement(elementId);
    }
  }

  moveElement(id) {
    const sourceElements = this.state.elements[this.state.dragSource].filter(
      (e) => e !== id
    );
    let array = this.state.elements;
    array[this.state.dragSource] = sourceElements;
    let targetArr = array[this.state.dragTarget];
    targetArr.unshift(id);
    array[this.state.dragTarget] = targetArr;
    this.setState((state) => ({
      elements: array,
      dragSource: null,
      dragTarget: null,
    }));
    this.upDateLocalStorage();
  }

  upDateLocalStorage = () => {
    localStorage.setItem("myData", JSON.stringify(this.state.elements));
    localStorage.setItem("myTitles", JSON.stringify(this.state.titles));
  };

  onDragStart(source) {
    this.setState({ dragSource: source });
  }

  onDragEnter(e, id) {
    if (this.isValidDragTarget(id)) {
      this.setState({ dragTarget: id });
    }
  }

  onDragOver(e, id) {
    if (this.isDragTarget(id)) {
      e.preventDefault();
    }
  }

  onDragLeave(e, id) {
    if (id === this.state.dragTarget) {
      this.setState({ dragTarget: null });
    }
  }

  onDragExit() {}

  onChangeTaskToAdd = (e) => {
    this.setState({
      taskToAdd: e.target.value,
    });
  };

  onChangeNewListItem = (e) => {
    this.setState({
      titleName: e.target.value,
    });
  };

  addTask = (key) => {
    let arr = this.state.elements;
    arr[key].push(this.state.taskToAdd);
    this.setState(
      {
        elements: arr,
      },
      () => this.upDateLocalStorage()
    );
  };

  addNewList = () => {
    let arr = this.state.elements;
    let titles = this.state.titles;
    titles.push(this.state.titleName);
    arr.push([]);
    this.setState(
      {
        elements: arr,
        titles,
      },
      () => {
        this.upDateLocalStorage();
      }
    );
  };

  removeTask = (key) => {
    let arr = this.state.elements;
    let titles = this.state.titles;
    arr.splice(key, 1);
    titles.splice(key, 1);
    this.setState(
      {
        elements: arr,
        titles,
      },
      () => this.upDateLocalStorage()
    );
  };

  deleteThisItem = (e, id) => {
    let arr = this.state.elements;
    let index = arr[id].indexOf(e);
    arr[id].splice(index, 1);
    this.setState(
      {
        elements: arr,
      },
      () => this.upDateLocalStorage()
    );
  };

  onDragEnd() {
    this.setState({ dragSource: null, dragTarget: null });
  }

  isValidDragTarget(id) {
    return id !== this.state.dragSource;
  }

  isDragTarget(id) {
    return id === this.state.dragTarget && this.state.dragTarget !== null;
  }

  isDragSource(id) {
    return id === this.state.dragSource;
  }

  render() {
    const data =
      this.state.elements.length > 0 &&
      this.state.elements.map((data, key) => {
        return (
          <>
            <div className="" style={{ display: "", marginBottom: "10px" }}>
              <input
                placeholder="Enter new item"
                onChange={(e) => this.onChangeTaskToAdd(e, key)}
              />
              <button onClick={() => this.addTask(key)}>Add</button>
              <button onClick={() => this.removeTask(key)}>Remove</button>
            </div>
            <div>
              <h3>{this.state.titles[key]}</h3>
            </div>

            <DragAndDrop
              elements={data}
              deleteThisItem={this.deleteThisItem}
              id={key}
              onDrop={this.onDrop}
              onDragStart={this.onDragStart}
              onDragEnter={this.onDragEnter}
              onDragOver={this.onDragOver}
              onDragLeave={this.onDragLeave}
              onDragExit={this.onDragExit}
              onDragEnd={this.onDragEnd}
              isDragTarget={this.isDragTarget}
              isDragSource={this.isDragSource}
            />
          </>
        );
      });
    return (
      <>
        <div
          style={{
            marginBottom: "50px",
            marginLeft: "10px",
            marginTop: "10px",
            display: "flex",
          }}
        >
          <input
            onChange={(e) => this.onChangeNewListItem(e)}
            placeholder="Enter new List"
          />
          <button onClick={() => this.addNewList()}>Add</button>
        </div>
        <div className="wrapper">
          <div style={{ display: "" }}>{data}</div>
        </div>
      </>
    );
  }
}

class DragAndDrop extends React.Component {
  constructor(props) {
    super(props);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
  }

  onDragOver(e) {
    this.props.onDragOver(e, this.props.id);
  }

  onDragEnter(e) {
    this.props.onDragEnter(e, this.props.id);
  }

  onDragLeave(e) {
    if (e.target.id === this.props.id) {
      this.props.onDragLeave(e, this.props.id);
    }
  }

  onDragExit(e) {}

  onDragStart(e) {
    this.props.onDragStart(this.props.id);
  }

  onDragEnd(e) {
    this.props.onDragEnd();
  }

  onDrop(e) {
    this.props.onDrop(e);
  }

  render() {
    const focused = this.props.isDragTarget(this.props.id) ? "drag-enter" : "";
    return (
      <>
        <div
          id={this.props.id}
          key={this.props.id}
          className={"drag-and-drop-wrapper " + focused}
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
          onDragEnter={this.onDragEnter}
          onDragLeave={(e) => this.onDragLeave(e)}
          onDrop={this.onDrop}
          onDragOver={this.onDragOver}
        >
          {this.props.elements.map((e) => (
            <div>
              <div style={{ display: "inline-flex" }}>
                <DragAndDropElement key={e} element={e} />
                <p
                  style={{
                    margin: "0",
                    marginLeft: "10px",
                    marginTop: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => this.props.deleteThisItem(e, this.props.id)}
                >
                  X
                </p>
              </div>
              <br></br>
            </div>
          ))}
        </div>
      </>
    );
  }
}

const DragAndDropElement = ({ element }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.dropEffect = "move";
  };
  return (
    <div
      key={element}
      id={element}
      className={"row"}
      draggable={true}
      onDragStart={onDragStart}
    >
      <Drag /> {element}
    </div>
  );
};

const Drag = () => {
  return <div className={"drag"}>||| </div>;
};

export default App;
