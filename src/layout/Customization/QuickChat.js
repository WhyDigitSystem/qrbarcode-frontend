import { Avatar, Box, Divider, Grid, IconButton, InputBase, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconSend } from '@tabler/icons-react';
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

const QuickChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'admin', text: 'Hello! How can I help you today?', timestamp: '10:00 AM' },
    { id: 2, sender: 'user', text: 'I have an issue with my account.', timestamp: '10:02 AM' }
  ]);
  const theme = useTheme();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: 'user', text: newMessage, timestamp: new Date().toLocaleTimeString() }]);
      setNewMessage('');
    }
  };

  return (
    <Grid container direction="column" justifyContent="space-between" sx={{ height: '100%' }}>
      <Grid item xs>
        <PerfectScrollbar component="div" style={{ height: '400px', padding: '16px' }}>
          {messages.map((message) => (
            <Box key={message.id} sx={{ mb: 2, display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              {message.sender !== 'user' && <Avatar sx={{ mr: 1 }}>A</Avatar>}
              <Paper
                sx={{
                  p: 1,
                  backgroundColor: message.sender === 'user' ? theme.palette.primary.main : theme.palette.grey[200],
                  color: message.sender === 'user' ? 'white' : 'black',
                  maxWidth: '75%',
                  borderRadius: 3
                }}
              >
                <Typography variant="body2">{message.text}</Typography>
                <Typography variant="caption" sx={{ mt: 0.5, display: 'block', textAlign: 'right', opacity: 0.7 }}>
                  {message.timestamp}
                </Typography>
              </Paper>
            </Box>
          ))}
        </PerfectScrollbar>
      </Grid>

      <Divider sx={{ my: 1 }} />

      <Grid item>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
          <InputBase
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{ flexGrow: 1, px: 2, borderRadius: '20px', backgroundColor: theme.palette.grey[200] }}
          />
          <IconButton onClick={handleSendMessage} color="primary">
            <IconSend />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  );
};

export default QuickChat;
