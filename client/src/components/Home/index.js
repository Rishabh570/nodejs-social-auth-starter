import React, { Component } from "react";
import { Row, Col, Typography } from "antd";
import { fetchUser } from "../../api/user";

import "antd/dist/antd.css";

const { Title } = Typography;

export default class Home extends Component {
  async componentDidMount() {
    const user = await fetchUser();
    this.props.storeUserState(user);
  }

  render() {
    const { user } = this.props;

    return (
      <>
        <Row style={{ marginBottom: '32px' }}>
          <Col span={24}>
            <Title level={1}>Hello {user && user.name} 👋</Title>
            <p>
              Email: {user && user.email}
            </p>
            <p>
              Welcome to the home page. This is a protected route and cannot be accessed without authentication.
            </p>
          </Col>
        </Row>
      </>
    )
  }
}
