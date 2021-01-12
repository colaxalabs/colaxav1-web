import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
  Modal,
  Typography,
  Row,
  Col,
  Empty,
  List,
  Avatar,
  Space,
} from 'antd'
import makeBlockie from 'ethereum-blockies-base64'

const { Text } = Typography

function Reviews({ count, comments, visible, cancel, loading }) {
  return (
    <Modal
      visible={visible}
      centered
      title='Reviews'
      footer={false}
      onCancel={cancel}
    >
      <Row justify='center' align='center'>
        {comments.length === 0 ? (
          <Col xs={24} xl={24}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </Col>
        ) : (
          <Col xs={24} xl={24}>
            <List
              itemLayout='horizontal'
              dataSource={comments}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={makeBlockie(String(item.reviewer))} />}
                    title={<Text ellipsis copyable style={{ width: 150 }}>{item.reviewer}</Text>}
                    description={
                      <Space direction='vertical'>
                        <Text type='secondary'>{`${new Date(item.date * 1000).toDateString()}`}</Text>
                        <Text>{item.comment}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            >
            </List>
          </Col>
        )}
      </Row>
    </Modal>
  )
}

Reviews.propTypes = {
  count: PropTypes.number,
  visible: PropTypes.bool,
  cancel: PropTypes.func,
  loading: PropTypes.bool,
  comments: PropTypes.array,
}

function mapStateToProps(state) {
  return {
    loading: state.loading.loadingReviews,
  }
}

export default connect(mapStateToProps)(Reviews)

