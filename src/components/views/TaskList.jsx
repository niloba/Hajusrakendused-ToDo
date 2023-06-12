import { DeleteOutlined, UserAddOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider } from "antd";
import produce from "immer";
import { useEffect } from "react";
import { useState } from "react";
import { taskFromServer, taskToServer } from "../../DTO/Task";
import useBackend from "../hooks/useBackend";
import debounce from "lodash.debounce"

export default function TaskList() {
  const { sendRequest } = useBackend();

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    sendRequest("/tasks", "GET").then((result) => {
      console.log(result);
      setTasks(result.map(taskFromServer));
    });
  }, []);

  const debouncedSaveTask = useCallback(debounce((task) => {
    sendRequest("/tasks/" + task.id, "PUT", taskToServer(task))
  }, 1000), []);

  const handleNameChange = (task, event) => {
    const newTasks = produce(tasks, (draft) => {
      const index = draft.findIndex((t) => t.id === task.id);
      draft[index].name = event.target.value;
    });
    setTasks(newTasks);

    saveTask(taskToServer(newTasks.find(t => t.id === task.id)))
  };

  debouncedSaveTask(newTask)

  const handleCompletedChange = (task, event) => {
    console.log(event);
    const newTasks = produce(tasks, draft => {
      const index = draft.findIndex(t => t.id === task.id);
      draft[index].completed = event.target.checked;
    });
    setTasks(newTasks);
    
    saveTask(taskToServer(newTasks.find(t => t.id === task.id)))
  };

  const handleAddTask = () => {
    setTasks(produce(tasks, (draft) => {
        draft.push({
          id: Math.random(),
          name: "",
          completed: false,
        });
    }));
    sendRequest("/tasks", "POST", {
        title: "Task " + Math.ceil(Math.random()*100)
    })
  };

  const handleDeleteTask = (task) => {
    setTasks(produce(tasks, draft => {
        const index = draft.findIndex(t => t.id === task.id);
        draft.splice(index, 1);
    }));
  };

  const saveTask = (task) => {
    if(!task.id)
        sendRequest("/tasks", "POST", task)
    else
        sendRequest("/tasks/"+task.id, "PUT", task)
  }

  return (
    <Row
      type="flex"
      justify="center"
      style={{ minHeight: "100vh", marginTop: "6rem" }}
    >
      <Col span={12}>
        <h1>Task List</h1>
        <Button onClick={handleAddTask}>Add Task</Button>
        <Divider />
        <List
          size="small"
          bordered
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item key={task.id}>
              <Row
                type="flex"
                justify="space-between"
                align="middle"
                style={{ width: "100%" }}
              >
                <Space>
                  <Checkbox
                    checked={task.completed}
                    onChange={(e) => handleCompletedChange(task, e)}
                  />
                  <Input
                    value={task.name}
                    onChange={(event) => handleNameChange(task, event)}
                  />
                </Space>
                <Button type="text" onClick={() => handleDeleteTask(task)}>
                  <DeleteOutlined />
                </Button>
              </Row>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
}
