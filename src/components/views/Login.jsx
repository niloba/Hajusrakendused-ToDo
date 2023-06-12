import { Form, Input, Button, Row, Col, notification } from "antd";
import { useNavigate } from "react-router";
import useBackend from "../hooks/useBackend";
import useLocalStorage from "use-local-storage";

export default function Login() {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useLocalStorage("accessToken", "");
    const {sendRequest} = useBackend()

    const onFinish = (values) => {
        console.log('Success:', values);

        sendRequest("/users/get-token", "POST", values)
            .then(response => {
                if(access_token !== "") {
                    notification.error({
                        message: 'Wrong username or password'
                    });
                    return;
                }
                
                setAccessToken(respones.access_token);
                notification.success({
                    message: "Logged in"
                });
                navigate("/")

            })

        console.log(JSON.stringify({
            username: values.username,
            newPassword: values.password
        })); 
        fetch('https://demo2.z-bit.ee/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: values.username,
                newPassword: values.password
            })
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch((error)  => {
                console.log(error);
            });
        notification.success({
            message: 'Logged in'
        });
        notification.error({
            message: 'Wrong username or password'
        });
        // navigate("/");
    };

    return (
        <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
            <Col span={4}>
                <h1>Login</h1>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ username: "", password: "" }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Login</Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}