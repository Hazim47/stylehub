import { Box, Typography, Button } from "@mui/material";

import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h3">تم إرسال طلبك بنجاح 🎉</Typography>

      <Typography mt={3}>سيتم التواصل معك عبر واتساب</Typography>

      <Button
        component={Link}
        to="/"
        variant="contained"
        sx={{
          mt: 4,
        }}
      >
        العودة للرئيسية
      </Button>
    </Box>
  );
}

export default OrderSuccess;
