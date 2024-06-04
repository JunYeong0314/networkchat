import { Input, Button, Space } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import React from 'react';

interface ChatInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}

const ChatInput = (props: ChatInputProps) => {
  return (
    <Space style={{ display: 'flex', flexDirection: 'row' }}>
      <Input
        style={{ width: '360px', padding: '10px 10px' }}
        placeholder="메시지를 입력하세요."
        value={props.value}
        onChange={props.onChange}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            props.onSend();
          }
        }}
      />
      <Button
        style={{
          width: '40px',
          height: '40px',
        }}
        onClick={props.onSend}
        type="primary"
        shape="circle"
        icon={<ArrowUpOutlined style={{ fontSize: '22px' }} />}
      />
    </Space>
  );
};

export default ChatInput;
