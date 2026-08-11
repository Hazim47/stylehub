import { Card, Skeleton, CardContent } from "@mui/material";

function LoadingCard() {
  return (
    <Card>
      <Skeleton variant="rectangular" height={280} />

      <CardContent>
        <Skeleton />

        <Skeleton width="60%" />
      </CardContent>
    </Card>
  );
}

export default LoadingCard;
