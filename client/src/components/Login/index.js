import React, { Component } from "react";
import { Row, Col, Typography } from "antd";

import "antd/dist/antd.css";
import './Login.Google.css';
import { API_URL } from "../../config";

const { Title } = Typography;

export default class Home extends Component {
  render() {
    return (
      <>
        <Row style={{ marginBottom: '32px' }}>
          <Col span={24}>
            <Title level={1}>Welcome to the dashboard 👋</Title>
            <p>This dashboard supports OAuth 2.0 Authorization so you can sign-in using your Google account(s).</p>
            <p>
              It also supports multiple logged-in user accounts, just like Gmail. You can switch between your accounts without having to login every time.
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <p>
              Ready to play around?
            </p>
            <p>
              Please login to continue 🔑
            </p>
          </Col>
        </Row>

        <Row style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ margin: '0 5px 5px' }}>
            <a href={`${API_URL}/api/auth/google`}>
              <div class="google-btn">
                <div class="google-icon-wrapper">
                  <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                </div>
                <p class="btn-text"><b>Sign in with Google</b></p>
              </div>
            </a>
          </Col>
        </Row>
      </>
    )
  }
}
