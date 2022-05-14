import React, { Component } from "react";
import { Row, Col, Button } from "antd";

import "antd/dist/antd.css";

import { fetchUser } from "../../api/user";
import { globalSignOutHandler } from "../../api/auth";
import { API_URL } from "../../config";

export default class Profile extends Component {
  async componentDidMount() {
    const user = await fetchUser();
    this.props.storeUserState(user);
  }

  handleGlobalSignOut = async () => {
    await globalSignOutHandler();
    window.location.href = `${API_URL}/login`;
  }

  render() {
    const { user } = this.props;

    return (
      <div style={{ width: '200px', color: 'slategrey', padding: 0, margin: 0 }}>
        <Row>
          <Col span={24} style={{ borderBottom: '1px solid lightgray' }}>
            <p style={{ overflow: 'scroll', fontSize: '11px' }}>
              Signed in as <br/>
              <strong>{(user && user.email) || (user && user.name)}</strong>
            </p>
          </Col>
        </Row>
        {
          user && user.otherAccounts && user.otherAccounts.length > 0 && user.otherAccounts.map((userObj) => (
            <Row style={{ marginBottom: '5px' }}>
              <Col span={24} style={{ borderBottom: '1px solid lightgray', padding: '8px' }}>
                <a href={`/api/auth/google/switch/${userObj.userId}`} style={{ color: 'dimgrey' }}>
                  <p style={{ margin: 0, padding: 0 }}><strong>{userObj.name}</strong></p>
                  <sub style={{ margin: 0, padding: 0 }}>{userObj.email}</sub>
                </a>
              </Col>
            </Row>
          ))
        }
        <Row style={{ marginBottom: '5px' }}>
          <Col
            span={24}
            style={{
              padding: '5px',
              borderBottom: '1px solid lightgray'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around'
              }}
            >
              <a href="/api/auth/google" style={{ display: 'inline-block' }}>
                Add Another Google Account
              </a>
            </div>
          </Col>
        </Row>
        <Row style={{ margin: '8px 0' }}>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button
              type="default"
              style={{
                background: 'red',
                width: '100%',
                color: 'white',
                border: 'none'
              }}
              onClick={this.handleGlobalSignOut}
            >
              Sign out of all accounts
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}
