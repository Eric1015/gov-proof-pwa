import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, Grid } from '@mui/material';
import Image from 'next/image';

type Props = {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
};

export default function ModeSelectCard({
  title,
  description,
  image,
  onClick,
}: Props) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={onClick}>
        <Grid container justifyContent="center">
          <Grid item>
            <Image src={image} alt="card image" height={100} width={100} />
          </Grid>
        </Grid>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
