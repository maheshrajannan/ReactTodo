//INFO: beginning of TODO component.
var Todo = React.createClass({
  rawMarkup: function() {
    console.log('rawMarkup');
/**
INFO: built in protection against XSS attack.
All we're doing here is calling the marked library. We need to convert this.props.children from React's wrapped text to a raw string that marked will understand so we explicitly call toString().

But there's a problem! Our rendered comments look like this in the browser: "<p>This is <em>another</em> comment</p>". We want those tags to actually render as HTML.

That's React protecting you from an XSS attack. There's a way to get around it but the framework warns you not to use it:

var Todo = React.createClass({
  render: function() {
    return (
      <div className="todo">
        <h2 className="todoAuthor">
          {this.props.author}
        </h2>
        {marked(this.props.children.toString())}
      </div>
    );
  }
});

**/    
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="todo">
        <h2 className="todoAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});
//INFO: end of todo component, which is one todo.
//TodoBox is a class created by react with functions
//  1. loadTodosFromServer
//  2. handleTodoSubmit, called by render in JSX style.
//  3. getInitialState , over-ridden method, to override React's default behavior.
//  4. componentDidMount, over-ridden method, to override React's default behavior
//  5. render, overriden method, that must be overridden.

var TodoBox = React.createClass({
  //INFO: beginning of TODOBOX class created by react.
  loadTodosFromServer: function() {
    //INFO: called as <TodoBox url="http://localhost:3000/api/todos" pollInterval={999999999} />
    // url is referred as this.props.url. 
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        //INFO: this.setState will only work, as long as this points to the class created by REACT.
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        //INFO: this.props.url will only work, as long as this points to the class created by REACT.
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  /**

http://stackoverflow.com/questions/24285581/purpose-of-bindthis-at-end-of-ajax-callback

It ensure's this will be the correct object inside the callback. See Function.prototype.bind().
If you ran your original code in without bind, you'd get this error: TypeError: undefined is not a function because this === window in the callback;

or in strict mode: TypeError: Cannot read property 'setState' of undefined, where this === undefined in the callback.

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind


this.x = 9; 
var module = {
  x: 81,
  getX: function() { return this.x; }
};

module.getX(); // 81

var retrieveX = module.getX;
retrieveX(); // 9, because in this case, "this" refers to the global object

// Create a new function with 'this' bound to module
//New programmers (like myself) might confuse the global var getX with module's property getX
var boundGetX = retrieveX.bind(module);
boundGetX(); // 81

  **/
  handleTodoSubmit: function(todo) {
    var todos = this.state.data;
    //INFO: add the new todo to the existing list of todos.
    var newTodos = todos.concat([todo]);
    this.setState({data: newTodos});
    //INFO: simple jquery ajax call.
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: todo,
      success: function(data) {
        //INFO: set the data on the state.
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  /**
  INFO:getInitialState() executes exactly once during the lifecycle of the component and sets up the initial state of the component.
  **/
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    //INFO: calls once on mounting the component in react life cycle.
    this.loadTodosFromServer();
    setInterval(this.loadTodosFromServer, this.props.pollInterval);
  },
  render: function() {
    //INFO: this is JSX so use className instead of class.
    return (
      <div className="todoBox">
        <h1>Todos</h1>
        //INFO: refer var TodoList
        <TodoList data={this.state.data} />
        //INFO: refer var TodoForm
        <TodoForm onTodoSubmit={this.handleTodoSubmit} />
      </div>
    );
  }
  //INFO: end of ToDo class created by react.
  //INFO: 
  //  TODO Box contains 
  //    1. TodoList
  //    2. TodoForm    
});

//INFO:
  //  TODO List contains 
  //  list of todoNodes.
  
var TodoList = React.createClass({
  render: function() {
    var todoNodes = this.props.data.map(function(todo, index) {
      return (
        // `key` is a React-specific concept and is not mandatory.
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Todo author={todo.author} key={index}>
          {todo.text}
        </Todo>
      );
    });
    return (
      <div className="todoList">
        {todoNodes}
      </div>
    );
  }
});

//INFO: TODO form.

var TodoForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onTodoSubmit({author: author, text: text});
    this.refs.author.value = '';
    this.refs.text.value = '';
  },
  render: function() {
    return (
      <form className="todoForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="name" ref="author" /> 
        <input type="text" placeholder="todo..." ref="text" /> 
        <input type="submit" value="Post" />
      </form>
    );
  }
});
//INFO: End of TODO form.

//TODO: render todos in place of div element called content.
//INFO: ReactDOM.render(reactElement, domContainerNode).
ReactDOM.render(
  <TodoBox url="http://localhost:3000/api/todos" pollInterval={999999999} />,
  document.getElementById('content')
);
