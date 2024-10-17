import React, { useState } from "react";
import { Button, Modal, Form, Input, Radio } from "antd";


const CreateForm = (props) => {
  const { visible, setVisible, onCreate } = props;
  const [form] = Form.useForm();

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onCreate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  return (
    <Modal
    open={visible}
      title="Nhập báo lỗi"
      okText="Ok"
      onCancel={() => {
        setVisible(false);
      }}
      onOk={handleCreate}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Nội dung lỗi"
          name="title"
          rules={[
            { required: true, message: "Please input the title of collection!" }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Ghi chú">
          <Input type="textarea" />
        </Form.Item>

        <Form.Item name="type" label="Type">
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

/**
 * Function version of the component below
 * @param {function} onChange when change occurs
 */
export const CollectionsPage2 = ({ onChange }) => {
  // const { onChange } = props;
  const [visible, setVisible] = useState(false);

  const onCreate = (values) => {
    onChange(values);
    setVisible(false);
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        Báo lỗi
      </Button>
      <CreateForm
        visible={visible}
        setVisible={setVisible}
        onCreate={onCreate}
      />
    </div>
  );
};

/**
 * Class version of the component above
 * @param {function} onChange when change occurs
 */
export class CollectionsPage extends React.Component {
  state = {
    visible: false
  };

  constructor(props) {
    super(props);
    this.onChange = this.props.onChange;
  }

  setVisible = (bool) => {
    this.setState({ visible: bool });
  };

  onCreate = (values) => {
    this.onChange(values);
    this.setVisible(false);
  };

  // It renders a button and a model consists of a form
  // Create form component
  render() {
    return (
      <div>
        <Button
          type="primary"
          onClick={() => {
            this.setVisible(true);
          }}
        >
          Báo lỗi
        </Button>
        <CreateForm
          visible={this.state.visible} // visibility flag
          setVisible={this.setVisible} // setVisible function as parameter
          onCreate={this.onCreate} // when form completed this function will bring the values
        />
      </div>
    );
  }
}

// render(<CollectionsPage />, document.getElementById("root"));
