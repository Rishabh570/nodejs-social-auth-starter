import React, { Component } from "react";
import { Row, Col, Typography } from "antd";

import "antd/dist/antd.css";

import { fetchUser } from "../../api/user";

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
              Welcome to the home page. This is a protected route and cannot be accessed without authentication.
            </p>
          </Col>
        </Row>

        <Row
          style={{
            marginBottom: '32px'
          }}
        >
          <Col span={24}>
            <Title level={3}>Currently connected accounts: {user && user.connectedSocialAccounts}</Title>
            <p>
              You can sign in with any one of the connected providers to access this account.
            </p>
            <p>
              You cannot however disconnect all the providers from the account. There must be at least one provider linked at all times. This is required because there is no way for you to log back into this account once all social providers are disconnected. For this reason, real-world applications ask for a email-password or mobile number to act as a backup login method.
            </p>
          </Col>
          {
            user && user.amazon && user.connectedSocialAccounts > 1 &&
            <Col style={{ margin: '0 5px 5px' }}>
              <a href="/api/auth/amazon/disconnect">
                <div class="google-btn">
                  <div class="google-icon-wrapper">
                    <img class="google-icon" src="amazon-brand-logo.png"/>
                  </div>
                  <p class="btn-text"><b>Disconnect Amazon</b></p>
                </div>
              </a>
            </Col>
          }
          {
            user && user.google && user.connectedSocialAccounts > 1 &&
            <Col style={{ margin: '0 5px 5px' }}>
              <a href="/api/auth/google/disconnect">
                <div class="google-btn">
                  <div class="google-icon-wrapper">
                    <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                  </div>
                  <p class="btn-text"><b>Disconnect Google</b></p>
                </div>
              </a>
            </Col>
          }
          {
            user && user.github && user.connectedSocialAccounts > 1 &&
            <Col style={{ margin: '0 5px 5px' }}>
              <a href="/api/auth/github/disconnect">
                <div class="github-btn">
                  <div class="github-icon-wrapper">
                    <img class="github-icon" src="github-brand-logo.png"/>
                  </div>
                  <p class="btn-text"><b>Disconnect Github</b></p>
                </div>
              </a>
            </Col>
          }
        </Row>

        <Row
          style={{
            marginBottom: '32px'
          }}
        >
          <Col span={24}>
            <Title level={3}>Want to connect more accounts?</Title>
          </Col>
          {
            user && !user.amazon &&
            <Col style={{ margin: '0 5px 5px' }}>
              <a href="/api/auth/amazon">
                <div class="google-btn">
                  <div class="google-icon-wrapper">
                    <img class="google-icon" src="amazon-brand-logo.png"/>
                  </div>
                  <p class="btn-text"><b>Connect Amazon</b></p>
                </div>
              </a>
            </Col>
          }
          {
            user && !user.google &&
            <Col style={{ margin: '0 5px 5px' }}>
              <a href="/api/auth/google">
                <div class="google-btn">
                  <div class="google-icon-wrapper">
                    <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                  </div>
                  <p class="btn-text"><b>Connect Google</b></p>
                </div>
              </a>
            </Col>
          }
          {
            user && !user.github &&
            <Col style={{ margin: '0 5px 5px' }}>
              <a href="/api/auth/github">
                <div class="github-btn">
                  <div class="github-icon-wrapper">
                    <img class="github-icon" src="github-brand-logo.png"/>
                  </div>
                  <p class="btn-text"><b>Connect Github</b></p>
                </div>
              </a>
            </Col>
          }
        </Row>
      </>
    )
  }
}
