import PropTypes from 'prop-types'
import React from 'react'
import {
  Space,
  Avatar,
  Image,
  Menu,
  Layout,
  Typography,
} from 'antd'
import {
  WalletOutlined,
  CalendarOutlined,
  HourglassOutlined,
  QuestionOutlined,
  AlertOutlined,
  RocketOutlined,
  Loading3QuartersOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
import { connect } from 'react-redux'
import makeBlockie from 'ethereum-blockies-base64'

import { Media } from './Media'

const { Header, Sider, Content } = Layout
const { Text } = Typography

class DesktopContainer extends React.Component {

  state = {
    isCollapsed: false
  }

  toggle = () => this.setState(prevState => ({
    isCollapsed: !prevState.isCollapsed
  }))

  render() {

    const { children, walletLoaded, wallet } = this.props

    return (
      <>
        <Media greaterThan='mobile'>
          <Layout style={{ minHeight: '100vh' }}>
            <Sider
              style={{ overflow: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0 }}
              breakpoint='sm'
              collapsedWidth='80'
              onCollapse={this.toggle}
              collapsible
              collapsed={this.state.isCollapsed}
              trigger={null}
            >
                <Menu theme="dark" mode="inline">
                  <Menu.Item
                    disabled
                    icon={
                      <Image
                        width={40}
                        height={30}
                        src='https://gateway.pinata.cloud/ipfs/QmaFbmHGWjUXbfyfTNPqhG1ajEyucszxDBXvzP1E9kbUCp'
                        style={{ paddingRight: '10px' }}
                      />
                    }
                    style={{ fontSize: '32px', marginBottom: '30px', fontWeight: 'bold' }}
                  >
                    Colaxa
                  </Menu.Item>
                  <Menu.Item icon={<QuestionOutlined />}>
                    Dormant
                  </Menu.Item>
                  <Menu.Item icon={<Loading3QuartersOutlined />}>
                    Preparation
                  </Menu.Item>
                  <Menu.Item icon={<RocketOutlined />}>
                    Planting
                  </Menu.Item>
                  <Menu.Item icon={<HourglassOutlined />}>
                    Crop Growth
                  </Menu.Item>
                  <Menu.Item icon={<AlertOutlined />}>
                    Harvesting
                  </Menu.Item>
                  <Menu.Item icon={<CalendarOutlined />}>
                    Booking
                  </Menu.Item>
                  <Menu.Item style={{ marginTop: '25px' }} icon={<WalletOutlined />}>
                    <a href='/wallet/'>
                      Wallet
                    </a>
                  </Menu.Item>
                </Menu>
              </Sider>
              <Layout className="site-layout">
                <Header className='site-layout-background' style={{ padding: 0 }}>
                  {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: this.toggle,
                  })}
                  {walletLoaded ? (
                    <Space className='logo'>
                      <div>
                        <Space>
                          <Avatar
                            src={makeBlockie(String(wallet.address[0]))}
                            size={25}
                          />
                          <Text ellipsis className='addr' copyable>{wallet.address[0]}</Text>
                        </Space>
                      </div>
                    </Space>
                  ) : null}
                </Header>
                <Content
                  style={{
                    margin: '24px 16px 0',
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

DesktopContainer.propTypes = {
  children: PropTypes.object,
  walletLoaded: PropTypes.bool,
  wallet: PropTypes.object,
}

function mapStateToProps(state) {
  return {
    walletLoaded: state.wallet.loaded,
    wallet: state.wallet,
  }
}

export default connect(mapStateToProps)(DesktopContainer)

