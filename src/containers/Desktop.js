import PropTypes from 'prop-types'
import React from 'react'
import {
  Space,
  Avatar,
  Image,
  Menu,
  Layout,
  Typography,
  Dropdown,
  Button,
} from 'antd'
import {
  PlusCircleOutlined,
  GlobalOutlined,
  ScanOutlined,
  SwapOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  EyeOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { connect } from 'react-redux'
import makeBlockie from 'ethereum-blockies-base64'

// Redux actions
import { disconnectWallet, connectWallet } from '../actions'

import { Media } from './Media'

const { Header, Sider, Content } = Layout
const { Text } = Typography
const { SubMenu } = Menu



class DesktopContainer extends React.Component {

  state = {
    isCollapsed: false
  }

  toggle = () => this.setState(prevState => ({
    isCollapsed: !prevState.isCollapsed
  }))

  render() {

    const { children, walletLoaded, wallet, connectWallet, disconnectWallet } = this.props
    const menu = (
      <Menu>
        <Menu.Item icon={<EyeOutlined />}>
          <a href='/wallet/'>
            View Profile
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item icon={<LogoutOutlined />}>
          <a onClick={(e) => {
            e.preventDefault()
            disconnectWallet()
          }}>
            Sign Out
          </a>
        </Menu.Item>
      </Menu>
    )

    return (
      <>
        <Media greaterThan='mobile'>
          <Layout style={{ minHeight: '100vh' }}>
            <Sider
              style={{ backgroundColor: '#fff', overflow: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0 }}
              breakpoint='sm'
              collapsedWidth='80'
              onCollapse={this.toggle}
              collapsible
              collapsed={this.state.isCollapsed}
              trigger={null}
            >
                <Menu mode="inline">
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
                    Reap
                  </Menu.Item>
                  <SubMenu key='sub1' icon={<SwapOutlined />} title='Tokenization'>
                    <Menu.Item key='1' icon={<PlusCircleOutlined />}>
                      <a href='/register/'>
                        Register
                      </a>
                    </Menu.Item>
                  </SubMenu>
                  <Menu.Item key='2' icon={<GlobalOutlined />}>
                    Market
                  </Menu.Item>
                  <Menu.Item key='3' icon={<ScanOutlined />}>
                    Trace
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
                     <Dropdown overlay={menu} className='logo'>
                       <a onClick={(e) => e.preventDefault()}>
                         <Space>
                          <Avatar src={makeBlockie(String(wallet.address[0]))} size={25} />
                          <Text ellipsis className='addr' copyable>{wallet.address[0]}</Text>
                          <DownOutlined />
                         </Space>
                       </a>
                     </Dropdown>
                  ) : (
                    <Space className='logo'>
                      <Button
                        type='primary'
                        onClick={connectWallet}
                      >
                        Connect Wallet
                      </Button>
                    </Space>
                  )}
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
  connectWallet: PropTypes.func,
  disconnectWallet: PropTypes.func,
}

function mapStateToProps(state) {
  return {
    walletLoaded: state.wallet.loaded,
    wallet: state.wallet,
  }
}

export default connect(mapStateToProps, { disconnectWallet, connectWallet })(DesktopContainer)

