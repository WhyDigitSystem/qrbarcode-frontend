import { Card, CardContent } from '@mui/material';

const CardWrapper = ({ children, border = true, content = true, ...other }) => {
  return (
    <Card
      sx={{
        border: border ? '1px solid' : 'none',
        borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'),
        boxShadow: (theme) => theme.customShadows,
        ':hover': {
          boxShadow: (theme) => theme.customShadows
        },
        ...other.sx
      }}
      {...other}
    >
      {content ? <CardContent>{children}</CardContent> : children}
    </Card>
  );
};

export default CardWrapper;
