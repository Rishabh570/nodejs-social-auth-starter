import React, { Component } from "react";
import { Layout, Row, Col, Typography, Button } from "antd";
import { Link } from "react-router-dom";
import { Router } from './router';

import { API_URL, COOKIE_NAME } from './config';
import { globalSignOutHandler } from "./api/auth";
import { getCookie } from './utils/common';

import "antd/dist/antd.css";
import './App.css';

const { Content, Header } = Layout;
const { Title } = Typography;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      user: {
        name: 'there'
      },
    }
  }

  storeUserState = (user) => {
    this.setState({ user });
  }
  
  async componentDidMount() {
    const cookieContent = getCookie(COOKIE_NAME);
    const isAuthenticated = !!(cookieContent && cookieContent.length > 0);
    this.setState({ isAuthenticated });
  }

  handleGlobalSignOut = async () => {
    await globalSignOutHandler();
    window.location.href = `${API_URL}/login`;
  }

  render() {
    // extracting auth status from cookie as componentDidMount hasn't run yet
    const cookieContent = getCookie(COOKIE_NAME);
    const isAuthenticated = !!(cookieContent && cookieContent.length > 0);

    return (
      <div className="App">
        <Layout>
          <Header>
            <Row
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                textAlign: 'end'
              }}
            >
              <Col
                span={12}
                style={{
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Link to="/">
                  <Title level={2} style={{ color: "white", margin: 0 }}>
                    OAuth 2.0 Dashboard ✨
                  </Title>
                  <p></p>
                </Link>
              </Col>
              <Col
                span={12}
                style={{
                  color: 'gold',
                  verticalAlign: 'center'
                }}
              >
                {
                  isAuthenticated &&
                  <Button
                    type="default"
                    style={{ backgroundColor: 'red', color: 'white' }}
                    onClick={this.handleGlobalSignOut}
                  >
                    Logout
                  </Button>
                }
              </Col>
            </Row>
          </Header>

          <Layout>
            <Content
              style={{
                padding: 16,
                margin: 'auto',
                minHeight: "calc(100vh - 64px)",
                width: '960px'
              }}
            >
              <Router
                isAuthenticated={isAuthenticated}
                user={this.state.user}
                storeUserState={this.storeUserState}
              />
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
