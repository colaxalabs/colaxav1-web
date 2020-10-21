import React from 'react'
import { Menu, Layout } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'

import { Media } from './Media'

const { Header, Sider, Content } = Layout

class DesktopContainer extends React.Component {

  state = {
    isCollapsed: false
  }

  toggle = () => this.setState(prevState => ({
    isCollapsed: !prevState.isCollapsed
  }))

  render() {

    const { children } = this.props

    return (
      <>
        <Media greaterThan='mobile'>
          <Layout>
            <Sider trigger={null} collapsible collapsed={this.state.isCollapsed}>
              <Menu theme='dark' mode='inline'>
                <Menu.Item>
                  Dormant
                </Menu.Item>
                <Menu.Item>
                  Preparation
                </Menu.Item>
                <Menu.Item>
                  Planting
                </Menu.Item>
                <Menu.Item>
                  Crop Growth
                </Menu.Item>
                <Menu.Item>
                  Booking
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout className='site-layout'>
              <Header className='site-layout-background'>
                {React.createElement(this.state.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, { onClick: this.toggle })}
              </Header>
              <Content
                className='site-layout-background'
                style={{
                  margin: '24px 16px',
                  padding: 24,
                  minHeight: 280,
                }}
              >
                {children}
              </Content>
            </Layout>
          </Layout>
        </Media>
      </>
    )
  }
}

export default DesktopContainer

