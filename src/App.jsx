import { createSignal, createEffect, onCleanup } from 'solid-js';

function TodoList() {

  // Stores list of todos
  const [todos, setTodos] = createSignal([]);
  // Stores the text of the new todo
  const [newTodo, setNewTodo] = createSignal('');

  // Adds a new todo to the list
  const addTodo = () => {
    if (!newTodo()) return;
    setTodos([...todos(), { text: newTodo(), done: false }]);
    setNewTodo('');
  };
  // Updates a todo in the list
  const updateTodo = (index, updates) => {
    const newTodos = [...todos()];
    newTodos[index] = { ...newTodos[index], ...updates };
    setTodos(newTodos);
  };
  // Deletes a todo from the list
  const deleteTodo = (index) => {
    const newTodos = [...todos()];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const handleEdit = (index, newText) => {
    updateTodo(index, { text: newText });
  };
  // Saves the todos to local storage on mount
  createEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos()));
  });
  // Removes the todos from local storage on unmount
  onCleanup(() => {
    localStorage.removeItem('todos');
  });
  // Loads the todos from local storage on mount
    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
   // Loads the todos from local storage on mount
  createEffect(() => {
    if (storedTodos.length && !todos().length) {
      setTodos(storedTodos);
    }
  });

  return (
    <div style={{ alignItems: 'center' }}>
      <input type="text" value={newTodo()} onInput={(e) => setNewTodo(e.target.value)} />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos().map((todo, index) => (
          <TodoItem
            key={index}
            index={index}
            text={todo.text}
            done={todo.done}
            onDelete={() => deleteTodo(index)}
            onEdit={handleEdit}
          />
        ))}
      </ul>
    </div>
  );
}



function TodoItem(props) {
  const [isEditing, setIsEditing] = createSignal(false);
  const [text, setText] = createSignal(props.text);
  const [done, setDone] = createSignal(props.done);

  const handleUpdate = (e) => {
    e.preventDefault();
    props.onEdit(props.index, text());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setText(props.text);
    setIsEditing(false);
  };

  return (
    <li>
      {!isEditing() ? (
        <div>
          <input type="checkbox" checked={done()} onInput={() => setDone(!done())} />
          <span style={{ textDecoration: done() ? 'line-through' : 'none' }}>{text()}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={props.onDelete}>Delete</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <input type="text" value={text()} onInput={(e) => setText(e.target.value)} />
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      )}
    </li>
  );
}

export default TodoList;