import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, query, onSnapshot, Timestamp, orderBy } from 'firebase/firestore';
import { auth } from './firebase';
import { Input, Button, List, Typography, Layout, Form, Space } from 'antd';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (message.trim() !== '') {
      await addDoc(collection(db, 'messages'), {
        text: message,
        createdAt: Timestamp.now(),
        user: auth.currentUser?.email,
      });
      setMessage('');
    }
  };

  return (
    <Layout style={{ width:"100vw", height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header style={{ color: 'white', fontSize: '20px', textAlign: 'center' }}>
        Chat Uygulaması
      </Header>
      <Content style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '20px' 
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '600px', 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '10px' 
          }}>
            <List
              dataSource={messages}
              renderItem={(msg) => (
                <List.Item key={msg.id}>
                  <Text strong>{msg.user}: </Text> {msg.text}
                </List.Item>
              )}
              bordered={false}
            />
          </div>
          <Footer style={{ padding: '10px' }}>
            <Form onFinish={sendMessage}>
              <Form.Item style={{ margin: 0 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mesajınızı yazın"
                    onPressEnter={sendMessage}
                  />
                  <Button type="primary" htmlType="submit" block>
                    Gönder
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Footer>
        </div>
      </Content>
    </Layout>
  );
};

export default Chat;
