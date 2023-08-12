import { EndpointValidationError } from "@hilla/frontend";
import { Button } from "@hilla/react-components/Button.js";
import { Checkbox } from "@hilla/react-components/Checkbox.js";
import { HorizontalLayout } from "@hilla/react-components/HorizontalLayout.js";
import { TextField } from "@hilla/react-components/TextField.js";
import Todo from "Frontend/generated/com/example/application/Todo";
import { TodoEndpoint } from "Frontend/generated/endpoints";
import { FormikErrors, useFormik } from "formik";
import { Fragment, useEffect, useState } from "react";

export default function TodoView() {
  const [todos, setTodos] = useState(Array<Todo>());

  const formik = useFormik({
    initialValues: { task: '', done: false } as Todo,
    onSubmit: async (value: Todo, { setSubmitting, setErrors }) => {
      try {
        const saved = await TodoEndpoint.save({ ...value, createdAtInstant: new Date().toISOString(), createdAtDate: 'Sun, 21 Oct 2018 12:16:24 GMT' }) ?? value;
        setTodos([...todos, saved]);
        formik.resetForm();
      } catch (e: unknown) {
        if (e instanceof EndpointValidationError) {
          const errors: FormikErrors<Todo> = {}
          for (const error of e.validationErrorData) {
            if (typeof error.parameterName === 'string' && error.parameterName in value) {
              const key = error.parameterName as (string & keyof Todo);
              errors[key] = error.message;
            }
          }
          setErrors(errors);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  async function changeStatus(todo: Todo, done: boolean) {
    const newTodo = { ...todo, done: done };
    const saved = await TodoEndpoint.save(newTodo) ?? newTodo;
    setTodos(todos.map(item => item.id === todo.id ? saved : item));
  }

  async function remove(todo: Todo) {
    await TodoEndpoint.remove(todo.id!!);
    setTodos(todos.filter(item => item.id !== todo.id));
  }

  useEffect(() => {
    (async () => {
      setTodos(await TodoEndpoint.findAll());
    })();

    return () => { };
  }, []);

  return (
    <>
      <div className="m-m flex items-baseline gap-m">
        <TextField
          name='task'
          label="Task"
          value={formik.values.task}
          onChange={formik.handleChange}
          onBlur={formik.handleChange}
        />
        <Button
          theme="primary"
          disabled={formik.isSubmitting}
          onClick={formik.submitForm}
        >Add</Button>
      </div>
      <div className="m-m flex flex-col items-stretch gap-s">
        {Object.entries(formik.errors).map(([key, error]) => (
          <span key={key}>{error}</span>
        ))}
      </div>
      <div className="m-m flex flex-col items-stretch gap-s">
        {todos.map(todo => (
          <Fragment key={todo.id}>
            <HorizontalLayout theme="spacing padding">
              <Checkbox
                label={todo.task}
                checked={todo.done}
                style={({ textDecorationLine: todo.done ? "line-through" : "none" })}
                onCheckedChanged={({ detail: { value } }) => changeStatus(todo, value)} />
              <Button
                disabled={formik.isSubmitting}
                onClick={() => remove(todo)}>X</Button>
            </HorizontalLayout>
          </Fragment>
        ))}
      </div>
    </>
  );
}

